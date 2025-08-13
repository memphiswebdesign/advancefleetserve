(function($) {
  "use strict";

  // mobile menu
  $("#mobile-menu").meanmenu({
    meanMenuContainer: ".mobile-menu",
    meanScreenWidth: "991"
  });


  // sticky nav
  // var wind = $(window);
  // var stickyNav = $('#sticky-header');
  // var pageMain = $('#afs-site');
  // wind.on('scroll', function () {
  //   var scroll = wind.scrollTop();
  //   if (scroll < 180) {
  //     stickyNav.removeClass('sticky');
  //     pageMain.removeClass('scrollOffset');
  //   } else {
  //     stickyNav.addClass('sticky');
  //     pageMain.addClass('scrollOffset');
  //   }
  // });

  // sticky nav with dynamic offset based on logo area
  // var wind = $(window);
  // var stickyNav = $('#sticky-header');
  // var pageMain = $('#afs-site');

  // wind.on('scroll', function () {
  //   var scroll = wind.scrollTop();

  //   if (scroll < 40) {
  //     stickyNav.removeClass('sticky');
  //     pageMain.removeClass('scrollOffset').css('margin-top', '');
  //   } else {
  //     var logoAreaHeight = $('#sticky-header .logo-area').outerHeight();
  //     stickyNav.addClass('sticky');
  //     pageMain.addClass('scrollOffset').css('margin-top', logoAreaHeight + 'px');
  //   }
  // });

  // Nav / Main content offset
  document.addEventListener("DOMContentLoaded", function () {
    const stickyHeader = document.querySelector("#sticky-header");
    const mainContent = document.querySelector("main#afs-site");

    if (stickyHeader && mainContent) {
      const headerHeight = stickyHeader.offsetHeight;
      mainContent.style.marginTop = `${headerHeight}px`;
    }
  });

  // Video Lightbox
  (function () {
    const overlay  = document.getElementById('videoLightbox');
    const host     = document.getElementById('videoHost');
    const closeBtn = overlay.querySelector('.video-close');
    let lastTrigger = null;

    function makeSrc({ wistiaId, ytId, vimeoId, start=0, muted=false }) {
      if (wistiaId) {
        const params = new URLSearchParams({
          autoplay: '1',
          muted: muted ? '1' : '0',
          controlsVisibleOnLoad: 'true',
          playbar: 'true',
          volumeControl: 'true',
          smallPlayButton: 'true',
        });
        if (start > 0) params.set('start', String(start));
        return `https://fast.wistia.net/embed/iframe/${encodeURIComponent(wistiaId)}?${params.toString()}`;
      }
      if (ytId) {
        const params = new URLSearchParams({
          autoplay: '1',
          rel: '0',
          modestbranding: '1',
          playsinline: '1'
        });
        if (muted) params.set('mute', '1');
        if (start > 0) params.set('start', String(start));
        return `https://www.youtube.com/embed/${encodeURIComponent(ytId)}?${params.toString()}`;
      }
      if (vimeoId) {
        const params = new URLSearchParams({
          autoplay: '1',
          title: '0',
          byline: '0',
          portrait: '0'
        });
        if (muted) params.set('muted', '1');
        if (start > 0) params.set('#t', `${start}s`); // Vimeo start via fragment
        return `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?${params.toString()}`;
      }
      return '';
    }

    function openLightboxFromTrigger(triggerEl) {
      if (!triggerEl) return;
      lastTrigger = triggerEl;

      const wistiaId = triggerEl.getAttribute('data-wistia-id');
      const ytId     = triggerEl.getAttribute('data-youtube-id') || triggerEl.getAttribute('data-yt-id');
      const vimeoId  = triggerEl.getAttribute('data-vimeo-id');
      const start    = parseInt(triggerEl.getAttribute('data-start') || '0', 10);
      const muted    = (triggerEl.getAttribute('data-muted') || '').toLowerCase() === 'true';

      const src = makeSrc({ wistiaId, ytId, vimeoId, start, muted });
      if (!src) return;

      host.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      host.appendChild(iframe);

      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      host.innerHTML = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
    }

    // Delegated click for triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-wistia-id], [data-youtube-id], [data-yt-id], [data-vimeo-id]');
      if (!trigger) return;
      e.preventDefault();
      openLightboxFromTrigger(trigger);
    });

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
    });

  })();

  // offcanvas menu
  $(".menu-tigger").on("click", function() {
    $(".offcanvas-menu,.offcanvas-overly").addClass("active");
    return false;
  });
  $(".menu-close,.offcanvas-overly").on("click", function() {
    $(".offcanvas-menu,.offcanvas-overly").removeClass("active");
  });

  //   Slider activation

  function mainSlider() {
    var BasicSlider = $(".slider-active");
    BasicSlider.on("init", function(e, slick) {
      var $firstAnimatingElements = $(".single-slider:first-child").find(
        "[data-animation]"
      );
      doAnimations($firstAnimatingElements);
    });
    BasicSlider.on("beforeChange", function(e, slick, currentSlide, nextSlide) {
      var $animatingElements = $(
        '.single-slider[data-slick-index="' + nextSlide + '"]'
      ).find("[data-animation]");
      doAnimations($animatingElements);
    });
    BasicSlider.slick({
      autoplay: false,
      autoplaySpeed: 10000,
      swipe: false,
      fade: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="icofont-long-arrow-left"></i>Prev</button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="icofont-long-arrow-right"></i>Next</button>',
      arrows: false,
      dots: false,
      responsive: [
        { breakpoint: 767, settings: { dots: false, arrows: false } }
      ]
    });

    function doAnimations(elements) {
      var animationEndEvents =
        "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
      elements.each(function() {
        var $this = $(this);
        var $animationDelay = $this.data("delay");
        var $animationType = "animated " + $this.data("animation");
        $this.css({
          "animation-delay": $animationDelay,
          "-webkit-animation-delay": $animationDelay
        });
        $this.addClass($animationType).one(animationEndEvents, function() {
          $this.removeClass($animationType);
        });
      });
    }
  }
  mainSlider();

  // slider-three
  $(".slider-three-active").slick({
    infinite: true,
    autoplay: false,
    autoplaySpeed: 5000,
    speed: 400,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow:
      '<button type="button" class="slick-prev"><span class="lnr lnr-chevron-left"></span></button>',
    nextArrow:
      '<button type="button" class="slick-next"><span class="lnr lnr-chevron-right"></span></button>',
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false
        }
      }
    ]
  });

  // isotope
  $(".portfolio-active").imagesLoaded(function() {
    var $grid = $(".portfolio-active").isotope({
      itemSelector: ".grid-item",
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: 1
      }
    });

    // filter items on button click
    $(".portfolio-menu").on("click", "button", function () {
        var filterValue = $(this).attr("data-filter");
        $grid.isotope({ filter: filterValue });
    });
  });

  //for menu active class
  $(".portfolio-menu button").on("click", function(event) {
    $(this)
      .siblings(".active")
      .removeClass("active");
    $(this).addClass("active");
    event.preventDefault();
  });

  // counterUp

  $(".counter").counterUp({
    delay: 10,
    time: 1000
  });

  // testimonial

  $(".testimonial-active").owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  });

  // portfolio
  $(".portfolio-active").isotope({
    itemSelector: ".grid-item",
    percentPosition: true,
    masonry: {
      // use outer width of grid-sizer for columnWidth
      columnWidth: 1
    }
  });

  // popup
  $(".view").magnificPopup({
    type: "image",
    gallery: {
      enabled: true
    }
  });

  $(".video-view").magnificPopup({
    type: "iframe"
  });

  // clients

  $(".clients-active").owlCarousel({
    loop: true,
    nav: false,
    autoplay: true,
    responsive: {
      0: {
        items: 2
      },
      320: {
        items: 2
      },
      480: {
        items: 3
      },
      767: {
        items: 5
      },
      991: {
        items: 6
      },
      1000: {
        items: 6
      }
    }
  });

  $.scrollUp({
    scrollName: "scrollUp", // Element ID
    topDistance: "300", // Distance from top before showing element (px)
    topSpeed: 300, // Speed back to top (ms)
    animation: "fade", // Fade, slide, none
    animationInSpeed: 1000, // Animation in speed (ms)
    animationOutSpeed: 1000, // Animation out speed (ms)
    scrollText: '<span class="lnr lnr-chevron-up"></span>' // Text for element
  });
  
  if($("#search-input").length >0){
    
    var sjs = SimpleJekyllSearch({
      searchInput: document.getElementById('search-input'),
      resultsContainer: document.getElementById('results-container'),
      json: '/search.json'
    });
  }



})(jQuery);
