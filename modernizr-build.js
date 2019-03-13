const modernizr = require('modernizr');
const fs = require('fs');

modernizr.build({
  "feature-detects": [
    "img/webp",
    // "img/webp-alpha"
  ]
}, function (result) {
  fs.writeFile( 'public/script/modernizr.js', result, 'utf8', function ( error ) {
    if ( !error ) {
      console.log( 'Built modernizr!' );
      process.exit();
    } else {
      console.log( 'Error: ', error );
      process.exit(1);
    }
  });
});