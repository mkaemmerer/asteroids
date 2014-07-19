'use strict';

var gulp                = require('gulp');
var concat              = require('gulp-concat');
var sourcemaps          = require('gulp-sourcemaps');
var es6ModuleTranspiler = require('gulp-es6-module-transpiler');
var clean               = require('gulp-clean');
var connect             = require('gulp-connect');
var livereload          = require('gulp-livereload');
var bower               = require('gulp-bower-src');


gulp.task('js', function() {
  return gulp.src('app/src/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(es6ModuleTranspiler({type: 'amd'}))
      .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/src'));
});

gulp.task('jsDeps', function() {
  return bower()
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});



gulp.task('watch', function(){
  var server = livereload();

  gulp.watch('app/src/**/*.js', ['js']);
  gulp.watch('app/*.html', ['html']);

  gulp.watch(['dist/**']).on('change', function(file) {
    server.changed(file.path);
  });
});

gulp.task('connect', ['js', 'jsDeps', 'html'], function(){
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: false
  });
});

gulp.task('default', ['watch', 'connect']);
