;(function ( $, window, document, undefined ) {

  var defaults = {
    transition: 'fade'
    , thumb_list_id: '#thumbs'
    , prev: '#prev'
    , next: '#next'
    , fade_opacity: .2
    , infinite: false
    , automatic: false
    , interval: 6000
    , width: false
    , onBeforeSlide: null
    , onAfterSlide: null
  };

	/*
	 * Constructor
	 */

  function vulsaiSlider(element, options){
    this.options = $.extend({}, defaults, options);
    this.el = $(element);
    this.slides = this.el.children('li').length;
    this.full_width = (this.options.width==false) ? this.el.parent().width() : this.options.width;
    this.current_slide = 0;
    this.init();
  };

	/*
	 * Initialize the plugin with setting optimization
	 */

  vulsaiSlider.prototype.init = function(){
    this.activeThumb();
    this.preventArrows();
    this.startTransitions();
    var self = this;
    if(self.options.automatic == true)
      self.interval_id = setTimeout(function(){ self.interval_func(); setTimeout(arguments.callee ,self.options.interval); },self.options.interval);
 };

	/*
	 * Move to next element. Used for automatic sliders
	 */

  vulsaiSlider.prototype.interval_func = function(){
			var self = this;
      if(self.current_slide == self.slides - 1 && self.options.infinite == false)
        return false

      if(self.current_slide == self.slides - 1)
        self.current_slide = 0;
      else
        self.current_slide = self.current_slide + 1;

      self.activeThumb();
      self.preventArrows();
      self.transition();
  };

	/*
	 * Set the current thumb
	 */

  vulsaiSlider.prototype.activeThumb = function() {
  	  var self = this;
	    $(self.options.thumb_list_id).find('li').eq(self.current_slide).addClass('currentNumber').siblings().removeClass('currentNumber');
  };

	/*
	 * Enable/Disable arrows on infinite: false
	 */

  vulsaiSlider.prototype.preventArrows = function(){
    var nav_opacity = this.options.nav_opacity;
    if(!this.options.infinite && this.current_slide == 0){
      $(this.options.prev).attr('disabled', 'disabled');
    }
    if(!this.options.infinite && this.current_slide != 0){
      $(this.options.prev).removeAttr('disabled');
    }
    if(!this.options.infinite && this.current_slide == this.slides - 1){
      $(this.options.next).attr('disabled', 'disabled');
    }
    if(!this.options.infinite && this.current_slide != this.slides - 1){
      $(this.options.next).removeAttr('disabled');
    }

    if(this.slides < 2){
      $(this.options.next).hide();
      $(this.options.prev).hide();
    }
  };

	/*
	 * Initialize slider transitions
	 */

  vulsaiSlider.prototype.startTransitions = function(){
    var self = this;
    $(this.options.thumb_list_id).find('li').click(function(e){
      e.preventDefault();

      if(self.options.automatic == true && self.interval_id){
        clearInterval(self.interval_id);
        self.interval_id = setTimeout(function(){ $(self.options.next).click(); setTimeout(arguments.callee, self.options.interval); },self.options.interval);
      }

      self.current_slide = $(this).index();
      self.activeThumb();
      self.preventArrows();
      self.transition();
    });

    this.transitions();
  };

	/*
	 * Set the transition type and initialize it
	 */

  vulsaiSlider.prototype.transitions = function(){
    var self = this;

    this.transition = this.options.transition == 'fade' ? this.fade : this.slide;
    if(this.options.transition == 'fade'){
			this.el.parent().addClass('fade');
      this.el.children('li').css({'display': 'none'}).eq(0).css('display','block').addClass('active');
		} else if(this.options.transition == 'slide'){
			this.el.parent().addClass('slide');
		}

    if (typeof this.options.onAfterSlide === 'function') {
      this.options.onAfterSlide.call(this.el);
    }

    $(this.options.prev).click(function(e){
      if(self.current_slide == 0 && self.options.infinite == false)
        return false

      e.preventDefault();
      if(self.current_slide == 0)
        self.current_slide = self.slides - 1;
      else
        self.current_slide = self.current_slide - 1;

      if(self.options.automatic == true && self.interval_id){
        clearInterval(self.interval_id);
        self.interval_id = setTimeout(function(){
          $(self.options.next).click();
          setTimeout(arguments.callee, self.options.interval);
        },self.options.interval);
      }

      self.activeThumb();
      self.preventArrows();
      self.transition();
    });

     $(self.options.next).click(function(e){
      e.preventDefault();

      if(self.current_slide == self.slides - 1 && self.options.infinite == false)
        return false


      if(self.current_slide == self.slides - 1)
        self.current_slide = 0;
      else
        self.current_slide = self.current_slide + 1;

      if(self.options.automatic == true && self.interval_id){
        clearInterval(self.interval_id);
        self.interval_id = setTimeout(function(){
          $(self.options.next).click();
          setTimeout(arguments.callee, self.options.interval);
        },self.options.interval);
      }

      self.activeThumb();
      self.preventArrows();
      self.transition();

   });
 };

	/*
	 * Slide transition
	 */

  vulsaiSlider.prototype.slide = function(){
    var self = this;
    if (typeof this.options.onBeforeSlide === 'function') {
      this.options.onBeforeSlide.call(this.el);
    }
    this.el.find('li').eq(this.current_slide).addClass('active').siblings().removeClass('active');
    this.el.clearQueue().animate({left: '-' + self.current_slide * self.full_width}, 800, function () {
      if (typeof self.options.onAfterSlide === 'function') {
        self.options.onAfterSlide.call(self.el);
      }
    });
  };

	/*
	 * Fade transition
	 */

  vulsaiSlider.prototype.fade = function(){
    var self = this;
    if (typeof this.options.onBeforeSlide === 'function') {
      this.options.onBeforeSlide.call(this.el);
    }
    this.el.clearQueue().animate({'opacity': self.options.fade_opacity}, 400,
      function(){
        $(this).children('li').eq(self.current_slide).css('display','block').addClass('active').siblings().css('display','none').removeClass('active');
        self.el.clearQueue().animate({'opacity':1},400,function () {
          if (typeof self.options.onAfterSlide === 'function') {
            self.options.onAfterSlide.call(self.el);
          }
        });
      }
    );
  };

	/*
	 * Add the plugin to jQuery.fn
	 */

  $.fn.vulsaiSlider = function ( options ) {
    return this.each(function () {
      if(!$.data(this, 'plugin_vulsaiSlider')) {
        $.data(this, 'plugin_vulsaiSlider', new vulsaiSlider(this, options));
      }
    });
  };

})(jQuery, window, document);
