$(document).ready(function(){
  $(document).on('click', '.revovery-phrase-click', function(e) {
    e.preventDefault();

    if(!$(this).parents('.revovery-phrase-box').hasClass('show-text')) {
      $(this).parents('.revovery-phrase-box').addClass('show-text')
    } else {
      $(this).parents('.revovery-phrase-box').removeClass('show-text')
    }
  });

  $(".mob-menu").click(function(){
    $(".mob-sidebar").toggleClass("show-mobmenu");
  });
});
