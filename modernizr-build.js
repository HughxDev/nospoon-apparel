const modernizr = require('modernizr');
const fs = require('fs');

modernizr.build({
  "feature-detects": [
    "img/webp",
    // "img/webp-alpha"
  ]
}, function (result) {
  fs.writeFile( 'src/script/modernizr.js', result, 'utf8', function ( err ) {
    if ( !err ) {
      console.log( 'Built modernizr!' );
      process.exit();
    } else {
      console.log( 'Error: ', error );
      process.exit(1);
    }
  });
});