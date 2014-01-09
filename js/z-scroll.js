(function($){

  // because we're using classes to do our transitioning, we
  // don't want to make too many modifications at once or else
  // the transitions will conflict and things will break. Using
  // a flag, we can prevent transitioning when one is in progress.
  var inTransition = false;

  $.fn.zscroll = function(){
    // make sure that each one of the children has a class we can use
    this.children().addClass('panel');

    // make the first child the visible one
    $(this.children()[0]).addClass('visible');

    // attach our scroll method to the window so that any
    // scrolling will run our method. 
    $(window).on('mousewheel', function(e){
      // turn scroll into 1 for up and 0 for down
      var direction = (e.originalEvent.wheelDelta > 0) ? 1 : 0;
      doScroll(direction);
    });

    // ...BUT make sure that on subPanels, we do not zscroll
    // so that the sub panels can have overflow that can be
    // scrolled with the mouse, without moving along z-index.
    $('.subPanel').on('mousewheel', function(e){
      e.stopPropagation();
    });

    // use a function to do the scrolling. we'll only need to pass
    // the direction from either button press, or mouse scroll
    var doScroll = function(direction){
      // only move in if we have something to move in to.
      if(direction && $('.visible').next().length){
        if(!inTransition){
          inTransition = true;
          // visible panels that are being moved behind us
          // need to have the 'behind' class applied immediately
          // which is what will cause the zoom in effect.
          $('.visible')
            .addClass('behind')
            .one('webkitTransitionEnd', function(){
              // when the zoom effect is over, we'll need to remove the
              // classes that we used to display and zoom the panel.
              $(this).removeClass('visible');
              $(this).removeClass('behind');
              // we'll also add a class that will keep our panel scaled
              // up, as if it's behind us. Without this class, a panel
              // that is coming in from behind us will only just fade in
              // and not have the effect of actually coming from behind.
              $(this).addClass('passed');
              inTransition = false;
            });
          // the panel that we want to zoom towards needs to have its class
          // modified so that it appears to zoom towards us.
          $('.visible').next('.panel').addClass('visible');
        }
      }
      
      // only move out if we have something to move out to.
      else if(!direction && $('.visible').prev().length){
        if(!inTransition){
          inTransition = true;
          // for visible panels, we need to immediately modify classes
          // to create the effect of zooming away from us.
          $('.visible')
            .removeClass('passed')
            .addClass('infront')
            .one('webkitTransitionEnd', function(){
              // when the visible panel is zoomed away, we can remove
              // the classes that made that effect possible.
              $(this).removeClass('visible');
              $(this).removeClass('infront');
              inTransition = false;
            });
          // for the panel that we want to come in rom behind, we need to 
          // modify it's classes so that it appears to come in from behind.
          $('.visible').prev('.panel')
            .addClass('visible')
            .removeClass('passed');
        }
      }
    }
  }
})(jQuery);