// const gulp = require('gulp');
// const sass = require('gulp-sass')(require('sass'));
// const sourcemaps = require('gulp-sourcemaps');
// const autoprefixer = require('gulp-autoprefixer');
// const browserSync = require('browser-sync').create();

// const paths = {
//   scss: 'assets/scss/style.scss',
//   cssDest: 'assets/css'
// };

// gulp.task('scss', () => {
//   return gulp.src(paths.scss)
//     .pipe(sourcemaps.init())
//     .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
//     .pipe(autoprefixer())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(paths.cssDest))
//     .pipe(browserSync.stream());
// });

// gulp.task('watch', () => {
//   browserSync.init({
//     proxy: 'your-local-site.test', // Change this to your local domain
//     open: false
//   });
//   gulp.watch('assets/scss/**/*.scss', gulp.series('scss'));
//   gulp.watch('templates/**/*.twig').on('change', browserSync.reload);
// });

// gulp.task('default', gulp.series('scss', 'watch'));

import gulp from "gulp";
import * as dartSass from 'sass'; 
import gulpSass from 'gulp-sass'; 
const sass = gulpSass(dartSass); 

import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import sourcemaps from "gulp-sourcemaps";
import { deleteAsync } from "del"; 
import browserSyncModule from "browser-sync"; 
const browserSync = browserSyncModule.create(); 

// Paths
const paths = {
  scss: "assets/scss/**/*.scss",
  js: "assets/js/**/*.js",
  images: "assets/images/**/*",
  dist: {
    css: "dist/css",
    js: "dist/js",
    images: "dist/images"
  }
};

// Clean dist
export async function clean() {
  await deleteAsync(["dist"]); 
}

// Compile SCSS
export function styles() {
  return gulp.src("assets/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Minify JS
export function scripts() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}

// Optimize Images
export function images() {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.images));
}

// Watch Files
export function watchFiles() {
  browserSync.init({
    proxy: "https://drupal.ddev.site/" // Change to your DDEV site's URL if different
  });
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.images, images);
  gulp.watch("**/*.twig").on("change", browserSync.reload);
}

// Define the 'watch' compound task explicitly
export const watch = gulp.series(clean, gulp.parallel(styles, scripts, images), watchFiles);

// Set the 'watch' task as the default task when running just 'gulp'
export default watch;