#find

Find files or sub-directories in a **clear way**.


## Installation

    npm install find

## Examples

Find all `.js` files in current directory.

    var find = require('find');

    find.file(/\.js$/, __dirname, function(all) {
      console.log(all.length);
    }

## Features
  * Recursively search each sub-directories
  * Asynchronously or synchronously 
  * Filtering with regular expression or string comparing


## API

### find.file(pattern, root, callback)
Recursively find all files which matches the `pattern` inside a given `root` directory and passes the result in an array as a whole. This follows the default callback style of nodejs, think about `fs.readdir`. 

`pattern` could be a regular expression or a string. when it is of type string will do a strict string comparing. 

`callback` will recieve an array of finding result.

    find.file(/log/, '/tmp', function(arrResult) {
      // your action with the result array. 
    })


### find.dir(pattern, root, callback)
see **find.file** above except that it will find directory names


### find.eachfile(pattern, root, action)
Recursively find all files which matches the `pattern` inside a given `root` directory and apply with a given `action` to each result immediately rather than pass them back as an array.


This function will return an object which has a `end` method, to be used as callback function since this is asynchronous way.

    find
      .eachfile(/./, '/tmp', function(file) {
        console.log(file);
      })
      .end(function() {
        console.log('find end'); 
      })


### find.eachdir(pattern, root, callback)
see **find.eachfile** above except that it will find directory names.
 

### find.fileSync(pattern, root)
Recursively Find all files which matches the `pattern` inside a given `root` directory and returns the result as an array. This follows the default 'Sync' 
methods of nodejs, think about `fs.readdirSync`. 
  
    var allfiles = find.fileSync(/./, '/tmp');

### find.dirSync(pattern, root)
see **find.fileSync** above except that it will find directory names.
 


## LICENSE

(MIT Licensed)
