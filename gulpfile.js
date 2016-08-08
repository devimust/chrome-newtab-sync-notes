// load gulp
var gulp = require('gulp');

// load gulp plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');

// clean
gulp.task('clean', function() {
	return gulp.src([
		'./build/js/*', './build/css/*', './build/fonts/*', './build/icons/*'
	], {read: false})
	.pipe(clean());
});

// bundle js app files together into single file
gulp.task('src-js', function () {
	return gulp.src('./src/js/**/*.js')
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('./build/js'))
});

// bundle js lib files together into single file
gulp.task('lib-js', function () {
	return gulp.src([
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/medium-editor/dist/js/medium-editor.min.js'
	])
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('./build/js'))
});

// copy static font files
gulp.task('lib-fonts', function () {
	return gulp.src([
		'./node_modules/font-awesome/fonts/*'
	])
	.pipe(gulp.dest('./build/fonts'))
});

// copy icon app files
gulp.task('src-icons', function () {
	return gulp.src([
		'./src/icons/*'
	])
	.pipe(gulp.dest('./build/icons'))
});

// bundle css lib files together into single file
gulp.task('lib-css', function () {
	return gulp.src([
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/medium-editor/dist/css/medium-editor.min.css',
		'./node_modules/medium-editor/dist/css/themes/default.min.css',
	])
	.pipe(concat('libs.css'))
	.pipe(gulp.dest('./build/css'))
});

// bundle scss app files together into single file
gulp.task('src-scss', function () {
	return gulp.src('./src/scss/styles.scss')
	.pipe(sass())
	.pipe(rename('main.css'))
	.pipe(cleanCSS())
	.pipe(gulp.dest('./build/css'))
});

// copy extra files to build
gulp.task('src-copy', function () {
	return gulp.src([
		'./newtab.html',
		'./manifest.json'
	])
	.pipe(gulp.dest('./build'))
});

// bundling and optimization
gulp.task('build', ['clean'], function (cb) {
	runSequence([
		'lib-css', 'lib-js', 'lib-fonts', 'src-icons', 'src-scss', 'src-js', 'src-copy'
	], cb);
});

gulp.task('watch', ['build'] , function() {
	gulp.watch('./src/js/**/*.js', ['src-js']);
	gulp.watch('./src/scss/*.scss', ['src-scss']);
	gulp.watch('./src/icons/*', ['src-icons']);
});

gulp.task('default', ['build']);
