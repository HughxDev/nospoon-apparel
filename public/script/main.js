(function () {
  'use strict';
  // Init
  var $html = document.documentElement;
  $html.classList.remove( 'no-js' );
  $html.classList.add( 'js' );

  var $checkbox = document.getElementById( 'checkbox' );
  var $hamburger = document.getElementById( 'hamburger' );
  var $hamburgerTarget = document.getElementById( $hamburger.getAttribute( 'aria-controls' ) );
  var $cart = document.getElementById( 'cart' );
  var $cartContents = document.getElementById( 'cart-contents' );
  var $cartEmpty = document.getElementById( 'cart-empty' );
  var $cartLinks = document.querySelectorAll( '.cart-link, .cart-action' );
  var $nav = document.getElementById( 'site-nav' );

  var KEY_ENTER = 13;
  var KEY_SPACE = 32;

  $cart.addEventListener( 'click', function ( event ) {
    event.stopPropagation();
  } );

  // Accessibility
  function takecartLinksOutOfTabOrder() {
    for ( var i = 0; i < $cartLinks.length; i++ ) {
      $cartLinks[i].setAttribute( 'tabindex', '-1' );
    }
  }

  function putcartLinksIntoTabOrder() {
    for ( var i = 0; i < $cartLinks.length; i++ ) {
      $cartLinks[i].setAttribute( 'tabindex', '0' );
    }
  }

  function setExpandedMenuState( $button, $toggleTarget ) {
    var $toggleTarget = ( $toggleTarget || document.getElementById( $button.getAttribute( 'aria-controls' ) ) );

    $button.setAttribute( 'aria-expanded', 'true' );
    $toggleTarget.setAttribute( 'aria-hidden', 'false' );
    putcartLinksIntoTabOrder();

    setTimeout( function () {
      document.body.addEventListener( 'click', collapseHamburgerMenu );
    }, 0 );
  }

  function expandHamburgerMenu() {
    if ( $hamburger.getAttribute( 'aria-expanded' ) === 'false' ) {
      $checkbox.checked = true;
      setExpandedMenuState( $hamburger, $hamburgerTarget );
    }
  }

  function setCollapsedMenuState( $button, $toggleTarget ) {
    var $toggleTarget = ( $toggleTarget || document.getElementById( $button.getAttribute( 'aria-controls' ) ) );

    $button.setAttribute( 'aria-expanded', 'false' );
    $toggleTarget.setAttribute( 'aria-hidden', 'true' );
    takecartLinksOutOfTabOrder();

    setTimeout( function () {
      document.body.removeEventListener( 'click', collapseHamburgerMenu );
    }, 0 );
  }

  function collapseHamburgerMenu( event ) {
    if ( $hamburger.getAttribute( 'aria-expanded' ) === 'true' ) {
      $checkbox.checked = false;
      setCollapsedMenuState( $hamburger, $hamburgerTarget );
    }
  }

  function hamburgerKeyHandler( event ) {
    switch ( event.which ) {
      case KEY_ENTER:
      case KEY_SPACE: {
        event.stopPropagation();

        if ( $hamburger.getAttribute( 'aria-expanded' ) === "false" ) {
          $hamburger.click();
          $hamburger.focus();
          setExpandedMenuState( $hamburger, $hamburgerTarget );
        } else {
          $hamburger.click();
          $hamburger.focus();
          setCollapsedMenuState( $hamburger, $hamburgerTarget );
        }
        break;
      }
    } //end switch

    return true;
  }

  function hamburgerClickHandler( event ) {
    if ( $hamburger.getAttribute( 'aria-expanded' ) === "false" ) {
      setExpandedMenuState( $hamburger, $hamburgerTarget );
    } else {
      setCollapsedMenuState( $hamburger, $hamburgerTarget );
    }
  }

  takecartLinksOutOfTabOrder();

  $hamburger.addEventListener( 'keypress', hamburgerKeyHandler );
  $hamburger.addEventListener( 'click', hamburgerClickHandler );

  // Date & time
  var $currentTime = document.getElementById( 'current-time' );
  var $year = document.getElementById( 'year' );
  var $month = document.getElementById( 'month' );
  var $day = document.getElementById( 'day' );
  var $hour = document.getElementById( 'hour' );
  var $minutes = document.getElementById( 'minutes' );
  var $seconds = document.getElementById( 'seconds' );
  var $am = document.getElementById( 'am' );
  var $pm = document.getElementById( 'pm' );
  var $datetime = document.getElementById( 'datetime' );
  var $currentYear = document.getElementById( 'current-year' );

  var currentYear = ( new Date() ).getFullYear();
  if ( $currentYear && ( $currentYear.textContent !== currentYear ) ) {
    $currentYear.textContent = currentYear;
  }

  // Language
  function hideElements( $elements ) {
    for ( var i = 0; i < $elements.length; i++ ) {
      $elements[i].hidden = true;
    }
  }

  function showElements( $elements ) {
    for ( var i = 0; i < $elements.length; i++ ) {
      $elements[i].hidden = false;
    }
  }

  function changeProductShot( event ) {
    var $clicked = event.target;

    if (
      // ( $clicked.nodeName.toLowerCase() === 'button' )
      // && ( $clicked.getAttribute( 'class' ).match( /\bcolor\b/i ) !== null )
      $clicked.hasAttribute( 'data-colorway' ) || !!$clicked.value
    ) {
      var colorway = $clicked.getAttribute( 'data-colorway' ) || $clicked.value;
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

  function getCartItemId( node ) {
    var $tr = node.parentNode;

    while ( $tr.nodeName.toLowerCase() !== 'tr' ) {
      $tr = $tr.parentNode;
    }

    return $tr.id;
  }

  function xhr( url, callback ) {
    var request;

    if ( window.XMLHttpRequest ) {
      request = new XMLHttpRequest(); // browsers besides IE
    } else if ( window.ActiveXObject ) {
      request = new ActiveXObject( 'Microsoft.XMLHTTP' ); // IE
    } else {
      console.error( 'Could not create XHR object!' );
    }

    request.onreadystatechange = function () {
      if ( request.readyState === 4 ) { // request completed
        if ( request.status === 200 ) { // HTTP response code (200 == OK)
          callback( null, JSON.parse( request.responseText ) );
        } else {
          callback( request.status, null );
        }
      }
    };
    request.open( 'GET', url, true );
    request.send( '' );

    return request;
  }

  function getRevisionManifest( callback ) {
    xhr( '/rev-manifest.json', function getRevisionManifestXhrCallback( error, data ) {
      if ( !error ) {
        callback( data );
      }
    } )
  }

  function buildCartImage( product, colorway, revisionManifest ) {
    var $img = document.createElement( 'img' );
    var $source = document.createElement( 'source' );
    var $picture = document.createElement( 'picture' );

    var pngSrc = 'collection/' + product + '/product--' + colorway + '.png';
    var webpSrc = pngSrc.replace( /\.png$/i, '.webp' );

    $img.width = 128;
    $img.height = 128;
    $img.src = '/' + revisionManifest[pngSrc];

    $source.type = 'image/webp';
    $source.srcset = '/' + revisionManifest[webpSrc];

    $picture.appendChild( $source );
    $picture.appendChild( $img );

    return $picture;
  }

  function populateCart( cart ) {
    if ( !cart ) {
      cart = JSON.parse( localStorage.getItem( 'cart' ) );
    }

    var i = 0, j = 0;
    // var cartLength = ( cart ? cart.length : 0 );
    var current;
    var $tr;
    var $td;
    var $div;
    var order = [ 'id', 'size', 'colorway', 'quantity', 'actions' ];
    // var $img;
    // var $picture;
    // var $source;
    // var webpSrc;
    // var pngSrc;
    var cartImageElements = {};
    var orderLength = order.length;
    // var map = [];
    // var mapItem = {};
    var $remove;
    var $removeIcon;
    var $tbody = $cartContents.children[1];
    var cartItems = ( cart ? Object.keys( cart ) : false );
    var cartLength = ( cartItems ? cartItems.length : 0 );
    // var $sizeSelect;
    // var $sizeOption;
    // var currentSizeOption;
    // var $colorwaySelect;
    // var $colorwayOption;
    // var currentColorwayOption;
    var $qtySelect;
    var product;
    var colorway;

    while ( $tbody.firstChild ) {
      $tbody.removeChild( $tbody.firstChild );
    }

    if ( cartLength > 0 ) {
      for ( ; i < cartLength; ++i ) {
        current = cartItems[i];
        // console.log( current );

        $tr = document.createElement( 'tr' );
        $tr.setAttribute( 'id', current );
        $tr.setAttribute( 'data-repeater-item', '' );

        for ( ; j < orderLength; ++j ) {
          $td = document.createElement( 'td' );
          $div = document.createElement( 'div' );
          $div.setAttribute( 'class', 'table-cell-wrapper table-cell-wrapper--cart' );

          if ( order[j] === 'id' ) {
            product = cart[current][order[j]];
            colorway = cart[current].colorway.id;

            $div.appendChild( buildCartImage( product, colorway, NoSpoonApparel.revisionManifest ) );
          } else if ( order[j] === 'size' ) {
            $div.textContent = cart[current].size.id;
            // $sizeSelect = document.createElement( 'select' );
            //
            // for ( var k = 0; k < cart[current].size.options.length; ++k ) {
            //   currentSizeOption = cart[current].size.options[k];
            //   $sizeOption = document.createElement( 'option' );
            //   $sizeOption.setAttribute( 'data-vendor-id', currentSizeOption.vendorId );
            //   $sizeOption.textContent = currentSizeOption.id;
            //
            //   if ( currentSizeOption.id === cart[current].size.id ) {
            //     $sizeOption.selected = true;
            //   }
            //
            //   $sizeSelect.appendChild( $sizeOption );
            // }
            //
            // $div.appendChild( $sizeSelect );
          } else if ( order[j] === 'colorway' ) {
            $div.textContent = cart[current].colorway.name;
            // $colorwaySelect = document.createElement( 'select' );
            //
            // for ( var l = 0; l < cart[current].colorway.options.length; ++l ) {
            //   currentColorwayOption = cart[current].colorway.options[l];
            //   $colorwayOption = document.createElement( 'option' );
            //   $colorwayOption.setAttribute( 'data-vendor-id', currentColorwayOption.vendorId );
            //   $colorwayOption.setAttribute( 'value', currentColorwayOption.id );
            //   $colorwayOption.textContent = currentColorwayOption.name;
            //
            //   if ( currentColorwayOption.id === cart[current].colorway.id ) {
            //     $colorwayOption.selected = true;
            //   }
            //
            //   $colorwaySelect.appendChild( $colorwayOption );
            // }
            //
            // $div.appendChild( $colorwaySelect );
          } else if ( order[j] === 'actions' ) {
          /*
            <button data-repeater-delete="" type="button" class="table-action table-action--remove" title="Remove" aria-label="Remove" data-translate="REMOVE" data-translate-target="title,aria-label">
              <span aria-hidden="true">-</span>
            </button>
          */
            $remove = document.createElement( 'button' );
            $removeIcon = document.createElement( 'span' );
            $removeIcon.textContent = '-';
            $removeIcon.setAttribute( 'aria-hidden', 'true' );

            $remove.setAttribute( 'data-repeater-delete', '' );
            $remove.setAttribute( 'type', 'button' );
            $remove.setAttribute( 'class', 'table-action table-action--remove' );
            $remove.setAttribute( 'title', 'Remove' );
            $remove.setAttribute( 'aria-label', 'Remove' );
            $remove.setAttribute( 'data-translate', 'REMOVE' );
            $remove.setAttribute( 'data-translate-target', 'title,aria-label' );

            $remove.appendChild( $removeIcon );
            $div.appendChild( $remove )
          } else if ( order[j] === 'quantity' ) {
            $qtySelect = document.createElement( 'input' );
            $qtySelect.setAttribute( 'type', 'number' );
            $qtySelect.setAttribute( 'class', 'qty' );
            $qtySelect.setAttribute( 'min', '1' );
            $qtySelect.value = cart[current].quantity;

            $div.appendChild( $qtySelect );
          } else {
            $div.textContent = cart[current][order[j]];
          }

          $td.appendChild( $div );
          $tr.appendChild( $td );
        }
        j = 0;

        $tbody.appendChild( $tr );
      }

      $tbody.addEventListener( 'change', function ( event ) {
        cart[getCartItemId( event.target )].quantity = parseInt( event.target.value, 10 );
        localStorage.setItem( 'cart', JSON.stringify( cart ) );
      } );

      $cartContents.hidden = false;
      $cartEmpty.hidden = true;
      $checkoutCta.disabled = false;
      $cart.removeAttribute( 'data-empty' );
    } else {
      $cart.setAttribute( 'data-empty', '' );
    }
  }

  function emptyCart() {
    $cart.setAttribute( 'data-empty', '' );
    $cartContents.hidden = true;
    $cartEmpty.hidden = false;
    $checkoutCta.disabled = true;
    localStorage.removeItem( 'cart' );
  }

  function getCartData() {
    return localStorage.getItem( 'cart' );
  }

  function getUniqueId( cartItem ) {
    return ( cartItem.id + '--' + cartItem.colorway.id + '--' + cartItem.size.id );
  }

  var $language = document.getElementById( 'language' );
  var $englishText = document.querySelectorAll( '[lang="en"]:not(html):not([data-translate-preserve])' );
  var $japaneseText = document.querySelectorAll( '[lang="ja"]:not(html):not([data-translate-preserve])' );
  var $japaneseFont = document.getElementById( 'japanese-font' );
  var $japaneseLink = document.getElementById( 'japanese' );
  var $main = document.querySelector( 'main' );
  var $checkoutCta = document.getElementById( 'checkout-cta' );
  var isProductPage = $main.classList.contains( 'view--product' );
  var isCollectionPage = $main.classList.contains( 'view--collection' );
  var $addToCartCta, $yourOrder, $products;

  var lang = NoSpoonApparel.lang;
  var defaultPrice;

  var $addToCartForm;
  var rowSlideSpeed = 250;

  if ( !NoSpoonApparel.revisionManifest ) {
    getRevisionManifest( function gotRevisionManifest( manifest ) {
      NoSpoonApparel.revisionManifest = manifest;
      populateCart();
    } );
  } else {
    populateCart();
  }

  var $$cartContents = $( $cartContents );
  $$cartContents.repeater( {
    "hide": function hideRepeaterRow() {
      var $$row = $( this );
      var $wrappers = $$row.find( '.table-cell-wrapper' );
      var cart = getCartData();

      // $addToCartForm.height( $addToCartForm.height() - $row.height() );
      if ( cart && cart.length ) {
        cart = JSON.parse( cart );
        delete cart[this.id];
        localStorage.setItem( 'cart', JSON.stringify( cart ) );
      }

      $wrappers.css( {
        "height": "0",
        "opacity": "0"
      } );

      setTimeout( function () {
        $$row.remove();
      }, 250 );

      if ( ( $$row.prev().length === 0 ) && ( $$row.next().length === 0 ) ) {
        $$cartContents.css( {
          "height": "0",
          "opacity": "0"
        } );

        setTimeout( function () {
          emptyCart();
          $$cartContents.css( {
            "height": "",
            "opacity": ""
          } );
        }, 250 );
      }
    }
  } ); // $$cartContents

  if ( isProductPage ) {
    $addToCartForm = $( '#add-to-cart' );
    $yourOrder = document.getElementById( 'your-order' );
    // $colorSelectButton = document.getElementById( 'color-select-button' );
    $addToCartCta = document.getElementById( 'add-to-cart-cta' );
    $addToCartCta.disabled = false;
    defaultPrice = NoSpoonApparel.product.variants[0].price.USD.amount;

    lang._PRODUCT_NAME_ = NoSpoonApparel.product.name;
    lang._PRODUCT_TAGLINE_ = NoSpoonApparel.product.tagline;
    lang._PRODUCT_PRICE_ = {};

    for ( var priceFormat in lang._PRICE_USD_ ) {
      lang._PRODUCT_PRICE_[priceFormat] = lang._PRICE_USD_[priceFormat].replace( 'X', defaultPrice )
    }

    var existingCart = getCartData();

    $addToCartCta.addEventListener( 'click', function addToCart( event ) {
      var formElements = $addToCartForm.get( 0 ).elements;
      var formElementsLength = formElements.length;
      var current;
      var cart = getCartData();
      var currentOrder = {};
      var colorway;
      var currentChildrenLength;
      var currentColorway;
      var currentColorwayId;
      var existingCartLength;
      var currentExistingCartItem;
      var currentSize;

      // if ( existingCart && existingCart.length ) {
      //   console.log( 'existingCart', existingCart );
      //   existingCart = JSON.parse( existingCart );
      // } else {
      //   existingCart = false;
      // }

      if ( cart && cart.length ) {
        cart = JSON.parse( cart );
      } else {
        cart = {};
      }

      for ( var i = 0; i < formElementsLength; ++i ) {
        current = formElements[i];

        if ( /(productId|vendorProductId)/.test( current.name ) ) {
          continue;
        }

        if ( current.nodeName.toLowerCase() === 'fieldset' ) {
          continue;
        }

        if ( current.nodeName.toLowerCase() === 'button' ) {
          continue;
        }

        console.log( 'i:', i );
        console.log( 'current', current );

        if ( /[a-z]+\[[0-9]+\]\[size\]/.test( current.name ) ) {
          currentOrder.size = {
            "id": current.value,
            "options": []
          };

          currentChildrenLength = current.children.length;
          for ( j = 0; j < currentChildrenLength; ++j ) {
            currentSize = current.children[j];
            // console.log( 'current.children[j]', current.children[j], current.children[j].selected );
            currentOrder.size.options.push( {
              "id": currentSize.textContent,
              "vendorId": currentSize.getAttribute( 'data-vendor-id' )
            } );

            if ( current.children[j].selected ) {
              currentOrder.size.vendorId = currentSize.getAttribute( 'data-vendor-id' );
            }
          }
        }

        if ( /[a-z]+\[[0-9]+\]\[colorway\]/.test( current.name ) ) {
          colorway = current.value.split( '--' );
          currentOrder.id = colorway[0];
          currentOrder.colorway = {
            "id": colorway[1],
            "options": []
          };

          currentChildrenLength = current.children.length;
          for ( var j = 0; j < currentChildrenLength; ++j ) {
            // console.log( 'current.children[j]', current.children[j], current.children[j].selected );
            currentColorway = current.children[j];
            currentColorwayId = currentColorway.value.split( '--' );
            currentColorwayId = currentColorwayId[1];

            currentOrder.colorway.options.push( {
              "id": currentColorwayId,
              "vendorId": currentColorway.getAttribute( 'data-vendor-id' ),
              "name": currentColorway.textContent
            } );

            if ( currentColorway.selected ) {
              currentOrder.colorway.vendorId = currentColorway.getAttribute( 'data-vendor-id' );
              currentOrder.colorway.name = currentColorway.textContent;
            }
          }
        }

        if ( /[a-z]+\[[0-9]+\]\[quantity\]/.test( current.name ) ) {
          var uniqueId = getUniqueId( currentOrder );
          var quantity = parseInt( current.value, 10 );

          console.log( 'uniqueId', uniqueId );

          if ( cart.hasOwnProperty( uniqueId ) ) {
            console.log( 'uniqueId exists already' );
            cart[uniqueId].quantity += quantity;
          } else {
            console.log( 'uniqueId does NOT exist already' );
            currentOrder.quantity = quantity;
            cart[uniqueId] = currentOrder;
          }
          currentOrder = {};
        }
      } // for loop for formElements

      console.log( 'cart', cart );

      localStorage.setItem( 'cart', JSON.stringify( cart ) );
      if ( !NoSpoonApparel.revisionManifest ) {
        getRevisionManifest( function gotRevisionManifest( manifest ) {
          NoSpoonApparel.revisionManifest = manifest;
          populateCart( cart );
        } );
      } else {
        populateCart( cart );
      }
    } );

    $yourOrder.addEventListener( 'change', function ( event ) {
      if ( event.target.id === 'color-select-button' ) {
        changeProductShot( event );
      }
    } );

    // $(document).ready(function () {
    $( '.repeater' ).repeater( {
      "defaultValues": {
        "size": "S",
        // "qty": "1"
        "colorway": $( "#color-select-button" ).val()
      },
      // show: slideDownRepeaterRow,
      "show": function showRepeaterRow() {
        var $row = $( this );

        // $addToCartForm.height( $addToCartForm.height() + $row.height() );

        $row.find( '.qty' ).eq( 0 ).val( 1 );
        // $row.find( '#color-select-button' ).eq( 0 ).val(  );

        // $row.slideDown( rowSlideSpeed, function () {
        //   console.log('shit');
        // } );
        var $wrappers = $row.find( '.table-cell-wrapper' );

        $row.show();
        $wrappers.css({
          "height": "1.9rem",
          "opacity": "1"
        })

        changeProductShot( {
          "target": $row.find( '#color-select-button' ).get( 0 )
        } );
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

        changeProductShot( {
          "target": $row.prev().find( '#color-select-button' ).get( 0 )
        } );

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
  } else if ( isCollectionPage ) {
    $products = document.getElementById( 'products' );

    $products.addEventListener( 'click', changeProductShot );
    $products.addEventListener( 'mouseover', changeProductShot );
  }

  lang.TITLE = {
    "ja": lang.BRAND_NAME.ja,
    "en": lang.BRAND_NAME.en
  };

  function translate( languageCode ) {
    var $translatables = document.querySelectorAll( '[data-translate]' );
    var current, key;
    var i = 0;
    var translatablesLength = $translatables.length;

    for ( ; i < translatablesLength; ++i ) {
      current = $translatables[i];
      key = current.getAttribute( 'data-translate' );

      if ( lang.hasOwnProperty( key ) && lang[key].hasOwnProperty( languageCode ) ) {
        if ( current.hasAttribute( 'data-translate-target' ) ) {
          var translateTargets = current.getAttribute( 'data-translate-target' ).replace( ' ', '' ).split( ',' );
          var currentTranslateTarget;
          var j = 0;
          var translateTargetsLength = translateTargets.length

          for ( ; j < translateTargetsLength; ++j ) {
            currentTranslateTarget = translateTargets[j];

            if ( current.hasAttribute( currentTranslateTarget ) ) {
              current.setAttribute( currentTranslateTarget, lang[key][languageCode] );
            } else if ( currentTranslateTarget === 'textContent' ) {
              current.textContent = lang[key][languageCode];
            }
          }
        } else {
          current.textContent = lang[key][languageCode];
        }
      } else if ( isCollectionPage ) {
        switch ( key ) {
          case '_PRODUCT_NAME_':
            var k = 0;
            var node = current;
            var productsLength = NoSpoonApparel.products.length;
            var currentProduct;

            while ( !node.hasAttribute( 'id' ) ) {
              node = node.parentNode;
            }

            for ( ; k < productsLength; ++k ) {
              currentProduct = NoSpoonApparel.products[k];
              if ( currentProduct.id === node.id ) {
                current.textContent = currentProduct.name[languageCode];
                break;
              }
            }
          break;
        }
      }
    }
  }

  $japaneseLink.addEventListener( 'mouseover', function ( event ) {
    // <link id="japanese-font" rel="preload" as="style" href="../style/fonts/noto-sans-japanese.css" />
    if ( !$japaneseFont ) {
      $japaneseFont = document.createElement( 'link' );
      $japaneseFont.setAttribute( 'id', 'japanese-font' );
      $japaneseFont.setAttribute( 'rel', 'preload' );
      $japaneseFont.setAttribute( 'as', 'style' );
      $japaneseFont.setAttribute( 'href', '/style/fonts/noto-sans-japanese.css' );
      document.head.appendChild( $japaneseFont );
    }
  } );

  $language.addEventListener( 'click', function ( event ) {
    event.preventDefault();

    var $clicked = event.target;
    ( $clicked.nextElementSibling || $clicked.previousElementSibling ).classList.remove( 'active' );
    $clicked.classList.add( 'active' );

    var base = document.querySelector( 'base' );
    var appendBase = false;
    if ( !base ) {
      base = document.createElement( 'base' );
      appendBase = true;
    }
    base.setAttribute( 'href', $clicked.getAttribute( 'href' ) );
    if ( appendBase ) {
      document.head.appendChild( base );
    }

    var iso = '';
    var locale = '';

    switch ( $clicked.textContent ) {
      case '🇯🇵':
        iso = 'ja';
        locale = iso + '-JP';

        if ( $japaneseFont.getAttribute( 'rel' ) !== 'stylesheet' ) {
          $japaneseFont.setAttribute( 'rel', 'stylesheet' );
        }

        translate( iso );
        hideElements( $englishText );
        showElements( $japaneseText );
      break;

      case '🇺🇸':
        iso = 'en';
        locale = iso + '-US';

        translate( iso );
        hideElements( $japaneseText );
        showElements( $englishText );
      break;
    }

    $html.setAttribute( 'lang', locale );
    $html.setAttribute( 'xml:lang', locale );

    history.replaceState( {}, '', location.href.replace( /\/(\?language=\w{2})?$/, '/?language=' + iso ) );
  } );
})();