(function($){
  $.fn.timeslot = function(options){
    var options = $.extend({}, $.fn.timeslot.defaults, options);
    
    return this.each(function(){
      var $timeline = $(this);
      var timeline = new Timeline($timeline);
      timeline.build_timeline();
    });
  };
  
  $.fn.timeslot.defaults = {
    
  };
  
  function Timeline($timeline)
  {
    this.$timeline = $timeline;
  };
  
  Timeline.prototype = {
    build_timeline: function() {
      
      for(var h=0; h < 24; h++) {
        $label_div= $('<div />')
        if( h > 0 ) {
          $label_div.html(h).addClass('label');;
        } else {
          $label_div.html('&nbsp;').addClass('label0');;
        }
        this.$timeline.append($label_div)
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
        $hour_div = $('<div />').addClass('hour');
        
        for(var q=0; q < 4; q++) {
          $quarter_div = $('<div />').addClass('quarter');
          $hour_div.append($quarter_div);
        }
        
        this.$timeline.append($hour_div);
      }
      
    },
  };
  
})(jQuery);