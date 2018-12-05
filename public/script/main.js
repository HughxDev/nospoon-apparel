(function () {
  'use strict';
  // https://stackoverflow.com/a/46261084/214325
  function getBostonTime() {
    // create Date object for current location
    var date = new Date();

    // convert to milliseconds, add local time zone offset and get UTC time in milliseconds
    var utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);

    // time offset for Boston is +9
    var timeOffset = 9;

    // create new Date object for a different timezone using supplied its GMT offset.
    return new Date(utcTime + (3600000 * timeOffset));
  }

  function isLastDay( dt ) {
    return new Date( dt.getTime() + 86400000 ).getDate() === 1;
  }

  function isNewYears() {
    return ( $month.textContent === '12' ) && ( $day.textContent === '31' );
  }

  function displayBostonTime() {
    var BostonTime = getBostonTime();
    var isCurrentlyLastDay = isLastDay( BostonTime );
    var hours = BostonTime.getHours();
    var minutes = BostonTime.getMinutes();
    var seconds = BostonTime.getSeconds();

    if ( !$year.textContent.length || isNewYears() ) {
      $year.textContent = BostonTime.getFullYear();
    }

    if ( !$month.textContent.length || isCurrentlyLastDay ) {
      $month.textContent = BostonTime.getMonth();
    }

    if ( !$day.textContent.length || ( hours >= 23 ) || ( hours <= 1 ) ) {
      $day.textContent = BostonTime.getDate();
    }

    if ( !$hour.textContent.length || ( seconds >= 59 ) || ( seconds <= 1 ) ) {
      if ( hours >= 12 ) {
        $hour.textContent = hours - 12;
        $am.hidden = true;
        $pm.hidden = false;
      } else {
        $am.hidden = false;
        $pm.hidden = true;
      }

      if ( hours === 0 ) {
        $hour.textContent = '12';
      }
    }

    $minutes.textContent = ( minutes >= 10 ) ? minutes : '0' + minutes;
    $seconds.textContent = ( seconds >= 10 ) ? seconds : '0' + seconds;
    $datetime.setAttribute( 'datetime', BostonTime.toISOString() );
  }

  function playMusic() {
    $someday.play();
  }

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

  function isPlaying( media ) {
    return !!( media.currentTime > 0 && !media.paused && !media.ended && media.readyState > 2 );
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

  // displayBostonTime();

  setTimeout( function () {
    // $currentTime.style.opacity = 1;
  }, 1000 );

  // setInterval( displayBostonTime, 1000 );

  function startMusic() {
    if ( !isPlaying( $someday ) ) {
      playMusic();
    }

    window.removeEventListener( 'scroll', startMusic );
    document.removeEventListener( 'click', startMusic );
  }

  // window.addEventListener( 'scroll', startMusic );
  // document.addEventListener( 'click', startMusic );

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

  function populateCart( cart ) {
    var i = 0, j = 0;
    var cartLength = cart.length;
    var current;
    var $tr;
    var $td;
    var order = [ 'id', 'size', 'colorway', 'quantity', 'actions' ];
    var $img;
    var orderLength = order.length;
    // var map = [];
    // var mapItem = {};
    var $remove;
    var $removeIcon;

    for ( ; i < cartLength; ++i ) {
      current = cart[i];
      console.log( current );

      $tr = document.createElement( 'tr' );

      for ( ; j < orderLength; ++j ) {
        $td = document.createElement( 'td' );

        if ( order[j] === 'id' ) {
          $img = document.createElement( 'img' );
          $img.src = '/collection/' + current[order[j]] + '/product--' + current.colorway.id + '.png';
          $img.width = 128;
          $img.height = 128;
          $td.appendChild( $img );
        } else if ( order[j] === 'size' ) {
          $td.textContent = current.size.id
        } else if ( order[j] === 'colorway' ) {
          $td.textContent = current.colorway.name;
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
          $td.appendChild( $remove )
        } else {
          $td.textContent = current[order[j]];
        }

        $tr.appendChild( $td );
      }
      j = 0;

      $cartContents.children[1].appendChild( $tr );
    }

    $cartContents.hidden = false;
    $cartEmpty.hidden = true;
  }

  var $language = document.getElementById( 'language' );
  var $englishText = document.querySelectorAll( '[lang="en"]:not(html):not([data-translate-preserve])' );
  var $japaneseText = document.querySelectorAll( '[lang="ja"]:not(html):not([data-translate-preserve])' );
  var $japaneseFont = document.getElementById( 'japanese-font' );
  var $japaneseLink = document.getElementById( 'japanese' );
  var $main = document.querySelector( 'main' );
  var isProductPage = $main.classList.contains( 'view--product' );
  var isCollectionPage = $main.classList.contains( 'view--collection' );
  var $addToCartCta, $yourOrder, $products;

  var lang = NoSpoonApparel.lang;
  var defaultPrice;

  var $addToCartForm;
  var rowSlideSpeed = 250;

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

    $addToCartCta.addEventListener( 'click', function ( event ) {
      var formElements = $addToCartForm.get( 0 ).elements;
      var formElementsLength = formElements.length;
      var i = 0, j = 0;
      var current;
      var cart = [];
      var currentOrder = {};
      var colorway;
      var currentChildrenLength;

      for ( ; i < formElementsLength; ++i ) {
        current = formElements[i];

        if ( /[a-z]+\[[0-9]+\]\[size\]/.test( current.name ) ) {
          currentOrder.size = {
            "id": current.value
          };

          currentChildrenLength = current.children.length;
          for ( j = 0; j < currentChildrenLength; ++j ) {
            // console.log( 'current.children[j]', current.children[j], current.children[j].selected );
            if ( current.children[j].selected ) {
              currentOrder.size.vendorId = current.children[j].getAttribute( 'data-vendor-id' );
            }
          }
        }

        if ( /[a-z]+\[[0-9]+\]\[colorway\]/.test( current.name ) ) {
          colorway = current.value.split( '--' );
          currentOrder.id = colorway[0];
          currentOrder.colorway = {
            "id": colorway[1]
          };

          currentChildrenLength = current.children.length;
          for ( j = 0; j < currentChildrenLength; ++j ) {
            // console.log( 'current.children[j]', current.children[j], current.children[j].selected );
            if ( current.children[j].selected ) {
              currentOrder.colorway.vendorId = current.children[j].getAttribute( 'data-vendor-id' );
              currentOrder.colorway.name = current.children[j].textContent;
            }
          }
        }

        if ( /[a-z]+\[[0-9]+\]\[quantity\]/.test( current.name ) ) {
          currentOrder.quantity = parseInt( current.value, 10 );
          cart.push( currentOrder );
          currentOrder = {};
        }
      }
      i = 0;

      localStorage.setItem( 'cart', JSON.stringify( cart ) );
      console.log( cart );
      populateCart( cart );
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