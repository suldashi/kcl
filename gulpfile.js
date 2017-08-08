var gulp = require('gulp');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');
var del = require("del");
var browserify = require("browserify");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var runSequence = require("run-sequence");
var exec = require('child_process').exec;

var tsProject = ts.createProject('tsconfig.json');

gulp.task('server-pre', function() {
	return gulp.src("src/ts/ws/websocketserver.ts")
		.pipe(rename("websocket.ts"))
		.pipe(gulp.dest("src/ts/ws/"));
});

gulp.task('server-build', function() {
	return gulp.src(["src/ts/**/*.ts","!src/ts/ws/websocketserver.ts","!src/ts/ws/websocketbrowser.ts"])
		.pipe(tsProject())
		.pipe(gulp.dest("./server"));
});

gulp.task('server-post', function() {
	return del("src/ts/ws/websocket.ts",{force:true});
});

gulp.task('browser-pre', function() {
	return gulp.src("src/ts/ws/websocketbrowser.ts")
		.pipe(rename("websocket.ts"))
		.pipe(gulp.dest("src/ts/ws/"));
});

gulp.task('browser-build', function() {
	return gulp.src(["src/ts/**/*.ts","!src/ts/ws/websocketserver.ts","!src/ts/ws/websocketbrowser.ts"])
		.pipe(tsProject())
		.pipe(gulp.dest("./tmp"));
});

gulp.task('browser-post', function() {
	return del(["src/ts/ws/websocket.ts","tmp"],{force:true});
});

gulp.task("browserify", () => {
	return browserify({entries:"tmp/kcl.js",debug:false}).bundle()
		.pipe(source("kcl.browser.js"))
		.pipe(buffer())
		.pipe(gulp.dest("browser"));
});

gulp.task("browser", () => {
	return runSequence("browser-pre","browser-build","browserify","browser-post");
});

gulp.task("server", () => {
	return runSequence("server-pre","server-build","server-post");
});