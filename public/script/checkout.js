var $checkout = document.getElementById( 'checkout' );

var description = '2 widgets';

document.getElementById( 'checkout-cta' ).addEventListener( 'click', function( event ) {
  var handler = StripeCheckout.configure( {
    "key": "pk_test_Sf7VAyxCKbbzkZfpRVRCbK8J",
    "image": "https://apparel.nospoon.tv/img/no-spoon-apparel--instagram.png",
    "locale": "auto",
    "source": function ( source, args ) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.

      // An example of the args object:
      // {
      //   // Billing name and address
      //   "billing_name": "Stripe",
      //   "billing_address_country": "United States",
      //   "billing_address_zip": "94111",
      //   "billing_address_state": "CA",
      //   "billing_address_line1": "1234 Main Street",
      //   "billing_address_city": "San Francisco",
      //   "billing_address_country_code": "US",
      //
      //   // Shipping name and address
      //   "shipping_name": "Stripe",
      //   "shipping_address_country": "United States",
      //   "shipping_address_zip": "94111",
      //   "shipping_address_state": "CA",
      //   "shipping_address_line1": "1234 Main Street",
      //   "shipping_address_city": "San Francisco",
      //   "shipping_address_country_code": "US"
      // }
      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', $checkout.getAttribute( 'action' ), true );
      xhr.setRequestHeader( "Content-Type", "application/json" );
      xhr.onreadystatechange = function () {
        if ( xhr.readyState === 4 && xhr.status === 200 ) {
          console.log( xhr.responseText );
          // var json = JSON.parse( xhr.responseText );
          // console.log( json );
        }
      };
      var data = JSON.stringify(
        Object.assign( {
          "amount": 2000,
          "currency": "usd",
          "description": description,
          "stripeSource": source
        }, args )
      );
      xhr.send( data );
    },
    "zipCode": true,
    "billingAddress": true,
    "shippingAddress": true
  } );

  // Open Checkout with further options:
  handler.open( {
    "name": "No Spoon Apparel",
    "description": description,
    "amount": 2000
  } );
  event.preventDefault();
} );

// Close Checkout on page navigation:
window.addEventListener( 'popstate', function () {
  handler.close();
} );