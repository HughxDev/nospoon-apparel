(function () {
  "use strict";

  function changeProductShot( event ) {
    var $clicked = event.target;

    if (
      ( $clicked.nodeName.toLowerCase() === 'button' )
      && ( $clicked.getAttribute( 'class' ).match( /\bcolor\b/i ) !== null )
      && ( $clicked.hasAttribute( 'data-colorway' ) )
    ) {
      var colorway = $clicked.getAttribute( 'data-colorway' );
      var product = colorway.split( '--' ); product = product[0];
      var colorways = document.getElementById( product ).querySelectorAll( 'img' );

      for ( var i = 0; i < colorways.length; i++ ) {
        var current = colorways[i];
        if ( current.id === colorway ) {
          current.hidden = false;
        } else {
          current.hidden = true;
        }
      }
    }
  }

  var $products = document.getElementById( 'products' );

  $products.addEventListener( 'click', changeProductShot );
  $products.addEventListener( 'mouseover', changeProductShot );
})();