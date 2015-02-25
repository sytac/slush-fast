'use strict';

module.exports = function (defaults) {

    var gulp = defaults.require.gulp;
    var path = require('path');
    var fastPackageJson = require(path.resolve(__dirname, '../../package.json'));

    gulp.task('version', function (done) {
        console.log('\n\tSlush fast version: ' + fastPackageJson.version +'\n');
        done();
    });

};
