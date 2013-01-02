var fs = require('fs')
  , path = require('path');

var find = module.exports = {

  // file:     function(pat, root, callback) {}   
  // dir:      function(pat, root, callback) {}

  // fileSync: function(pat, root) {}
  // dirSync:  function(pat, root) {}
 
  // eachfile: function(pat, root, action) {}
  // eachdir:  function(pat, root, action) {}

};


var is = (function(expose) {
  var method = {
      'String': 'string'
    , 'RegExp': 'regx'
    , 'Array' : 'array'
  };
  Object.keys(method).forEach(function(type) {
    expose[method[type]] = function(input) {
      return Object.prototype.toString.call(input) === '[object ' + type +  ']'; 
    }
  });
  return expose;
}({}));


var compare = function(pat, name) {
  var str = path.basename(name);
  return (
       is.regx(pat)   && pat.test(str) 
    || is.string(pat) && pat === str
  );
};


var makeArray = function(elem) {
  return is.array(elem) ? elem : [elem];
};


function Chain() {
  var queue = [].slice.call(arguments)
    , expose = {};
  expose.add = function() {
    var jobs = [].slice.call(arguments);
    jobs.forEach(function(job) {
      queue.push.apply(queue, makeArray(job));
    });
    return this;
  }
  expose.next = function() {
    if (queue.length) {
      queue.shift().call();    
    } else {
      this.onend && this.onend();
    }
  }  
  expose.traverse = function(fn) {
    this.onend = fn;
    this.next();
    return this;
  }
  return expose;
}



var traverse = (function() {
  var callback = function() {}

  var readdir = function(root, type, buffer, c) {
    fs.lstat(root, function(err, stat) {
      if (stat && stat.isDirectory()) {  
        fs.readdir(root, function(err, alldir) {
          var chain = Chain();
          alldir && alldir.forEach(function(d) {
            var dir = path.join(root, d);
            chain.add(function() {
              fs.lstat(dir, function(err, s) {
                if (s) {
                  if (s.isFile()) {
                    if (type === 'file') {
                      buffer[buffer.length] = dir;
                    }    
                    chain.next();
                  } else if (s.isDirectory()) {
                    if (type === 'dir') {
                      buffer[buffer.length] = dir;
                    }
                    readdir(dir, type, buffer, chain);
                  } else {
                    chain.next();
                  }
                }
              });
            })
          });
          chain.traverse(function() {
            if (c) {
              c.next();
            } else { 
              callback(buffer);
            }
          });
        });
      }
    });
  };
  return function(root, type, fn) {
    callback = fn;
    var buffer = [];
    readdir(root, type, buffer);
  };
}());


var traverseEach = (function() {
  var callback = function() {};
  var readdir = function(root, type, action, buffer, c) {
    fs.lstat(root, function(err, stat) {
      if (stat && stat.isDirectory()) {  
        fs.readdir(root, function(err, alldir) {
          var chain = Chain();
          alldir && alldir.forEach(function(d) {
            var dir = path.join(root, d);
            chain.add(function() {
              fs.lstat(dir, function(err, s) {
                if (s) {
                  if (s.isFile()) {
                    if (type === 'file') {
                      action(dir);
                    }    
                    chain.next();
                  } else if (s.isDirectory()) {
                    if (type === 'dir') {
                      action(dir);
                    }
                    readdir(dir, type, action, buffer, chain);
                  } else {
                    chain.next();
                  }
                }
              });
            })
          });
          chain.traverse(function() {
            if (c) {
              c.next();
            } else { 
              callback && callback();
            }
          });
        });
      }
    });
  };
  return function(root, type, action) {
    var buffer = [];
    readdir(root, type, action, buffer);
    return {
      end: function(fn) {
        callback = fn;
      }
    }
  };
}());


var traverseSync = (function() {
  var readdir = function(root, type, buffer) {
    var stat = fs.lstatSync(root);        
    if (stat && stat.isDirectory()) {
      fs.readdirSync(root).forEach(function(dir) {
        dir = path.join(root, dir)
        var s = fs.lstatSync(dir) 
        if (s) {
          if (type === 'file' &&  s.isFile()) {
            buffer[buffer.length] = dir;
          }
          if (s.isDirectory()) {
            if (type === 'dir') {
              buffer[buffer.length] = dir;
            }
            readdir(dir, type, buffer);
          }
        }
      });
    }
  };
  return function(root, type) {
    var buffer = [];
    readdir(root, type, buffer);
    return buffer;
  };
}());


['file', 'dir'].forEach(function(type) {

  find[type] = function(pat, root, callback) {
    traverse(root, type, function(buffer) {
      callback && callback(
        buffer.filter(function(n) {
          return compare(pat, n);
        })
      );
    });
  }

  find[type + 'Sync'] = function(pat, root) {
    return traverseSync(root, type).filter(function(n) {
      return compare(pat, n);
    });
  } 

  find['each' + type] = function(pat, root, action) {
    return traverseEach(root, type, function(n) {
      if (compare(pat, n)) {
        action(n);
      }
    });
  }

}); 

