var fs = require('fs');
var assert = require('assert');
var path = require('path');
var tmp = require('tmp');
var find = require('..');

function createFilesUnder(dir, num, ext) {
  var files = [];
  num = num || 1;
  var opts = { template: dir + '/tmp-XXXXXX' + (ext || '') };
  for (var i = 0; i < num; ++i) {
    files.push(tmp.fileSync(opts).name);
  }
  return files;
}

function createDirUnder(dir) {
  return tmp.dirSync({ template: dir + '/tmp-XXXXXX' }).name;
}

function createNestedDirs(testdir) {
  var level1 = createDirUnder(testdir);
  var level2 = createDirUnder(level1);
  var level22 = createDirUnder(level1);
  var level3 = createDirUnder(level2);
  return [level1, level2, level22, level3];
}

describe('API test', function() {
  var testdir;

  beforeEach(function(done) {
    tmp.setGracefulCleanup();
    tmp.dir(function(err, dir) {
      if (err) return done(err);
      testdir = dir;
      done();
    });
  });
 
  it('`find.file()` should find all files and returns as an array in callback', function(done) {
    var expect = createFilesUnder(testdir, 3);
    find.file(/./, testdir, function(all) {
      assert.equal(expect.sort().join(''), all.sort().join(''));
      done();
    });
  });   

  it('`find.file()` should find recursively', function(done) {
    var expect = createFilesUnder(testdir, 3);
    var level1 = createDirUnder(testdir);
    expect = expect.concat(createFilesUnder(testdir, 2));

    find.file(/./, testdir, function(all) {
      assert.equal(expect.sort().join(''), all.sort().join(''));
      done();
    });
  });   

  it('`file.file()` should handle less arguments with default empty pat', function(done) {
    var expect = createFilesUnder(testdir, 3);
    find.file(testdir, function(all) {
      assert.equal(expect.sort().join(''), all.sort().join(''));
      done();
    });
  }); 

  it('`find.dir()` should find all dirs just like find.file()', function(done) {
    var expect = createNestedDirs(testdir);
    find.dir(/./, testdir, function(all) {
      assert.equal(expect.sort().join(''), all.sort().join(''));
      done();
    });
  });     

  it('`file.dir()` should handle less arguments', function(done) {
    var expect = createNestedDirs(testdir);
    find.dir(testdir, function(all) {
      assert.equal(expect.sort().join(''), all.sort().join(''));
      done();
    });
  })

  it('`find.eachfile()` should find all files and process one by one', function(done) {
    var expect = createFilesUnder(testdir, 3);
    count = 0;
    find.eachfile(/./, testdir, function(thisfile) {
      assert(expect.indexOf(thisfile) > -1);
      count++;
    }).end(function() {
      assert(count == expect.length);
      done();
    });
  });     

  it('`file.eachfile()` should handle less arguments', function(done) {
    var expect = createFilesUnder(testdir, 3);
    count = 0;
    find.eachfile(testdir, function(thisfile) {
      assert(expect.indexOf(thisfile) > -1);
      count++;
    }).end(function() {
      assert(count == expect.length);
      done();
    }); 
  });

  it('`find.eachdir()` should find all dirs just like find.eachfile()', function(done) {
    var expect = createNestedDirs(testdir);
    var count = 0;
    find.eachdir(/./, testdir, function(thisdir) {
      assert(expect.indexOf(thisdir) > -1);
      count++;
    }).end(function() {
      assert(count == expect.length);
      done();   
    });
  });     

  it('`find.fileSync()` should find all files synchronously', function(done) {
    var expect = createFilesUnder(testdir, 3);
    var all = find.fileSync(/./, testdir);
    assert.equal(expect.sort().join(''), all.sort().join(''));
    done();
  });

  it('`file.fileSync()` should handle less arguments', function(done) {
    var expect = createFilesUnder(testdir, 3);
    var all = find.fileSync(testdir);
    assert.equal(expect.sort().join(''), all.sort().join(''));
    done(); 
  });

  it('`find.dirSync()` should find all dirs synchronously', function(done) {
    var expect = createNestedDirs(testdir);
    var all = find.dirSync(/./, testdir);
    assert.equal(expect.sort().join(''), all.sort().join(''));
    done();
  }); 

  it('`find.*` should find by name', function(done) {
    var expect = createFilesUnder(testdir, 3);
    var first = expect[0];
    find.file(path.basename(first), testdir, function(all) {
      assert.equal(first, all[0]);
      done();
    });
  });    

  it('`find.*` should find by regular expression', function(done) {
    var html = createFilesUnder(testdir, 1, '.html');
    var js = createFilesUnder(testdir, 2, '.js');

    htmlAll = find.fileSync(/\.html$/, testdir);
    assert.equal( html.join(''), htmlAll.join(''));

    jsAll = find.fileSync(/\.js$/, testdir);
    assert.equal( js.sort().join(''), jsAll.sort().join('')); 

    done();
  });          

/*
  it('should follow symblic link with option', function(done) {
    var tmpfile;
    var link = watchdir + '-link';
    fs.symlinkSync(watchdir, link, 'dir');
    watch(link, {followSymLinks: true}, function(changed) {
      assert.equal(tmpfile, changed)
      done();
    });

    createFileUnder(link, function(file) {
      tmpfile = file;
      randomWriteTo(file);
    }); 
  });       
  */

});
