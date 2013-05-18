#find

Find files or directories by name.


## Installation

```bash
$ npm install find
```

## Examples

Find all `.js` files in current directory.

```javascript
var find = require('find');

find.file(/\.js$/, __dirname, function(files) {
  console.log(files.length);
})
```

## Features
  * Recursively search each sub-directories
  * Asynchronously or synchronously 
  * Filtering by regular expression or string comparing


## API

### #file(pattern, root, callback)

```javascript
find.file(/log/, __dirname, function(files) {
  //
})
```

### #dir(pattern, root, callback)
```javascript
find.dir(/log/, __dirname, function(dirs) {
  //
})
``` 


### #eachfile(pattern, root, action)

```javascript
find.eachfile(/./, __dirname, function(file) {
  //
})
```

### #eachdir(pattern, root, callback)

```javascript
find.eachdir(/./, __dirname, function(dir) {
  //
})
```  

* `find.eachfile` and `find.eachdir` will return an object with an `end` method to be used as callback function since this is asynchronous way.

```javascript
find
  .eachfile(/./, __dirname, function(file) {
    console.log(file);
  })
  .end(function() {
    console.log('find end'); 
  }) 
```
 

### #fileSync(pattern, root)
```javascript
var files = find.fileSync(/./, __dirname);
```

### #dirSync(pattern, root)
```javascript
var dirs = find.dirSync(/./, __dirname);
```
 
## LICENSE

(MIT Licensed)
