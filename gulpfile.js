const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean');


gulp.task('clear', () => gulp.src('./dist').pipe(clean()));

gulp.task('build', ['clear'], ()=>{
    gulp.src('./src/**/*.js')
        .pipe(concat('angularIndexedDB.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(concat('angularIndexedDB.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build']);


