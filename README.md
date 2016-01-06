# breadcrumb-trail-literally
A literally breadcrumb trail fairy tale. Take some breadcrumbs (specific files) and they will guide you home.

[![Build Status](https://travis-ci.org/YanshuoH/breadcrumb-trail-literally.svg?branch=master)](https://travis-ci.org/YanshuoH/breadcrumb-trail-literally)
[![Coverage Status](https://coveralls.io/repos/YanshuoH/breadcrumb-trail-literally/badge.svg?branch=master&service=github)](https://coveralls.io/github/YanshuoH/breadcrumb-trail-literally?branch=master)

## Goal
Sometimes we need to build a tree for some specific files through a filesystem(eg. RequireJS)

For example, I want to find all Force user through the defined root dir and it should be an array like:
```
[
    '.force',
    'obi-wan/.force',
    'anakin/.force',
    'anakin/luke/.force',
    'anakin/leia/kylo/.force',
]
```

All Force users should be marked as a breadcrumb of the big picture and I'm sure you noticed that Princess Leia is not marked, although she's Force sensitive.

So, with the above array, it is possible to do something interesting, like: define their power and skills? LOL

## Usage
Basically you can find usage in the test file which use the directory example as filesystem.

```
var breadcrumbTrail = require('breadcrumb-trail-literally');
breadcrumbTrail.map({
  baseDir: 'example',
  validate: '.force',
  pathType: 'relative',
}, function(err, results) {
  console.log(results);
})
```

## Options
* baseDir: As root directory. mandatory.
* validate: ``` Function|String ```. If set to String, will check if filename contains the string. You can also defined a custom function for check:
```
validate: function(filename) {
  var n = filename.search(/^\.(no-)?force/i);
  return n > -1;
},
```
* pathType: ```absolute|relative```. It not set, default is 'relative'
