(function () {
  "use strict";

  var $addToCartForm = $( '#checkout' );
  var rowSlideSpeed = 250;

  // $(document).ready(function () {
  $( '.repeater' ).repeater( {
    "defaultValues": {
      "size": "S",
      // "qty": "1"
      // "color-select": "#ffffff"
    },
    // show: slideDownRepeaterRow,
    "show": function showRepeaterRow() {
      var $row = $( this );

      // $addToCartForm.height( $addToCartForm.height() + $row.height() );

      $row.find( '.qty' ).eq( 0 ).val( 1 );
      // $row.find( '.color-select-value' ).eq( 0 ).val( '#ffffff' );

      // $row.slideDown( rowSlideSpeed, function () {
      //   console.log('shit');
      // } );
      var $wrappers = $row.find( '.table-cell-wrapper' );

      $row.show();
      $wrappers.css({
        "height": "1.9rem",
        "opacity": "1"
      })
    },
    // hide: slideUpRepeaterRow,
    "hide": function hideRepeaterRow() {
      var $row = $( this );
      var $wrappers = $row.find( '.table-cell-wrapper' );

      // $addToCartForm.height( $addToCartForm.height() - $row.height() );

      $wrappers.css({
        "height": "0",
        "opacity": "0"
      });

      setTimeout( function () {
        $row.remove();
      }, 250 );

      // $row.slideUp( rowSlideSpeed, function () {
        // console.log('fuck');
      // } );
    },
    "isFirstItemUndeletable": true
  } );
  // });
})();