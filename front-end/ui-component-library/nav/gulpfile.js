/**
 * Created by vd on 14/09/17.
 */
'use strict';
const del        = require('del');
const gulp       = require('gulp');
const sass       = require('gulp-sass');
const postcss    = require('gulp-postcss');

const autoprefixer = require('autoprefixer');

gulp.task('default', ['clean', 'sass'/*, 'webpack'*/], function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('clean', function () {
    return del(['./dist/*']);
});

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
    //.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('./dist/css'));
});