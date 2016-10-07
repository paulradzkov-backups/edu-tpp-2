/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/02/08
 *
 * @author Blair Mitchelmore
 * @version 1.1.2
 *
 **/
jQuery.fn.extend({
	everyTime: function(interval, label, fn, times, belay) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times, belay);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.event.special

jQuery.extend({
	timer: {
		global: [],
		guid: 1,
		dataKey: "jQuery.timer",
		regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
		powers: {
			// Yeah this is major overkill...
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times, belay) {
			var counter = 0;
			
			if (jQuery.isFunction(label)) {
				if (!times) 
					times = fn;
				fn = label;
				label = interval;
			}
			
			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
				return;

			if (times && times.constructor != Number) {
				belay = !!times;
				times = 0;
			}
			
			times = times || 0;
			belay = belay || false;
			
			var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
			
			if (!timers[label])
				timers[label] = {};
			
			fn.timerID = fn.timerID || this.guid++;
			
			var handler = function() {
				if (belay && this.inProgress) 
					return;
				this.inProgress = true;
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
				this.inProgress = false;
			};
			
			handler.timerID = fn.timerID;
			
			if (!timers[label][fn.timerID])
				timers[label][fn.timerID] = window.setInterval(handler,interval);
			
			this.global.push( element );
			
		},
		remove: function(element, label, fn) {
			var timers = jQuery.data(element, this.dataKey), ret;
			
			if ( timers ) {
				
				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.timerID ) {
							window.clearInterval(timers[label][fn.timerID]);
							delete timers[label][fn.timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}
					
					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}
				
				for ( ret in timers ) break;
				if ( !ret ) 
					jQuery.removeData(element, this.dataKey);
			}
		}
	}
});

jQuery(window).bind("unload", function() {
	jQuery.each(jQuery.timer.global, function(index, item) {
		jQuery.timer.remove(item);
	});
});

/**

based on Horinaja Slider by David Massiani http://www.davidmassiani.com/horinaja/
modified by Paul Radzkov (radzkov@gmail.com) 11.04.2011

**/

(function($) {
$.fn.fluidSlider = function(settings) {
	    options =  { 
		capture: '',
        delay:  300,
        duration: 4000,
        pagination: true
    	};  
    var options = $.extend(options, settings);  
    return this.each(function(){
		$this = $(this);
		var capture = options.capture;
        var delay = (options.delay);  
        var duration = (options.duration);  
        var pagination = options.pagination;  
		$sliderWrapper = $('#'+capture+' .slides-wrapper'); 	//cash selector
		$slide = $('#'+capture+' .slides-wrapper > .slide');		//cash selector
		var px = $slide.width();
		var nCell = $slide.length;
		var po = 0;
		var id = 0;
		function setCurrent(it){
			if(pagination){
				$('#'+capture+'  ol.fluidslider_pagination > li').removeClass("current");
				$('#'+capture+'  ol.fluidslider_pagination > li:eq('+it+')').addClass("current");
			}
		}
		function getW() {
			px = $slide.width();
		}
		function tozero() {
			getW();
			$sliderWrapper.animate({ 
				left: 0+"px"
				}, delay);
			po = 0;
			id=0;
			setCurrent(id);
		}
		function moveP(){
			getW();
			if(po!=-((px*nCell)-px)){
				$sliderWrapper.animate({ 
				left: (po-px)+"px"
				}, delay);	
				po = po-px;
				id=id+1;
				setCurrent(id);
			}else{
				$sliderWrapper.animate({ 
				left: "0px"
				}, delay);
				po = 0;	
				id=0;
				setCurrent(id);
			}	
		}
		
		$('#'+capture).css({'overflow':'hidden','position':'relative'});
		$sliderWrapper.css({'width' : 100*nCell+'%'});
		$slide.css({'width':100/nCell+'%','float':'left'});
		$(this).everyTime(duration,capture,function(){moveP();}); //двигать по таймеру
		
		jQuery(window).resize(function() {
			tozero();
		});
		
	if(pagination){
		$sliderWrapper.after('<ol class="fluidslider_pagination"></ol>');
		$flspagination = $('#'+capture+'  ol.fluidslider_pagination');
		for(i=1;i!=(nCell+1);i++){
			$flspagination.append('<li><a href="#slide'+i+'">'+i+'</a></li>');
		}
		setCurrent(0);
	}
    $(this)
        .bind('mousewheel', function(event, delta) {
            var dir = delta > 0 ? 'Up' : 'Down',
                vel = Math.abs(delta);
				if(dir=='Up'){
					if(po !=0){
						getW(); //recalculate width
						$sliderWrapper.animate({ 
						left: (po+px)+"px"
						}, delay);
						po = po+px;
						id=id-1;
						setCurrent(id);
					}
				}else{
					if(po!=-((px*nCell)-px)){
						getW(); //recalculate width
						$sliderWrapper.animate({ 
						left: (po-px)+"px"
						}, delay);	
						po = po-px;
						id=id+1;
						setCurrent(id);
					}
				}
            return false;
        });
	$(this)
	.bind('mouseenter',function(){$(this).stopTime(capture);});
	$(this)
	.bind('mouseleave',function(){$(this).everyTime(duration,capture,function(){moveP();});});
	if(pagination){
		$('#'+capture+'  ol.fluidslider_pagination > li').each(function(i) {
		  $(this).bind('click', {index:i}, function(e){
			 var occ = parseInt(e.data.index);
			 setCurrent(occ);
			getW();
			if(id>occ){
				var diff= id-occ;
				po=po+(px*diff);
				id = occ;
				$sliderWrapper.animate({ 
				left: (po)+"px"
				}, delay);	
			}else if(id<occ){
				diff= occ-id;
				po=po-(px*diff);
				id=occ;
				$sliderWrapper.animate({ 
				left: (po)+"px"
				}, delay);			
			}			
		  });
		});
	}
	});
};
})(jQuery);