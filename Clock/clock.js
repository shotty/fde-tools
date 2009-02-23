/**
	 Clock.js
    Copyright (c) 2008 Valerio Chiodino & Fabio Tunno.

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

    Authors: 
    	-	Fabio Tunno (mailto: fat@keytwo.net )
    	-	Valerio Chiodino (mailto: keytwo@keytwo.net)
*/


/**
 *	Main Class, constructor and initilizator
 *
 *	@param string		Element ID
 *	@param hashmap		Clock's options (listed below)
 */
function Clock(element, params) {

	// Checking the type of element, if not a string then return
	if (!element )
		return this;

	
	// Keeping trac of the element
	this.element = ( typeof element == 'string' ) ? document.getElementById(element) : element ;
	
	// If element's not found then return
	if (!this.element)
		return this;
	
	// Taking care of options, if not provided default are used
	if (params)
		this._params = Clock._mergeOptions(params);
	else
		this._params = Clock._params;
	
	// Creating wrapper element
	this.wrapper = document.createElement('div');
	this.wrapper.className += (element.className ? ' clearfix ' : '') + this._params['wrapper-class'];
		
	// Binding class
	this.element.klass = this;
	
	// Continue build a digital clock
	if (this._params['type'] == 'digital') {
		this.digital();
	}
	
	// Continue build a binary clock
	if (this._params['type'] == 'binary') {
		this.binary();
	}
	
	// Reset content
	this.element.innerHTML = '';
	// Appending the clock
	this.element.appendChild(this.wrapper);
	
	// Setting up initial time
	this.updateTime();
	
	// Start the magic!
	this.start();

}

/**
 *	Clock core functions
 * Used in main class as "this" functions
 */
Clock._core = {

	/**
	 *	Sets the clock time
	 */
	'setClockTime': function(){
	
		var _currentTime = new Date();

		this.secondsU = _currentTime.getSeconds().toString().split('').reverse()[0];
		this.secondsD = _currentTime.getSeconds().toString().split('').reverse()[1] || '0';
		
		this.minutesU = _currentTime.getMinutes().toString().split('').reverse()[0];
		this.minutesD = _currentTime.getMinutes().toString().split('').reverse()[1] || '0';
		
		var _hours = _currentTime.getHours();
		
		if (this._params['format'] == '12' && this._params['type'] == 'digital') {
			
			this.meridiem = 'AM';
			
			if (_hours > 12) {
				this.meridiem = 'PM';
				_hours -= 12;
			}
		}
		
		this.hoursU = _hours.toString().split('').reverse()[0];
		this.hoursD = _hours.toString().split('').reverse()[1] || '0';
		
	},
	
	/**
	 *	Transform the provided decimal number into binary representation
	 * @param number 		The number to be converted
	 * @param boolean		Whether or not reverse the result
	 * @param boolean		False: return string - True: return array
	 */
	'decToBin': function (n, reverse, returnArray) {
	
		reverse = reverse || true;
			
		// For a clock we need only four places...
		var a  = ['0','0','0','0'];
		
		while (n > 0) {
			var i = -1;
			while (!((2 << i) > n)) {
				i++;
			}
	
			a[i] = '1';
	
			n = n - (2 << --i);
			if ( n == 1 ){
				a[ 0 ] = '1';
				break;
			}
		}
		
		if (reverse)
			a = a.reverse();
			
		if (returnArray)
			return a;
		
		return a.join('');
	},
	
	/**
	 *	Reset proper time and having care of which kind of clock is used.
	 * Skip no-sense update (ie: hours and minutes every second)
	 */
	'updateTime': function() {
		
		// Update clock's timer
		this.setClockTime();
		
		// =-=-=-=-=-=-=-=-=-=-=
		// Digital Clock rewrite
		// =-=-=-=-=-=-=-=-=-=-=
		if (this._params['type'] == 'digital') {
		
			// AM / PM
			if (this._params['show-meridiem'] && this.meridiemDiv.innerHTML != this.meridiem)
				this.meridiemDiv.innerHTML = this.meridiem;
				
			// Hours
			if (this.hoursGroup.innerHTML != this.hoursD + this.hoursU)
				this.hoursGroup.innerHTML = this.hoursD + this.hoursU;
			
			// Minutes
			if (this.minutesGroup.innerHTML != this.minutesD + this.minutesU)
				this.minutesGroup.innerHTML = this.minutesD + this.minutesU;
			
			// Seconds
			if (this._params['show-seconds']) {
				if (this.secondsGroup.innerHTML != this.secondsD + this.secondsU)
					this.secondsGroup.innerHTML = this.secondsD + this.secondsU;
			}
		}
		
		// =-=-=-=-=-=-=-=-=-=-
		// Binary Clock rewrite
		// =-=-=-=-=-=-=-=-=-=-
		if (this._params['type'] == 'binary') {
		
			// Preserve memory!! :D
			this.binMatrix = new Array(this.hoursD, this.hoursU, this.minutesD, this.minutesU);
			if (this._params['show-seconds'])
				 this.binMatrix = this.binMatrix.concat(this.secondsD, this.secondsU);
				 
			var columns = this._params['show-seconds'] ? 6 : 4;
			
			// Build Matrix
			for (var i = 0; i < columns; i++) {
				this.binMatrix[i] = this.decToBin(this.binMatrix[i], true, true);
			}
			
			// Embed table with bit matrix
			for (var k = 0; k < this.binTable.childNodes.length; k++) {
				for (var z = 0; z < this.binTable.childNodes[k].childNodes.length; z++) {
					if (this.binMatrix[z][k] == 1) {
						this.binTable.childNodes[k].childNodes[z].innerHTML = this._params['bin-odd-content'];
						this.binTable.childNodes[k].childNodes[z].className = this._params['bin-class-odd'];
					} else {
						this.binTable.childNodes[k].childNodes[z].innerHTML = this._params['bin-even-content'];
						this.binTable.childNodes[k].childNodes[z].className = this._params['bin-class-even'];
					}
				}
			}
			
		}

	} 
	

};

/**
 * Build various kind of clocks
 * Used in main class as "this" functions
 */
 
Clock._clocks = {

	// =-=-=-=-=-=-=
	// Digital clock
	// =-=-=-=-=-=-=
	'digital': function() {
	
		// Build hours group
		this.hoursGroup = document.createElement('div');
		this.hoursGroup.className += (this.hoursGroup.className ? ' ' : '') + this._params['hours-class'];
		
		
		// Build hours-minutes separator
		this.secondSeparator = document.createElement('div');
		this.secondSeparator.className += (this.secondSeparator.className ? ' ' : '') + this._params['separator-class'];
		this.secondSeparator.appendChild(document.createTextNode(this._params['separator']));
		
		
		// Build minutes group
		this.minutesGroup = document.createElement('div');
		this.minutesGroup.className += (this.minutesGroup.className ? ' ' : '') + this._params['minutes-class'];
		
		// Build tree
		this.wrapper.appendChild(this.hoursGroup);
		this.wrapper.appendChild(this.secondSeparator);
		this.wrapper.appendChild(this.minutesGroup);
		
		if (this._params['show-seconds']) {
			// Build seconds group
			this.secondsGroup = document.createElement('div');
			this.secondsGroup.className += (this.secondsGroup.className ? ' ' : '') + this._params['seconds-class'];
			
			// Build minutes-seconds separator
			this.firstSeparator = document.createElement('div');
			this.firstSeparator.className += (this.firstSeparator.className ? ' ' : '') + this._params['separator-class'];
			this.firstSeparator.appendChild(document.createTextNode(this._params['separator']));
			
			this.wrapper.appendChild(this.firstSeparator);
			this.wrapper.appendChild(this.secondsGroup);
		}
		
		if (this._params['show-meridiem']) {
			this.meridiemDiv = document.createElement('div');
			this.meridiemDiv.className += (this.meridiemDiv.className ? ' ' : '') + this._params['meridiem-class'];
			this.wrapper.appendChild(this.meridiemDiv);
		}
		
		this.wrapper.className += ' digital';
	},
	
	// =-=-=-=-=-=-
	// Binary clock
	// =-=-=-=-=-=-
	'binary': function() {
		
		this.binTable = document.createElement('table');
		this.binTable.setAttribute('summary', 'bin clock');
		this.binTable.className = this._params['bin-table-class'];
		
		var columns = this._params['show-seconds'] ? 6 : 4;
		var rows = 4;
		
		// Build table
		for (var i = 0; i < rows; i++) {
			var row = document.createElement('tr');
			row.className = this._params['bin-row-class'];
			for (var j = 0; j < columns; j++) {
				var cell = document.createElement('td');
				cell.className = this._params['bin-cell-class'];
				row.appendChild(cell);
			}
			this.binTable.appendChild(row);
		}
		
		// Append to document
		this.wrapper.appendChild(this.binTable);
		this.wrapper.className += ' binary';
		
	}
};


/**
 * Used to run the clock
 * References: http://killustar.blogspot.com/2005/04/javascript-setinterval-problem.html
 */ 
Clock._thread = {
	
	// Start clock
	'start': function() {
		self = this;
		var interval = this._params['show-seconds'] ? 1000 : 60000;
		this.interval = setInterval( this.run , interval);
	},
	
	// Run clock
	'run': function() {
		self.updateTime();
	},
	
	// Stop clock
	'stop': function() {
		clearInterval(this.interval);
		self = undefined;
	}
};

/**
 * Sets the main class options when options are provided from configuration
 * @param hashmap		List of the customized options
 */
Clock._mergeOptions = function( params ){
	var opts = {};
	for (var prop in Clock._params)
		opts[ prop ] = typeof(params[prop]) != 'undefined' ? params[ prop ] : opts[ prop ] = Clock._params[ prop ];
	return opts;
}

/**
 *	Complete list of Clock's options
 */
Clock._params = {

	'type': 						'digital',						// Can be digital or binary
	'format':					'24',								// Time format (24h - 12AM/PM)
	'show-meridiem':			false,							// Whether to show or not "AM/PM"
	'show-seconds': 			true,								// Whether to show or not seconds
	'embedded':					true,								// Whether the clock is embedded inside another element or not
	'separator': 				':',								// Units separators (ie: HH:MM:SS)
	'separator-class': 		'clock-separator',			// CSS separator class
	
	'seconds-class':			'clock-seconds',				// CSS seconds class
	'minutes-class':			'clock-minutes',				// CSS minutes class
	'hours-class':				'clock-hours',					// CSS hours class
	'meridiem-class':			'clock-meridiem',				// CSS meridiem class
	'wrapper-class': 			'clock-wrapper',				// CSS clock's wrapper class
	'bin-table-class':		'clock-bin-table',			// CSS clolc's table class
	'bin-row-class':			'clock-bin-row',				// CSS clolc's table class
	'bin-cell-class':			'clock-bin-cell',				// CSS clolc's table class
	'bin-class-even': 		'clock-0',						// Binary clock CSS even class
	'bin-even-content':		'0',								// Binary clock "0" content
	'bin-class-odd': 			'clock-1',						// Binary clock CSS odd class
	'bin-odd-content':		'1'								// Binary clock "1" content
	
};

/**
 *	Build Clock's prototype object
 */
Clock._objectFunctions = [ Clock._core, Clock._thread, Clock._clocks ];
for ( var i = 0; i < Clock._objectFunctions.length ; i++) {
	for ( var prop in Clock._objectFunctions[i] ) {
		Clock.prototype[prop] = Clock._objectFunctions[i][prop];
	}
}
		
		