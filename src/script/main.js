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
  var $brand = document.getElementById( 'brand' );
  var $subBrand = document.getElementById( 'sub-brand' );
  // var $motivationNihongo = document.getElementById( 'motivation-nihongo' );
  // var $motivationEigo = document.getElementById( 'motivation-eigo' );
  // var $currentTimeText = document.getElementById( 'current-time-text' );
  // var $yearKanji = document.getElementById( 'year-kanji' );
  // var $monthKanji = document.getElementById( 'month-kanji' );
  // var $dayKanji = document.getElementById( 'day-kanji' );
  // var $hourKanji = document.getElementById( 'hour-kanji' );
  // var $minuteKanji = document.getElementById( 'minute-kanji' );
  // var $secondsKanji = document.getElementById( 'seconds-kanji' );
  // var $amNihongo = document.getElementById( 'am-nihongo' );
  // var $pmNihongo = document.getElementById( 'pm-nihongo' );
  // var $amEigo = document.getElementById( 'am-eigo' );
  // var $pmEigo = document.getElementById( 'pm-eigo' );
  // var $middleDot = document.getElementById( 'middle-dot' );
  var $title = document.querySelector( 'title' );
  // var $tagline = document.getElementById( 'tagline' );
  // var $sideHustle = document.getElementById( 'side-hustle' );
  var $cartEmpty = document.getElementById( 'cart-empty' );
  var $checkout = document.getElementById( 'checkout' );
  var $aboutLink = document.getElementById( 'about-link' );
  var $collectionLink = document.getElementById( 'collection-link' );
  var $englishText = document.querySelectorAll( 'p[lang="en"]' );
  var $japaneseText = document.querySelectorAll( 'p[lang="ja"]' );
  var $japaneseFont = document.getElementById( 'japanese-font' );

  var lang = {
    "BRAND_NAME": {
      "ja": "ノ・スプーン・アパレル",
      "en": "No Spoon Apparel"
    },
    "BRAND": {
      "ja": "ノ・スプーン",
      "en": "No Spoon"
    },
    "SUB_BRAND": {
      "ja": "アパレル",
      "en": "Apparel"
    },
    // "CURRENT_TIME": {
    //   "ja": "ボストンでの現在時刻：",
    //   "en": "Current time in Boston:"
    // },
    // "YEAR_KANJI": {
    //   "ja": "年",
    //   "en": "-"
    // },
    // "MONTH_KANJI": {
    //   "ja": "月",
    //   "en": "-"
    // },
    // "DAY_KANJI": {
    //   "ja": "日",
    //   "en": ""
    // },
    // "HOUR_KANJI": {
    //   "ja": "時",
    //   "en": ":"
    // },
    // "MINUTE_KANJI": {
    //   "ja": "分",
    //   "en": ":"
    // },
    // "SECONDS_KANJI": {
    //   "ja": "秒",
    //   "en": ""
    // },
    // "MIDDLE_DOT": {
    //   "ja": "・",
    //   "en": " · "
    // },
    "TOGGLE_MENU": {
      "ja": "メニューをトグルして",
      "en": "Toggle menu"
    },
    // "TAGLINE": {
    //   "ja": "マトリックスを脱出して。インディーズのクリエイティブな人のためのストリートウェア。",
    //   "en": "Escape the Matrix. Streetwear for the indie creative."
    // },
    // "SIDE_HUSTLE": {
    //   "ja": "ヒュー・ガイニーによるサイド・ハッスル。",
    //   "en": "A side-hustle by Hugh Guiney."
    // },
    "CART_EMPTY": {
      "ja": "あなたのカートは空です。",
      "en": "Your cart is empty."
    },
    "CHECKOUT": {
      "ja": "チェックアウトして",
      "en": "Checkout"
    },
    "ABOUT": {
      "ja": "ついて",
      "en": "About"
    },
    "COLLECTION": {
      "ja": "コレクション",
      "en": "Collection"
    }
  };

  lang.TITLE = {
    "ja": lang.BRAND_NAME.ja,
    "en": lang.BRAND_NAME.en
  };

  $language.addEventListener( 'click', function ( event ) {
    event.preventDefault();

    var $clicked = event.target;
    ( $clicked.nextElementSibling || $clicked.previousElementSibling ).classList.remove( 'active' );
    $clicked.classList.add( 'active' );

    switch ( $clicked.textContent ) {
      case '🇯🇵':
        if ( !$japaneseFont ) {
          $japaneseFont = document.createElement( 'link' );
          $japaneseFont.setAttribute( 'id', 'japanese-font' );
          $japaneseFont.setAttribute( 'rel', 'stylesheet' );
          $japaneseFont.setAttribute( 'href', 'style/fonts/noto-sans-japanese.css' );
          document.head.appendChild( $japaneseFont );
        } else {
          $japaneseFont.setAttribute( 'rel', 'stylesheet' );
        }
        $html.setAttribute( 'lang', 'ja' );
        $html.setAttribute( 'xml:lang', 'ja' );
        $brand.textContent = lang.BRAND.ja;
        $subBrand.textContent = lang.SUB_BRAND.ja;
        // $currentTimeText.textContent = lang.CURRENT_TIME.ja;
        // $yearKanji.textContent = lang.YEAR_KANJI.ja;
        // $monthKanji.textContent = lang.MONTH_KANJI.ja;
        // $dayKanji.textContent = lang.DAY_KANJI.ja;
        // $hourKanji.textContent = lang.HOUR_KANJI.ja;
        // $minuteKanji.textContent = lang.MINUTE_KANJI.ja;
        // $secondsKanji.textContent = lang.SECONDS_KANJI.ja;
        // $middleDot.textContent = lang.MIDDLE_DOT.ja;
        $title.textContent = lang.TITLE.ja;
        // $motivationEigo.hidden = true;
        // $motivationNihongo.hidden = false;
        // $amEigo.hidden = true;
        // $amNihongo.hidden = false;
        // $pmEigo.hidden = true;
        // $pmNihongo.hidden = false;
        // $tagline.textContent = lang.TAGLINE.ja;
        // $sideHustle.textContent = lang.SIDE_HUSTLE.ja;
        $cartEmpty.textContent = lang.CART_EMPTY.ja;
        $checkout.textContent = lang.CHECKOUT.ja;
        $aboutLink.textContent = lang.ABOUT.ja;
        $collectionLink.textContent = lang.COLLECTION.ja;
        hideElements( $englishText );
        showElements( $japaneseText );
      break;

      case '🇺🇸':
        $html.setAttribute( 'lang', 'en' );
        $html.setAttribute( 'xml:lang', 'en' );
        $brand.textContent = lang.BRAND.en;
        $subBrand.textContent = lang.SUB_BRAND.en;
        // $currentTimeText.textContent = lang.CURRENT_TIME.en;
        // $yearKanji.textContent = lang.YEAR_KANJI.en;
        // $monthKanji.textContent = lang.MONTH_KANJI.en;
        // $dayKanji.textContent = lang.DAY_KANJI.en;
        // $hourKanji.textContent = lang.HOUR_KANJI.en;
        // $minuteKanji.textContent = lang.MINUTE_KANJI.en;
        // $secondsKanji.textContent = lang.SECONDS_KANJI.en;
        // $middleDot.textContent = lang.MIDDLE_DOT.en;
        $title.textContent = lang.TITLE.en;
        // $motivationEigo.hidden = false;
        // $motivationNihongo.hidden = true;
        // $amEigo.hidden = false;
        // $amNihongo.hidden = true;
        // $pmEigo.hidden = false;
        // $pmNihongo.hidden = true;
        // $tagline.textContent = lang.TAGLINE.en;
        // $sideHustle.textContent = lang.SIDE_HUSTLE.en;
        $cartEmpty.textContent = lang.CART_EMPTY.en;
        $checkout.textContent = lang.CHECKOUT.en;
        $aboutLink.textContent = lang.ABOUT.en;
        $collectionLink.textContent = lang.COLLECTION.en;
        hideElements( $japaneseText );
        showElements( $englishText );
      break;
    }
  } );
})();