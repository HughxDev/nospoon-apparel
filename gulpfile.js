const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const pump = require('pump');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const del = require('del');

gulp.task( 'del', () => {
  return del( [ './dist/' ] );
} );

gulp.task( 'cssmin', ( cb ) => {
  var plugins = [
    autoprefixer( {
      "browsers": [
        'last 1 version'
      ]
    } ),
    cssnano()
  ];

  pump( [
    gulp.src( './src/style/**/*.css' ),
    postcss( plugins ),
    gulp.dest( './dist/style/' )
  ], cb );
} );

gulp.task( 'fonts', ( cb ) => {
  pump( [
    gulp.src('./src/style/fonts/*.{eot,otf,ttf,woff,woff2}'),
    gulp.dest('./dist/style/fonts/')
  ], cb );
} );

gulp.task( 'htmlmin', ( cb ) => {
  pump( [
    gulp.src( './src/**/*.html' ),
    htmlmin( {
      "collapseWhitespace": true,
      "removeComments": true
    } ),
    gulp.dest( './dist' )
  ], cb );
} );

gulp.task( 'jsmin', ( cb ) => {
  pump( [
    gulp.src('./src/script/*.js'),
    uglify(),
    gulp.dest('./dist/script')
  ], cb );
} );

gulp.task( 'img', ( cb ) => {
  var imgSources = [
    './src/**/*.{png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg}',
    '!./src/img/source/**/*'
  ];

  // pump( [
  //   gulp.src( imgSources ),
  //   webp( {
  //     "lossless": true
  //     // "nearLossless": 100
  //   } ),
  //   gulp.dest('./dist/')
  // ] );

  pump( [
    gulp.src( imgSources ),
    imagemin( [
      imagemin.gifsicle(),
      // imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo()
    ], {
      "verbose": true
    } ),
    gulp.dest('./dist/')
  ], cb );
} );

gulp.task( 'audio', ( cb ) => {
  pump( [
    gulp.src('./src/audio/*.{mp3,wav,flac,aac,ac3}'),
    gulp.dest('./dist/audio')
  ], cb );
} );

gulp.task( 'favicon', ( cb ) => {
  pump( [
    gulp.src('./src/*.{ico,png}'),
    gulp.dest('./dist/')
  ], cb );
} );

gulp.task( 'default',
  gulp.series(
    'del',
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' )
  )
);
