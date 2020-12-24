'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(".src/scss/**/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("./assets/css"))
      .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass' ,function(done) {
    browserSync.init({
        server: "."
    });

    gulp.watch("./src/scss/**/*.scss", ['sass']);
    gulp.watch("./**/*.html");
    browserSync.reload();
    done();
}));

gulp.task('default', gulp.series('serve'));


// Archived code
/* 
//required gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//browserSync initialization
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    open: false,
    notify: false
  })
})
*/

//gulp.task('sass', function(){ 
  //return gulp.src('./src/scss/**/*.scss')
  //.pipe(sass().on('error', sass.logError))
  //.pipe(gulp.dest('./assets/css'))
  //.pipe(browserSync.stream());
//});

//gulp.task('watch', gulp.series('sass','browserSync', function () {
  //gulp.watch('./src/scss/**/*.scss', ['sass']);
  //gulp.watch('./**/*.html', browserSync.reload); 
  //gulp.watch('./js/**/*.js', browserSync.reload); 
//})); 