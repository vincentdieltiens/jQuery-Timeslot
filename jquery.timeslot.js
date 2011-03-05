(function($){
  $.fn.timeslot = function(options){
    var options = $.extend({}, $.fn.timeslot.defaults, options);
    
    return this.each(function(){
      var $timeline = $(this);
      var timeline = new Timeline($timeline, options);
      timeline.build_timeline();
    });
  };
  
  $.fn.timeslot.defaults = {
    labelClass: 'label',
    hourClass: 'hour',
    quarterClass: 'quarter',
    maxNumberSlot: 3
  };
  
  function Timeline($timeline, options)
  {
    this.$timeline = $timeline;
    this.options = options;
  };
  
  Timeline.prototype = {
    /**
     * Build the html code of the timeline
     */
    build_timeline: function() {
      
      for(var h=0; h < 24; h++) {
        $label_div= $('<div />').addClass(this.options.labelClass)
        if( h > 0 ) {
          $label_div.html(h);
        } else {
          $label_div.html('&nbsp;');
        }
        this.$timeline.append($label_div);
      }
      
      var $hr = $('<hr />').css({
        'clear': 'left',
        'visibility': 'hidden',
        'height': 0,
        'margin': 0,
        'padding': 0
      });
      this.$timeline.append($hr);
      
      for(var h=0; h < 24; h++) {
        $hour_div = $('<div />').addClass(this.options.hourClass);
        
        for(var q=0; q < 4; q++) {
          $quarter_div = $('<div />').addClass(this.options.quarterClass).html($('<div />'));
          
          $hour_div.append($quarter_div);
        }
        
        this.$timeline.append($hour_div);
      }
      
    },
  };
  
})(jQuery);