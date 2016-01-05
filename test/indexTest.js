var path = require('path');
var breadcrumbTrail = require('../index');
var expect = require('chai').expect;

var relativeResultFixture = [
  [
    '.force',
    'obi-wan/.force',
    'anakin/.force',
    'anakin/luke/.force',
    'anakin/leia/kylo/.force',
  ],
  [
    '.force',
    'obi-wan/.force',
    'anakin/.force',
    'anakin/luke/.force',
    'anakin/leia/kylo/.force',
    'organa/.no-force',
  ],
];

var baseDir = 'example';
var absoluteBaseDir = path.resolve(baseDir);
var absoluteResultFixture = getAbsoluteResultFixtureFromRelative(relativeResultFixture);

describe('#breadcrumbTrail', function() {
  it('should throw an exception if mandatory fields of option undefined', function() {
    try {
      breadcrumbTrail.map({}, function(err, results) {});
    } catch (e) {
      expect(e).to.be.an.instanceof(Error);
    }
  });

  it('should have an err in callback function if baseDir not found', function(next) {
    breadcrumbTrail.map({
      baseDir: 'whatever',
      validate: '.force',
    }, function(err, results) {
      expect(err.code).to.be.equal('ENOENT');
      expect(results).to.be.undefined;
      next();
    });
  });

  it('should return an array of relative paths if validate is a string', function(next) {
    breadcrumbTrail.map({
      baseDir: baseDir,
      validate: '.force',
    }, function(err, results) {
      expect(results.sort()).to.eql(relativeResultFixture[0].sort());
      next();
    });
  });

  it('should return an array of absolute paths if pathType set to absolute', function(next) {
    breadcrumbTrail.map({
      baseDir: baseDir,
      validate: '.force',
      pathType: 'absolute',
    }, function(err, results) {
      expect(results.sort()).to.eql(absoluteResultFixture[0].sort());
      next();
    });
  });

  it('should return an array of relative paths if validate is a function', function(next) {
    breadcrumbTrail.map({
      baseDir: baseDir,
      validate: function(filename) {
        var n = filename.search(/^\.(no-)?force/i);
        return n > -1;
      },
    }, function(err, results) {
      expect(results.sort()).to.eql(relativeResultFixture[1].sort());
      next();
    });
  });
});

/**
 * Dynamically concat absolute base dir path to relative fixture
 *
 * @param {Array} relativeFixture - relative fixture data
 * @returns {Array}
 */
function getAbsoluteResultFixtureFromRelative(relativeFixture) {
  var absoluteFixture = [];
  for (var i = 0; i < relativeFixture.length; i ++) {
    var subFixture = [];
    for (var j = 0; j < relativeFixture[i].length; j ++) {
      subFixture.push(path.join(absoluteBaseDir, relativeFixture[i][j]));
    }
    absoluteFixture.push(subFixture);
  }

  return absoluteFixture;
}