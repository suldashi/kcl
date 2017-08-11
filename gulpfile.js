var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require("browserify");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var runSequence = require("run-sequence");

var tsProject = ts.createProject('tsconfig.json');


gulp.task('server-build', function() {
	return gulp.src(["src/ts/**/*.ts"])
		.pipe(tsProject())
		.pipe(gulp.dest("./server"));
});


gulp.task('browser-build', function() {
	return gulp.src(["src/ts/**/*.ts","!src/ts/ws/websocketserver.ts","!src/ts/ws/websocketbrowser.ts"])
		.pipe(tsProject())
		.pipe(gulp.dest("./tmp"));
});


gulp.task("browserify", () => {
	return browserify({entries:"tmp/kcl.js",debug:false}).bundle()
		.pipe(source("kcl.browser.js"))
		.pipe(buffer())
		.pipe(gulp.dest("browser"));
});

gulp.task("browser", () => {
	return runSequence("browser-build","browserify");
});

gulp.task("server", () => {
	return runSequence("server-build");
});