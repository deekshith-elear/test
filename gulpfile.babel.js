
/* File: gulpfile.babel.js */

// grab our gulp packages
var gulp  = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var server = require( 'gulp-develop-server');
const babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var clean = require('gulp-clean');
const mocha = require('gulp-mocha');

// create a default task and just log a message
gulp.task('default',['start:server'],function() {
  return gutil.log('Hey Great Abhi ! Gulp is running')
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['jshint']);
});

//Clean Temporary Files ...
gulp.task('clean:tmp', () => del(['src/tmp/**/*'], {dot: true}));


// Transpiling all ES6 code to ES5 in dist Folder.
gulp.task('transpiler',['clean'],function () {
  return gulp.src('server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});


//Clean the gulp File ...
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

//Start the server from server.js

gulp.task('start:server',['transpiler'],function () {
  var stream = nodemon({
    script: 'dist/server.js'
    , ext: 'html js'
    , ignore: ['ignored.js']
    , tasks: ['watch'] });

  stream
    .on('restart', function () {
      console.log('restarted!')
    })
    .on('crash', function() {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10)  // restart the server in 10 seconds
    })
});

//Start the server from server.js in development

gulp.task('start:server:dev',['transpiler'],function () {
  var stream = nodemon({
    script: 'dist/server.js'
    , ext: 'html js'
    , ignore: ['ignored.js']
    , tasks: ['watch'] });

  stream
    .on('restart', function () {
      console.log('restarted!')
    })
    .on('crash', function() {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10)  // restart the server in 10 seconds
    })
});

//Start the server from server.js in production

gulp.task('start:server:production',['transpiler'],function () {
  var stream = nodemon({
    script: 'dist/server.js'
    , ext: 'html js'
    , ignore: ['ignored.js']
    , tasks: ['watch'] });

  stream
    .on('restart', function () {
      console.log('restarted!')
    })
    .on('crash', function() {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10)  // restart the server in 10 seconds
    })
});
// Passing Shared Modules in all test cases...
gulp.task('mocha',['mocha:change'],function() {
  return gulp.src(['src/test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});
gulp.task('mocha:change', function() {
  gulp.watch(['src/test/**'], ['mocha:onChange']);
});
gulp.task('mocha:onChange', function() {
  return gulp.src(['src/test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

gulp.task('test',['mocha'],function() {
  return gutil.log('Hey Great Abhi ! Gulp is running')
});
