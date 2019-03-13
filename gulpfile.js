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
const replace = require('gulp-replace');

function noop() {}

gulp.task( 'del', () => {
  return del( [ './dist/' ] );
} );

function processCSS( source = 'src', dest = 'dist', cb = noop ) {
  var plugins = [
    autoprefixer( {
      "browsers": [
        'last 1 version'
      ]
    } ),
    cssnano()
  ];

  pump( [
    gulp.src( `./${source}/style/**/*.css` ),
    postcss( plugins ),
    gulp.dest( `./${dest}/style/` )
  ], cb );
}

gulp.task( 'cssmin', ( cb ) => {
  processCSS( 'public', 'dist', cb );
} );

gulp.task( 'cssmin-postprocess', ( cb ) => {
  processCSS( 'dist', 'dist' );
  processCSS( 'ja', 'ja', cb );
} );

function processFonts( source = 'public', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src('./src/style/fonts/*.{eot,otf,ttf,woff,woff2}'),
    gulp.dest('./dist/style/fonts/')
  ], cb );
}

gulp.task( 'fonts', ( cb ) => {
  processFonts( 'public', 'dist', cb );
} );

gulp.task( 'fonts-postprocess', ( cb ) => {
  processFonts( 'dist', 'dist' );
  processFonts( 'ja', 'ja', cb );
} );

function processHTML( source = 'public', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src( `./${source}/**/*.html` ),
    htmlmin( {
      "collapseWhitespace": true,
      "removeComments": true
    } ),
    gulp.dest( `./${dest}` )
  ], cb );
}

gulp.task( 'htmlmin', ( cb ) => {
  processHTML( 'public', 'dist', cb );
} );

gulp.task( 'htmlmin-postprocess', ( cb ) => {
  processHTML( 'dist', 'dist' ),
  processHTML( 'ja', 'ja', cb );
} );

function processJS( source = 'public', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src( `./${source}/script/**/*.js` ),
    uglify(),
    gulp.dest( `./${dest}/script` )
  ], cb );
}

gulp.task( 'jsmin', ( cb ) => {
  processJS( 'public', 'dist', cb );
} );

gulp.task( 'jsmin-postprocess', ( cb ) => {
  processJS( 'dist', 'dist' ),
  processJS( 'ja', 'ja' , cb );
} );

function processImages( source = 'src', dest = 'dist', cb = noop ) {
  var imgSources = [
    `./${source}/**/*.{png,gif,jpg,jpeg,jxr,webp,bpg,bmp,svg}`,
    `!./${source}/img/source/**/*`
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
    gulp.dest(`./${dest}/`)
  ], cb );
}

gulp.task( 'img', ( cb ) => {
  processImages( 'public', 'dist', cb );
} );

gulp.task( 'img-postprocess', ( cb ) => {
  processImages( 'dist', 'dist' ),
  processImages( 'ja', 'ja', cb );
} );

gulp.task( 'img-postprocess-ja', ( cb ) => {
  processImages( 'ja', 'ja', cb );
} );

gulp.task( 'delocalize', ( cb ) => {
  pump( [
    gulp.src('./dist/**/*.html'),
    replace('//local.', '//' ),
    gulp.dest('./dist/')
  ], cb );
} );

function processAudio( source = 'public', dest = 'dist', cb ) {
  pump( [
    gulp.src( `./${source}/audio/*.{mp3,wav,flac,aac,ac3}` ),
    gulp.dest( `./${dest}/audio` )
  ], cb );
}

gulp.task( 'audio', ( cb ) => {
  processAudio( 'public', 'dist', cb );
} );

gulp.task( 'audio-postprocess', ( cb ) => {
  processAudio( 'dist', 'dist' );
  processAudio( 'ja', 'ja', cb );
} );

function processFavicon( source = 'public', dest = 'dist', cb = noop ) {
  pump( [
    gulp.src( `./${source}/*.{ico,png}` ),
    gulp.dest( `./${dest}/` )
  ], cb );
}

gulp.task( 'favicon', ( cb ) => {
  processFavicon( 'public', 'dist', cb );
} );

gulp.task( 'favicon-postprocess', ( cb ) => {
  processFavicon( 'dist', 'dist' );
  processFavicon( 'ja', 'ja', cb );
} );

gulp.task( 'default',
  gulp.series(
    'del',
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' ),
    'delocalize'
  )
);

gulp.task( 'update',
  gulp.series(
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'img', 'audio', 'favicon' ),
    'delocalize'
  )
);

gulp.task( 'update-noimg',
  gulp.series(
    gulp.parallel( 'cssmin', 'fonts', 'htmlmin', 'jsmin', 'audio', 'favicon' ),
    'delocalize'
  )
);

gulp.task( 'postprocess',
  gulp.series(
    gulp.parallel(
      'cssmin-postprocess',
      'fonts-postprocess',
      'htmlmin-postprocess',
      'jsmin-postprocess',
      'audio-postprocess',
      'favicon-postprocess'
    ),
    'delocalize'
  )
);
