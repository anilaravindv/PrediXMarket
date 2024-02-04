$(document).ready(function(){
  var options = {
    offset: '#showHere',
    offsetSide: 'top',
    classes: {
      clone: 'header--clone',
      stick: 'header--stick',
      unstick: 'header--unstick'
    }
  };

  // Initialise with options
  var header = new Headhesive('header', options);

  // Headhesive destroy
  // header.destroy();


  (function($) {
    /** change value here to adjust parallax level */
    var parallax = 0.5;

    var $bg_images = $(".wp-block-cover-image");
    var offset_tops = [];
    $bg_images.each(function(i, el) {
      offset_tops.push($(el).offset().top);
    });

    $(window).scroll(function() {
      var dy = $(this).scrollTop();
      $bg_images.each(function(i, el) {
        var ot = offset_tops[i];
        $(el).css("background-position", "50% " + (dy - ot) * parallax + "px");
      });
    });
  })(jQuery);
  });
