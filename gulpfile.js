'use strict';

var gulp          = require('gulp');
var clean         = require('gulp-clean');
var connect       = require('gulp-connect');
var es6transpiler = require('gulp-es6-transpiler');


gulp.task('js', function() {
  return gulp.src('app/src/main.js')
    .pipe(es6transpiler())
    .pipe(gulp.dest('dist/src'));
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
  gulp.watch(['app/src/**/*.js'], ['js']);
});

gulp.task('connect', ['js', 'html'], function(){
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch']);
