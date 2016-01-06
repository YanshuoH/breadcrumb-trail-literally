module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkgFile: 'package.json',
    mocha_istanbul: {
      coverage: {
        src: ['test/*Test.js'],
        options: {
          coverageFolder: 'reports/coverage',
          reportFormats: [
            'html',
            'lcov'
          ],
        },
      },
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'reports/coverage',
          check: {
            lines: 80,
            statements: 80,
          },
        },
      },
    },
    coveralls: {
      coverage: {
        src: 'reports/coverage/lcov.info',
      },
    },
  });

  grunt.registerTask('coverage', ['mocha_istanbul']);
  grunt.registerTask('build', ['mocha_istanbul', 'coveralls:coverage']);
}