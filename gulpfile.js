var gulp = require('gulp');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require("gulp-browserify");

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('webserver', function () {
	return gulp.src('./')
		.pipe(webserver({
			livereload: false,
			directoryListing: true,
			host:"0.0.0.0",
			open: 'http://127.0.0.1:8000/index.html',
		}));
});

gulp.task("browserify",function(){
	return gulp.src("./main.js")
		.pipe(browserify({
			insertGlobals: true,
			debug: !gulp.env.production
		}))
		.pipe(gulp.dest("./dist/"));
});

// 监听任务
gulp.task('watch', function () {
	gulp.watch(["./main.js","./modules/**/*.js"],["browserify"]);
});

gulp.task('default',['webserver','watch',"browserify"], function () {
	console.log("Server is running now");
});

