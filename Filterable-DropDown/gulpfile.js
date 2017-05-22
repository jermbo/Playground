const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence').use(gulp),
    config = require('./gulp.config')(),
    $ = require('gulp-load-plugins')({ lazy: true });

///////////////////////////
// Default
///////////////////////////
gulp.task('default', ['help']);

gulp.task('help', $.taskListing);

///////////////////////////
// Start Dev
///////////////////////////
gulp.task('__start-local__', ['task:compile-styles', 'task:compile-scripts', 'task:compile-html', 'task:compile-images', 'task:start-watch']);

gulp.task('__compile-assets__', ['task:compile-styles', 'task:compile-scripts', 'task:compile-html', 'task:compile-images']);

gulp.task('_compile-styles_', ['task:compile-styles']);
gulp.task('_compile-scripts_', ['task:compile-scripts']);
gulp.task('_compile-html_', ['task:compile-html']);
gulp.task('_compile-images_', ['task:compile-images']);

gulp.task('task:compile-styles', () => {
    return gulp
        .src(config.styles.source)
        .pipe(errorHandler())
        .pipe($.sourcemaps.init())
        .pipe($.sass(config.options.sass))
        .pipe($.autoprefixer(config.autoPrefixerOptions))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.styles.build))
        .pipe(browserSync.stream());
});

gulp.task('task:compile-scripts', () => {
    return gulp
        .src(config.scripts.source)
        .pipe($.changed(config.scripts.build))
        .pipe(gulp.dest(config.scripts.build));
});

gulp.task('task:compile-html', () => {
    return gulp
        .src(config.html.source)
        .pipe($.changed(config.html.build))
        .pipe(gulp.dest(config.html.build));
});

gulp.task('task:compile-images', () => {
    return gulp
        .src(config.images.source)
        .pipe($.changed(config.images.build))
        .pipe(gulp.dest(config.images.build));
});

gulp.task('task:start-watch', ['task:start-server'], () => {
    gulp.watch(config.styles.source, ['task:compile-styles']);
    gulp.watch(config.html.source, ['task:compile-html', 'task:page-reload']);
    gulp.watch(config.scripts.source, ['task:compile-scripts', 'task:page-reload']);
    gulp.watch(config.images.source, ['task:compile-images', 'task:page-reload']);
});

gulp.task('task:start-server', () => {
    if(config.devURL == './'){
        config.browserSync['server'] = {
            baseDir: config.deployPath
        }
    }else{
        config.browserSync['proxy'] = config.devURL;
    }

    browserSync.init(null, config.browserSync);
});

gulp.task('task:page-reload', () => {
    browserSync.reload();
});

///////////////////////////
// Lint Styles
///////////////////////////
gulp.task('__lint-everything__', ['_lint-styles_', '_lint-scripts_'])

gulp.task('_lint-styles_', () => {
    runSequence('clean:sass', 'lint:sass');
});

gulp.task('clean:sass', () => {
    return gulp
        .src(config.styles.source)
        .pipe($.changed(config.styles.source))
        .pipe($.jsbeautifier(config.options.formatting))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest(config.basePath + 'sass'));
});

gulp.task('lint:sass', () => {
    return gulp
        .src(config.basePath + 'sass/*.scss')
        .pipe($.sassLint(config.options.lint.sass))
        .pipe($.sassLint.format());
});

///////////////////////////
// Lint Scripts
///////////////////////////
gulp.task('_lint-scripts_', () => {
    runSequence('clean:js', 'lint:js');
});

gulp.task('clean:js', () => {
    return gulp
        .src(config.scripts.source)
        .pipe($.changed(config.scripts.source))
        .pipe($.jsbeautifier(config.options.formatting))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest(config.scripts.build));
});

gulp.task('lint:js', () => {
    return gulp
        .src(config.scripts.source)
        .pipe($.eslint(config.options.lint.js))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

///////////////////////////
// Lint Markup
///////////////////////////
gulp.task('_lint-markup_', () => {
    runSequence('clean:html');
});

gulp.task('clean:html', () => {
    return gulp
        .src(config.html.source)
        .pipe($.jsbeautifier(config.options.formatting))
        .pipe($.jsbeautifier.reporter())
        .pipe(gulp.dest(config.html.build));
});

///////////////////////////
// Functions
///////////////////////////
function errorHandler() {
    return $.plumber({
        errorHandler: function(err) {
            $.notify.onError({
                title: `Error : ${err.plugin}`,
                message: `Issue : ${err}`,
                sound: false
            })(err);

            console.log(`

/////////////////////////////////////
/////////////////////////////////////
Error: ${err.plugin}
Issue : ${err}
/////////////////////////////////////
/////////////////////////////////////

`);
            this.emit('end');
        }
    });
}
