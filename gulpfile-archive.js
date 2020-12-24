'use strict';

//required gulp plugins
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('./src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./assets/css'))
});

gulp.task('sass:watch', function () {
  return gulp.watch('./src/scss/**/*.scss', { ignoreInitial: false }, { queue: false }, ['sass']);
});