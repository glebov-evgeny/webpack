/* Get plugins */
const gulp = require('gulp');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const webpack = require('webpack-stream');
const ghPages = require('gulp-gh-pages');
const os = require("os");


/* Primary tasks */
gulp.task('default', (done) => {
    gulp.series('serve')(done)
});

gulp.task('serve', (done) => {
    gulp.series('clean', gulp.parallel('html', 'images', 'sass', 'js'), 'browsersync', 'watch')(done)
});

gulp.task('build', (done) => {
    gulp.series('clean', gulp.parallel('html', 'images', 'sass', 'js'), 'browsersync', 'watch')(done)
});

gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});


/* Html task */
gulp.task('html', () => {
    return gulp.src(['./.distr/pages/*.html', '!./.distr/pages/_includes/**/*'])
        .pipe(plumber())
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/')).on('end', () => {
            browserSync.reload();
        });
});

/* Sass task */
gulp.task('sass', () => {
    return gulp.src('./.distr/pages/scss/style.scss')
        .pipe(sass({
            "includePaths": "node_modules"
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/assets/css/'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

/* JS (webpack) task */
gulp.task('js', () => {
    return gulp.src(['./.distr/pages/js/**/*'])
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./build/assets/js'));
});

/* Задача для картинок */
gulp.task('images', function () {
    return gulp.src('./.distr/blocks/**/img/**')
        .pipe( gulp.dest('./build/assets') );
});

/* Browsersync Server */

gulp.task('browsersync', (done) => {
    browserSync.init({
        server: ["./build", "./src/static"],
        notify: false,
        ui: false,
        online: true,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
    done();
});

/* Watcher */
gulp.task('watch', () => {
    global.isWatching = true;
    gulp.watch("./.distr/blocks/**/*.scss", gulp.series('sass'));
    gulp.watch("./.distr/blocks/**/*.html", gulp.series('html'));
    gulp.watch("./.distr/blocks/**/*.js", gulp.series('js'));
    gulp.watch("./config.json", gulp.parallel('html', 'js'));
});


/* FS tasks */
gulp.task('clean', () => {
    return del(['./build/**/*'], { dot: true });
});
