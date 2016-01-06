var fs = require('fs');
var path = require('path');

/**
 * Main function of this lib
 *
 * @param {Object} options - Options for lib
 * @param {Function} callback - Callback function when done
 * @param {String} options.baseDir - Base dir path for map function
 * @param {String|Function} options.validate - Validate the filename, decide if add filepath to result
 * @param {?String} options.pathType - The result in relative(default)|absolute path form
 */
var map = function(options, callback) {
  optionsCheck(options);
  setDefaultOptions(options);

  walk(options.baseDir, options, callback);
}

/**
 * Recursive function, walking into the filesystem
 *
 * @param {String} dir - next dir to parse
 * @param {Object} options - Options for lib
 * @param {Function} done - Callback function when done
 */
function walk(dir, options, done) {
  var results = [];

  // Read the current dir
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    // Count of todo
    var count = list.length;
    if (!count) {
      return done(null, results);
    }

    // For each file/dir under the current dir
    list.forEach(function(file) {
      var filepathAbsolute = path.resolve(dir, file);
      fs.stat(filepathAbsolute, function(err, stat) {
        // If it is a Directory, dig deeper
        if (stat.isDirectory()) {
          walk(filepathAbsolute, options, function(err, res) {
            results = results.concat(res);
            if (!--count) {
              done(null, results);
            }
          });
        } else if (stat.isFile()) {
          // Otherwise check the file by validate function
          if (checker(file, options)) {
            var caculatedPath;
            // Decide the result will be in form of absolute or relative
            if (options.pathType === 'relative') {
              caculatedPath = path.relative(options.baseDir, filepathAbsolute);
            } else {
              caculatedPath = filepathAbsolute;
            }
            results.push(caculatedPath);
          };

          // When count === 0, callback the result
          if (!--count) {
            done(null, results);
          }
        }
      });
    });
  });
}

/**
 * Check if all mandatory fields are set
 *
 * @param {Object} options - Options for lib
 */
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

/**
 * Set default options
 *
 * @param {Object} options - Options for lib
 */
function setDefaultOptions(options) {
  if (options.pathType === undefined) {
    options.pathType = 'relative';
  }
}

/**
 * The validate function for filename check, will use/call validate in options
 *
 * @param {String} filename - Current filename
 * @param {Object} options - Options for lib
 * @returns {Boolean}
 */
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
