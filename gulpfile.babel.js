import gulp, { watch, series, parallel } from 'gulp'
import connect from 'gulp-connect'
import uglify from 'gulp-uglify-es'
import gulpLoad from 'gulp-load-plugins'
import sourcemaps from 'gulp-sourcemaps'
import html from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin';

//CONFIG
const $ = gulpLoad()
var gulpsass = require('gulp-sass')(require('sass'));
function onError(error) {
  console.log(error)
  this.emit('end')
}

//CSS
const inputCSS = './app/css/*.scss'
const outputCSS = './dist/css'

//JS
const inputJS = './app/js/*.js'
const outputJS = './dist/js'

gulp.task('connect', () => {
  connect.server({
    name: 'Connect CSS',
    port: 8888,
    root: './',
    livereload: true
  });
});

//SASS
gulp.task('sass', () => {
  return gulp.src(inputCSS)
    .pipe(sourcemaps.init())
    .pipe(gulpsass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(outputCSS))
    .pipe(connect.reload());
})

//JS
gulp.task('js', () => {
  return gulp.src(inputJS)
    .pipe($.babel().on('error', onError))
    .pipe(uglify())
    .pipe(gulp.dest(outputJS))
    .pipe(connect.reload())
})

//HTML
gulp.task('html', () => {
  return gulp.src('./*.html')
    .pipe(html({
      collapseWhitespace: true,
      removeComments: true
      }
    ))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
})

// SVG / IMAGES
gulp.task('image', () => {
  return gulp.src('./app/images/*.svg')
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./dist/images'))
})

//FONTS
gulp.task('fonts', () => {
  return gulp.src('./app/fonts/*.*')
    .pipe(gulp.dest('./dist/fonts'))
})

//WATCH
gulp.task('watch', () => {
  gulp.watch('./app/css/**/*.scss', gulp.series('sass'))
  gulp.watch('./app/js/**/*.js', gulp.series('js'))
  gulp.watch('./app/image/**/*', gulp.series('image'))
  gulp.watch('./*.html', gulp.series('html'))
})


//DEFAULT
gulp.task('default', gulp.series('image', 'fonts', 'sass', 'js', gulp.parallel('watch', 'connect'), done => {
  done();
}))