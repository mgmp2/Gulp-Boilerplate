var gulp = require('gulp');
var sass = require('gulp-sass');
var babelify = require('babelify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();

var config = {
  source: './src/',
  dist: './public/'
};
//actualizo paths y sources de sass
var paths = {
  assets: "assets/",
  html: "**/*.html",
  mainSass: "scss/main.scss",
  mainJS: "js/app.js",
  js: "js/**/*.js",
  sass: "scss/**/*.scss",
  fonts: "fonts/**",
};

var sources = {
  assets: config.source + paths.assets,
  html: config.source + paths.assets + paths.html,
  sass: paths.assets + paths.sass,
  js: config.source + paths.js,
  fonts: config.source + paths.assets + paths.fonts,
  rootSass: config.source + paths.assets + paths.mainSass,
  rootJS: config.source + paths.assets + paths.js
};

gulp.task('html', ()=> {
  gulp.src(sources.html)
  .pipe(gulp.dest(config.dist ));
});

//creando tarea sass
gulp.task("sass", function () {
  gulp.src(sources.rootSass)
      .pipe(sass({
          outputStyle: "compressed"
      }).on ("error", sass.logError))
      .pipe(gulp.dest(config.dist + paths.assets + "css"));
});

//creando tarea js
gulp.task("js", function () {
  gulp.src(sources.rootJS)
      .pipe(browserify({
        transform: ['babelify'],
      }))
      .pipe(concat('app.js'))
      //   .pipe(browserify())
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest(config.dist + paths.assets + "js"));
});

gulp.task('fonts', ()=> {
  gulp.src(sources.fonts)
      .pipe(gulp.dest(config.dist + paths.assets + 'fonts'));
});

//agregando más tareas
gulp.task("sass-watch", ["sass"], function (done) {
  browserSync.reload();
  done();
});

gulp.task("js-watch", ["js"], function (done) {
  browserSync.reload();
  done();
});

gulp.task("html-watch", ["html"], function (done) {
  browserSync.reload();
  done();
});



gulp.task("serve", function () {
  browserSync.init(null, {
      // proxy: "http://localhost:5000",
      files: ["public/**/*.*"],
      //browser: "google chrome",
      port: 7000,
      server: {
        baseDir: config.dist
      }
    });

  gulp.watch(sources.html, ["html-watch"]);
  gulp.watch(sources.sass, ["sass-watch"]);
  //gulp.watch(sources.js, ["js-watch"]);
});
