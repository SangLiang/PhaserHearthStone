var gulp = require('gulp');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('webserver', function () {
	return gulp.src('./')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: 'http://127.0.0.1:8000/index.html',
		}));
});

// 监听任务
gulp.task('watch', function () {
	gulp.watch("./public/sass/*.scss", ['sass']);
	gulp.watch(core_list, ["concat"]);
	gulp.watch("./main.js",["concat"]);
});

gulp.task('default',['webserver'], function () {
	console.log("Server is running now");
});

