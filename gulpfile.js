const gulp = require('gulp');
const del = require('del');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


const path_styles_src = 'src/styles/**/*.less';
const path_styles_dest = 'dist/css/';

const path_scripts_src = 'src/scripts/**/*.js';
const path_scripts_dest = 'dist/js/';


function clean_dest() {
    return del(['dist/**/*']);
}

function styles() {
    return gulp.src(path_styles_src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path_styles_dest));
}

function scripts() {
    return gulp.src(path_scripts_src)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path_scripts_dest));
}

function watch() {
    gulp.watch(path_styles_src, styles);
    gulp.watch(path_scripts_src, scripts);
}

const build = gulp.series(clean_dest, gulp.parallel(styles, scripts), watch);

exports.clean_dest = clean_dest;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
