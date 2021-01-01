'use strict';

// Required gulp plugins
const gulp         = require('gulp');
const browsersync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const concat       = require('gulp-concat');
const minify       = require('gulp-minify');
const sourcemaps   = require('gulp-sourcemaps');
const cleanCss     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');

let   htmlSrcFiles = './**/*.html';
let   scssSrcFiles = './src/scss/**/*.scss';
let   jsSrcFiles   = './src/js/*.js';
let   cssDist      = './dist/assets/css';
let   jsDist       = './dist/assets/js';
let   imgSrcFiles  = './dist/assets/images/**/*.png';
let   imgDist      = './dist/assets/images';


// BrowserSync initialization
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist'
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

// Compiling all sass file into css
function sassCompile() {
  return gulp
    .src(scssSrcFiles)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          '> 1%',
          'last 10 versions',
          'firefox >= 4',
          'safari 7',
          'safari 8',
          'IE 8',
          'IE 9',
          'IE 10',
          'IE 11'
        ],
        cascade: false
      })
    )
    .pipe(cleanCss()) //minifying css
    .pipe(rename('app.min.css'))
    .pipe(sourcemaps.write('.', { includeContent: false }))
    .pipe(gulp.dest(cssDist));
}

// Compiling all JS into one js
function jsCompile() {
  return gulp
    .src(jsSrcFiles)
    .pipe(concat('app.js'))
    .pipe(minify({
      ext:{
          min:'.min.js'
      },
      noSource: true
  }))
    .pipe(gulp.dest(jsDist))
    .pipe(browsersync.reload({ stream: true }));
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

// Gulp build
gulp.task('compile', gulp.parallel(sassCompile, jsCompile));

// Deafult gulp task
gulp.task( 'default', gulp.series('compile', gulp.parallel(browserSync, watchFiles)));



// Below gulp taks is used to make the css/js compilation without minifying to debug easily
// this needs to be run manually
gulp.task('build:css', function () {    
    return gulp
    .src(scssSrcFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssDist))
    .pipe(browsersync.reload({ stream: true }));
});

gulp.task('build:js', function () {    
  return gulp
  .src(jsSrcFiles)
  .pipe(concat('app.js'))
  .pipe(gulp.dest(jsDist))
});

// Manual image optimizer task
gulp.task('imagemin', function() {
  return gulp.src(imgSrcFiles)
	.pipe(imagemin([
    imagemin.optipng({optimizationLevel: 5}),
  ]))
	.pipe(gulp.dest(imgDist))
});