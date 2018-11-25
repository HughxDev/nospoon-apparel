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

  var $language = document.getElementById( 'language' );
  var $englishText = document.querySelectorAll( '[lang="en"]:not(html):not([data-translate-preserve])' );
  var $japaneseText = document.querySelectorAll( '[lang="ja"]:not(html):not([data-translate-preserve])' );
  var $japaneseFont = document.getElementById( 'japanese-font' );
  var $japaneseLink = document.getElementById( 'japanese' );

  var lang = NoSpoonApparel.lang;
  var defaultPrice = NoSpoonApparel.product.variants[0].price.USD.amount;

  lang._PRODUCT_NAME_ = NoSpoonApparel.product.name;
  lang._PRODUCT_TAGLINE_ = NoSpoonApparel.product.tagline;
  lang._PRODUCT_PRICE_ = {};

  for ( var priceFormat in lang._PRICE_USD_ ) {
    lang._PRODUCT_PRICE_[priceFormat] = lang._PRICE_USD_[priceFormat].replace( 'X', defaultPrice )
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