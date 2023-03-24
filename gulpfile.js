const gulp = require("gulp");
const del = require("del");
const less = require("gulp-less");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const size = require("gulp-size");
const newer = require("gulp-newer");
const browserSync = require('browser-sync').create();



const path_styles_src = "src/styles/**/*.less";
const path_styles_dest = "dist/css/";

const path_scripts_src = "src/scripts/**/*.js";
const path_scripts_dest = "dist/js/";

const path_images_src = "src/images/*";
const path_images_dest = "dist/images/";

const path_html_src = "src/**/*.html";
const path_html_dest = "dist/";


function clean_dest() {
    return del(["dist/**/*"]);
}

function styles() {
    return gulp.src(path_styles_src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write())
        .pipe(size({
            showFiles: true,
            showTotal: false
        }))
        .pipe(gulp.dest(path_styles_dest))
        .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src(path_scripts_src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(concat("main.min.js"))
        .pipe(sourcemaps.write())
        .pipe(size({
            showFiles: true,
            showTotal: false
        }))
        .pipe(gulp.dest(path_scripts_dest))
        .pipe(browserSync.stream())
}

function images() {
    return gulp.src(path_images_src)
        .pipe(newer(path_images_dest))
        .pipe(imagemin())
        .pipe(gulp.dest(path_images_dest));
}

function html() {
    return gulp.src(path_html_src)
        .pipe(newer(path_html_dest))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(size({
            showFiles: true,
            showTotal: false
        }))
        .pipe(gulp.dest(path_html_dest))
}

function watch() {
    browserSync.init({
        server: "./dist/"
    });
    gulp.watch(path_styles_src, styles);
    gulp.watch(path_scripts_src, scripts);
    gulp.watch(path_images_src, images);
    gulp.watch(path_html_src, html);
    gulp.watch(path_html_dest + '**/*.html').on('change', browserSync.reload);
}

const build = gulp.series(clean_dest, gulp.parallel(styles, scripts, images, html), watch);

exports.clean_dest = clean_dest;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.build = build;
exports.default = build;
