var gulp            = require('gulp');
var karma           = require('karma').server;

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test-dev', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dev.conf.js',
        singleRun: true
    }, done);
});

gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('tdd-dev', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dev.conf.js'
    }, done);
});

gulp.task('default',['tdd'], function() {

});