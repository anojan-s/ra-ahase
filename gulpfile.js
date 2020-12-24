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

// Javascript Functions
function jsCompile() {
  return gulp
    .src(jsSrcFiles)
    //.pipe(concat('app.js'))
    .pipe(gulp.dest(jsDist))
    .pipe(browsersync.reload({ stream: true }));
}

function jsBuild() {
  return gulp
    .src(jsSrcFiles)
    //.pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(jsDist));
}

// Watch files
function watchFiles() {
  gulp.watch(scssSrcFiles, sassCompile);
  gulp.watch(jsSrcFiles, jsCompile);
  gulp.watch([htmlSrcFiles], gulp.series(browserSyncReload));
}

// Gulp tasks
gulp.task('sassCompile', sassCompile);
gulp.task('jsCompile', jsCompile);
gulp.task('jsBuild', jsBuild);

// Gulp build
gulp.task('build', gulp.parallel(sassCompile, jsBuild));


// Gulp watch
gulp.task( 'default', gulp.series('build', gulp.parallel(browserSync, watchFiles)));
