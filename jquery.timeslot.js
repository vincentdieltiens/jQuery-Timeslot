(function($){
  $.fn.timeslot = function(options){
    var options = $.extend({}, $.fn.timeslot.defaults, options);
    
    return this.each(function(){
      alert('lol');
    });
  }
  
  $.fn.timeslot.defaults = {
    
  };
})(jQuery);