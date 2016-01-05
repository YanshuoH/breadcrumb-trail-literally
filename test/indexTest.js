var breadcrumbTrail = require('../index');
var expect = require('chai').expect;

var relativeResultFixture = [
  '.force',
  'obi-wan/.force',
  'anakin/.force',
  'anakin/luke/.force',
  'anakin/leia/kylo/.force',
];

var baseDir = 'example';

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
      expect(results.sort()).to.eql(relativeResultFixture.sort());
      next();
    });
  });
});