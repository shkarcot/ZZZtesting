/**
 * gulp task to run local
 *
 **/

"use strict";

var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var open = require("open");
var rimraf = require("rimraf");
var spawn = require("cross-spawn-async");
var path = require("path");
var Server = require('karma').Server;
var webpack = require("webpack");
//var Proxy = require('gulp-connect-proxy');
//var connect = require('gulp-connect');
//var Proxy = require('gulp-api-proxy');
/**
 * A function that will register default gulp tasks.
 *
 * @param {Object} gulp - A reference to the gulp module
 */

var config = require(path.resolve("webpack.config.js"));
config.entry.vendor.unshift("expose?$!expose?jQuery!jquery", "bootstrap-sass");

var port = (config && config.devServer && config.devServer.port) ? config.devServer.port : 8000;
/////////////////////////////////////////////////////////////////////////////
// local development

gulp.task("run", ["serve:dev", "open:dev"]);
gulp.task("run:background", ["serve:dev"]);

gulp.task("serve:dev", function(done) {
  // Run the webpack-dev-server CLI
  var webpackDevServer = spawn("node", ["../node_modules/webpack-dev-server/bin/webpack-dev-server.js",
    "--config", "./webpack.config.js",
    "--inline", "--hot",
    "--history-api-fallback"
  ], {
    stdio: 'inherit'
  });

  webpackDevServer.on("close", done);
});

gulp.task("open:dev", function() {
    open("http://localhost:" + port + "");
});


/////////////////////////////////////////////////////////////////////////////
// local development packaged build

gulp.task("run:dist", ["serve:dist", "open:dist"]);

gulp.task("serve:dist", ["package"], function() {
  // run a node static web server for the files in the dist folder
  var nodeStatic = require("node-static");
  var file = new nodeStatic.Server("./dist");
  require("http").createServer(function(request, response) {
    request.addListener("end", function() {
      file.serve(request, response);
    }).resume();
  }).listen(port);
});

gulp.task("open:dist", ["package"], function() {
    open("http://localhost:" + port + "");
});

/////////////////////////////////////////////////////////////////////////////
// packaging

gulp.task("clean", function(done) {
   rimraf("{dist/,.tmp/,../../static/uam/}", done);
});

gulp.task("package", ["clean","build-images"], function(done) {
  // Run the webpack CLI
  var webpackCompiler = spawn("node", ["../node_modules/webpack/bin/webpack.js",
    "--config", "./webpack.config.js"
  ], {
    stdio: 'inherit'
  });

  webpackCompiler.on("close", done);
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*.{gif,jpg,png,svg}')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      pngquant: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});
gulp.task('build-images', function() {
  return gulp.src('./app/images/**/*.{gif,jpg,png,svg}')
      .pipe(gulp.dest('dist/app/images'));
});


// set the default task
gulp.task("default", ["test", "package"]);

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.config.js',
        singleRun: false
    }, done).start();
});

gulp.task('test:single', function(done) {
    new Server({
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    }, done).start();
});

gulp.task('copy', function() {
    gulp.src('dist/**')
        .pipe(gulp.dest('../../static/uam/'))
});