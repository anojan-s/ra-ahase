'use strict';

// Required gulp plugins
const gulp         = require('gulp');
const browsersync  = require('browser-sync').create();
const sass         = require('gulp-sass');

let   htmlSrcFiles = './**/*.html';
let   scssSrcFiles = './src/scss/**/*.scss';
let   jsSrcFiles   = './src/js/*.js';
let   cssDist      = './assets/css';
let   jsDist       = './assets/js';
//let   vendorsDist  = './assets/vendors';

// BrowserSync initialization
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: '.'
    },
    open: false,
    notify: false
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS/SCSS Functions
function sassCompile() {
  return gulp
    .src(scssSrcFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDist))
    .pipe(browsersync.reload({ stream: true }));
}

/**
 * Watch files
 */
function watchFiles() {
  gulp.watch(scssSrcFiles, sassCompile);
  gulp.watch([htmlSrcFiles], gulp.series(browserSyncReload));
}

/**
 * Gulp tasks
 */
gulp.task('sassCompile', sassCompile);


/**
 * Gulp watch
 */
gulp.task(
  'default', 
  gulp.series('sassCompile', gulp.parallel(browserSync, watchFiles))
);
