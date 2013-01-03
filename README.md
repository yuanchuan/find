#find

Find files or sub-directories within a direcrory in a **clear way**.


## Installation

    npm install find

## Examples

    var find = require('find');

    find.file(/\.js$/, __dirname, function(all) {
      console.log(all.length);
    }
 
    find.eachfile(/\.js$/, __dirname, function(js) {
      console.log(js);
    }

    var all = find.fileSync(/\.js$/, __dirname);

## Features
  * Recursively search each sub-directories
  * Asynchronously or synchronously 
  * Filtering with regular expression or string comparing



## API

coming soon.

## LICENSE

(MIT Licensed)
