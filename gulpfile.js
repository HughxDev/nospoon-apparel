const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const pump = require('pump');

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
    gulp.src( './src/style/*.css' ),
    postcss( plugins ),
    gulp.dest( './dist/style/' )
  ] );
} );

gulp.task( 'htmlmin', ( cb ) => {
  pump( [
    gulp.src( './src/*.html' ),
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
  pump( [
    gulp.src('./src/img/*.{png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg}'),
    gulp.dest('./dist/img')
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

gulp.task( 'default', [ 'cssmin', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' ] );
