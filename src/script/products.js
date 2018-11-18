(function () {
  "use strict";

  function getSrcset( src ) {
    // src = redblue-tokyo/product--natural.png
    var srcParts = src.split( '.' );
    return src + ' 1x, ' + srcParts[0] + '@2x.' + srcParts[1] + ' 2x, ' + srcParts[0] + '@3x.' + srcParts[1] + ' 3x';
  }

  function changeProductShot( event ) {
    var $clicked = event.target;
    var $img = $clicked;
    var colorway;
    var src;
    var newSrc;
    var newColorway;

    if ( ( $clicked.nodeName.toLowerCase() === 'button' ) && ( $clicked.getAttribute( 'class' ).match( /\bcolor\b/i ) !== null ) ) {
      newColorway = $clicked.textContent.toLowerCase().replace( /\s+/, '-' );

      while ( !$img.hasAttribute( 'class' ) || $img.getAttribute( 'class' ).match( /\bproduct-colors\b/i ) === null ) {
        $img = $img.parentNode;
      }

      while ( !$img.hasAttribute( 'class' ) || $img.getAttribute( 'class' ).match( /\bproduct-link\b/i ) === null ) {
        $img = $img.previousElementSibling;
      }

      $img = $img.querySelector( 'img' );
      src = $img.getAttribute( 'src' );
      colorway = $img.getAttribute( 'data-colorway' );

      if ( colorway !== newColorway ) {
        newSrc = src.replace( colorway, newColorway );
        $img.setAttribute( 'data-colorway', newColorway );
        $img.setAttribute( 'srcset', getSrcset( newSrc ) );
        $img.setAttribute( 'src', newSrc );
      }
    }
  }

  var $products = document.getElementById( 'products' );

  $products.addEventListener( 'click', changeProductShot );
  $products.addEventListener( 'mouseover', changeProductShot );
})();