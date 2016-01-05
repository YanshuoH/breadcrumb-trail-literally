var fs = require('fs');
var path = require('path');

var map = function(options, callback) {
  optionsCheck(options);
  setDefaultOptions(options);

  walk(options.baseDir, options, callback);
}

function walk(dir, options, done) {
  var results = [];

  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    var count = list.length;
    if (!count) {
      return done(null, results);
    }

    list.forEach(function(file) {
      var filepathAbsolute = path.resolve(dir, file);
      fs.stat(filepathAbsolute, function(err, stat) {
        if (err) {
          return done(err);
        }
        if (stat.isDirectory()) {
          walk(filepathAbsolute, options, function(err, res) {
            results = results.concat(res);
            if (!--count) {
              done(null, results);
            }
          });
        } else if (stat.isFile()) {
          if (checker(file, options)) {
            var caculatedPath;
            if (options.pathType === 'relative') {
              caculatedPath = path.relative(options.baseDir, filepathAbsolute);
            } else {
              caculatedPath = filepathAbsolute;
            }
            results.push(caculatedPath);
          };
          if (!--count) {
            done(null, results);
          }
        }
      });
    });
  });
}

function optionsCheck(options) {
  if (options === undefined) {
    throw new Error('Param "options" is not defined');
  }

  var mandatoryFields = ['baseDir', 'validate'];
  mandatoryFields.forEach(function(field) {
    if (options[field] === undefined) {
      throw new Error('Field ' + field + ' is mandatory in options');
    }
  });
}

function setDefaultOptions(options) {
  if (options.pathType === undefined) {
    options.pathType = 'relative';
  }
}

function checker(filename, options) {
  if (typeof options.validate === 'string') {
    if (filename.indexOf(options.validate) > -1) {
      return true;
    }
  } else if (typeof options.validate === 'function') {
    return options.validate(filename);
  }

  return false;
}

module.exports = {
  map: map,
}
