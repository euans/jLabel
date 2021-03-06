// ####################################################################################
// #######                                                                      #######
// ####### Plugin:      jLabel                                                  #######
// ####### Author:      William Duffy                                           #######
// ####### Website:     http://www.wduffy.co.uk/jLabel                          #######
// ####### Version:     1.3                                                     #######
// #######                                                                      #######
// ####### Copyright (c) 2010, William Duffy - www.wduffy.co.uk                 #######
// #######                                                                      #######
// ####### Permission is hereby granted, free of charge, to any person          #######
// ####### obtaining a copy of this software and associated documentation       #######
// ####### files (the "Software"), to deal in the Software without              #######
// ####### restriction, including without limitation the rights to use,         #######
// ####### copy, modify, merge, publish, distribute, sublicense, and/or sell    #######
// ####### copies of the Software, and to permit persons to whom the            #######
// ####### Software is furnished to do so, subject to the following             #######
// ####### conditions:                                                          #######
// #######                                                                      #######
// ####### The above copyright notice and this permission notice shall be       #######
// ####### included in all copies or substantial portions of the Software.      #######
// #######                                                                      #######
// ####### THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,      #######
// ####### EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES      #######
// ####### OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND             #######
// ####### NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT          #######
// ####### HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,         #######
// ####### WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING         #######
// ####### FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR        #######
// ####### OTHER DEALINGS IN THE SOFTWARE.                                      #######
// #######                                                                      #######
// ####################################################################################
(function($) {
    
	// Public: jLabel Plugin
	$.fn.jLabel = function(options) {

		var states = new Array();
		var opts = $.extend({}, $.fn.jLabel.defaults, options);

		return this.each(function() {
			var $this = $(this);

			states.push(new state($this));

			$this
				.focus(function() { focus($(this)); })
				.blur(function() { blur($(this)); })
				.keyup(function() { keyup($(this)); });
		});

		// Private: state object
		function state($input) {
			var $input;
			// Public Method: equals
			this.equals = function($input) {
				return $input.prop('id') == this.input.prop('id');
			};

			// Public Properties
			this.input = $input;
			this.label = getLabel($input);                     
            
			// Construction code
			if (this.input.val() != '') this.label.hide();

		};

		// Private: Get an input's related state
		function getState($input) {
			var state; 

			$.each(states, function() {
				if (this.equals($input)) {
					state = this;
					return false; // Stop the jQuery loop running
				};
			});

			return state;
		};

		// Private: Get an input's related label, or create a new one if none found
		function getLabel($input) {

			$input.prop('id', $input.prop('id') || 'jLabel-'+(new Date).getTime()+Math.floor(Math.random()*101));

			// Get the label related to the passed input
			var $label = $('label[for=' + $input.prop('id') + ']');

			// If no label has been found create one
			if ($label.size() == 0) {
				$label = $('<label>')
								.prop('for', $input.prop('id'))
								.text(getText($input));
			};
			
			// If this is a new label insert it into the DOM, if not then move it directly before it's related input
			$input.before($label);

			// Style the label to mimic it's textbox formatting
			$label
				.css({
					'font-family'		: opts['font-family'] || $input.css('font-family'),
					'font-size'		: opts['font-size'] || $input.css('font-size'),
					'font-style'		: opts['font-style'] || $input.css('font-style'),
					'font-variant'		: opts['font-variant'] || $input.css('font-variant'),
					'font-weight'		: opts['font-weight'] || $input.css('font-weight'),
					'letter-spacing'	: opts['letter-spacing'] || $input.css('letter-spacing'),
					'line-height'		: opts['line-height'] || $input.css('line-height'),
					'text-decoration'	: opts['text-decoration'] || $input.css('text-decoration'),
					'text-transform'	: opts['text-transform'] || $input.css('text-transform'),
					'color'			: opts['color'] || $input.css('color'),
					'cursor'		: opts['cursor'] || $input.css('cursor'),
					'display'		: 'inline-block',
					'vertical-align'	: opts['vertical-align'] || $input.css('vertical-align'),
					'width'			: opts['width'] || $input.width()-(opts.yShift * 2)
				});

			// Stop the label from being selectable and position it relative to it's input
			$label
					.mousedown(function() { return false; })
					.css({
						'position'		: 'relative',
						'z-index'		: '100',
						'margin-right'	: -$label.width(),
						'left'			: opts.xShift + parseInt($input.css("padding-left")) + 'px',
						'top'			: opts.yShift + 'px'
					});
			
			return $label;
		};
		
		function getText($input){
			if(opts.text) return opts.text;
			if($.isFunction($input.metadata) && $input.metadata().label) return $input.metadata().label;
			if($.isFunction(opts.populateFrom)) return opts.populateFrom.call($input);
			return $input.prop(opts.populateFrom);
		};

		// Private: Toggle label opacity on input focus
		function focus($input) {
			if ($input.val() == '') {
				getState($input).label.stop().fadeTo(opts.speed, opts.opacity);
			};
		};

		// Private: Toggle label opacity on input blur
		function blur($input) {
			if ($input.val() == '') {
				getState($input).label.stop().fadeTo(opts.speed, 1);
			};
		};

		// Private: Toggle label opacity on input key up
		function keyup($input) {
			var $label = getState($input).label;
			
			if ($input.val() == '') {
				$label.stop().fadeTo(opts.speed, opts.opacity);
			} else {
				if ($label.is(":visible")) $label.stop().fadeTo(opts.speed, 0, function() { $label.hide(); });
			};
		};

	};

	// Public: Default values
	$.fn.jLabel.defaults = {
		speed 		: 200,
		opacity 	: 0.4,
		xShift 		: 2,
		yShift 		: 0,
		populateFrom 	: 'title',
		title		: null,
		'vertical-align': 'top'
	};

})(jQuery);