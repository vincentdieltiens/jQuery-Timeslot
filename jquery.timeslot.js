(function($){
  $.fn.timeslot = function(options){
    var options = $.extend({}, $.fn.timeslot.defaults, options);
    
    return this.each(function(){
      var $timeline = $(this);
      
      if( $.fn.disableTextSelect != undefined ) {
        $timeline.disableTextSelect();
      }
      
      var timeline = new Timeline($timeline, options);
      timeline.build_timeline();
      timeline.init_handlers();
    });
  };
  
  $.fn.timeslot.defaults = {
    labelClass: 'label',
    hourClass: 'hour',
    quarterClass: 'quarter',
    maxNumberSlot: 3,
    /**
     * @param from 
     * @param to
     * @param level
     * @param event
     */
    onSelectSlot: function(from, to, level, event) {},
    /**
     * @param from
     * @param to
     * @param level
     * @param event
     */
    onChangeSlot: function(from, to, level, event) {}
  };
  
  function Timeline($timeline, options)
  {
    this.$timeline = $timeline;
    this.options = options;
    
    this.slot_began = false;
    this.$start_quarter = null;
    this.start_quarter_n = -1;
    this.$stop_quarter = null;
    this.stop_quarter_n = -1;
    this.current_level = 1;
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
          $quarter_div = $('<div />')
            .addClass(this.options.quarterClass)
            .html($('<div />'))
            .attr('rel', 1+h*4+q);
          
          $hour_div.append($quarter_div);
        }
        
        this.$timeline.append($hour_div);
      }
      
    },
    
    /**
     * Initialiaze the handlers
     */
    init_handlers: function() {
      var self = this;
      
      this.$timeline.find('.'+this.options.quarterClass).mousedown(function(){
        
        if( self.current_level > self.options.maxNumberSlot ) {
          return false;
        }
        
        var $quarter = $(this);
        
        if( self.slot_began == true ) {
          throw "Not supposed to append !";
        }
        
        self.slot_began = true;
        self.$start_quarter = $quarter;
        self.start_quarter_n = parseInt($quarter.attr('rel'));
        self.$stop_quarter = $quarter;
        self.stop_quarter_n = parseInt($quarter.attr('rel'));
        self.select_from_to(self.start_quarter_n, self.start_quarter_n, self.current_level);
        
      });
      
      this.$timeline.find('.'+this.options.quarterClass).mousemove(function(){
        var $quarter = $(this);
        var quarter_n = parseInt($quarter.attr('rel'));
        
        if( self.slot_began ) {
          self.$stop_quarter = $quarter;
          self.stop_quarter_n = quarter_n;
          self.select_from_to(self.start_quarter_n, quarter_n, self.current_level);
        }
      });
      
      $(document).mouseup(function(e){
        
        if( self.slot_began == false ) {
          return;
        }
        
        if( !$(this).hasClass(self.options.quarterClass) )
          self.set_slot(self.start_quarter_n, self.stop_quarter_n);
        else {
          var $quarter = $(this);
          var quarter_n = parseInt($quarter.attr('rel'));
          self.set_slot(self.start_quarter_n, quarter_n);
        }
      });
    },
    
    set_slot: function(start_quarter_n, stop_quarter_n) {
      var self = this;
      
      if( start_quarter_n > stop_quarter_n ) {
        var tmp = start_quarter_n;
        var start_quarter_n = stop_quarter_n;
        var stop_quarter_n = tmp;
        delete tmp;
      }
      
      var $start_quarter = self.get_quarter(start_quarter_n);
      var $stop_quarter = self.get_quarter(stop_quarter_n);
      
      var from = self.index_to_hour(start_quarter_n);
      from['index'] = start_quarter_n;
      var to = self.index_to_hour(stop_quarter_n+1);
      to['index'] = stop_quarter_n;
      var level = self.current_level;
      
      if( typeof(self.options.onSelectSlot) == 'function' ) {
        self.options.onSelectSlot.call(this, from, to, level);
      }
      
      self.add_indicator(start_quarter_n, level);
      self.add_indicator(stop_quarter_n+1, level);
      
      self.slot_began = false;
      self.$start_quarter = null;
      self.start_quarter_n = -1;
      self.$stop_quarter_n = null;
      self.stop_quarter_n = -1;
      self.current_level += 1;
      
      return self.current_level-1;
    },
    
    index_to_hour: function(index) {
      
      var minutes = Math.floor((index % 4)-1);
      var hours = Math.floor((index - minutes)/4);
      if( minutes > 0 ) {
        minutes = 15 * minutes;
      } else if( minutes < 0 ) {
        hours -= 1;
        minutes = 60 + (15*minutes);
      }
      return {'hour':hours, 'minute': minutes};
    },
    
    /**
     *
     */
    add_indicator: function(quarter_n, level) {
      var $indicator = $('<img />')
        .attr('src', 'images/indicator_level'+level+'.gif')
        .addClass('indicator'+level);
      
      this.$timeline.append($indicator);
      var $quarter = this.get_quarter(quarter_n);
      var left = $quarter.position().left - $indicator.width()/2;
      var top = this.$timeline.height();
      $indicator.css({
          'position': 'absolute',
          'left': left+'px',
          'top': top+'px'
        });
      
    },
    
    get_quarter: function(index)
    {
      return this.$timeline.find('[rel='+index+']');
    },
    
    /**
     * Select the quarters with the rel attribute between "from" and "to" arguments
     * the level of selection is given by the third argument.
     * If a selection is already made with this level, it will be automatically removed
     * "from" argument can be greater that "to" argument (selection is reversed).
     *
     * @param from : the index of the first quarter to select
     * @param to : the index of the last quarter to select
     * @param level : the level of selection
     */
    select_from_to: function(from, to, level) {
      var self = this;

      if( typeof(from) != 'number' ) {
        throw "Type of 'from' argument is "+typeof(from)+". number espected";
      }
      
      if( typeof(to) != 'number' ) {
        throw "Type of 'to' argument is "+typeof(from)+". number espected";
      }
      
      // Ensures that from index is smaller that to index.
      if( from > to ) {
        var tmp = from;
        from = to;
        to = tmp;
        delete tmp;
      }

      // Removes unselect quarter of this level
      self.unselect(level);
      
      var level_class = 'level'+level;
      for(var i=from; i <= to; i++) {
        var div = $('<div />').addClass(level_class);
        self.get_quarter(i).append(div);
      }
    },
    
    /**
     * Unselect quarter selected with the given level
     * 
     * @param level the level to consider
     */
    unselect: function(level) {
      var level_class = 'level'+level;
      this.$timeline.find('.'+level_class).remove();
      this.$timeline.find('.indicator'+level).remove();
    }
  };
  
})(jQuery);