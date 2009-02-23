/**
* Add a function in String class.
* Return a trimed string
*/
String.prototype.trimed = function(){
	return this.replace( /^\s+|\s+$/g , '');
};


/**
 * Default settings / Core Functions
 */
var _lib = {


	_ie : ( document.attachEvent ) ? true : false,
	_khtml : ( document.addEventListener ) ? true : false,

	/**
	 * returns count of char into a string
	 */
	_occurrencesOf : function( source , khar ){
		var result=0;
		for ( var i =0 ; i<source.length; i++)
			result += (  source.substring(i,i+1) == khar ) ? 1 : 0;
		return result;
	},


	/**
	* returns: True if an array contains a value; otherwise False
	*/
	_contains : function( array , element){
		for ( var i =0; i<array.length; i++)
			if ( array[i] === element )
				return true;
		return false;
	},

	/**
	 * returns a function with choosed 'this' ( arguments are dynamic )
	 */
	_bind : function( fn , bind , parameters ){
		parameters = parameters || [];
		return function(){
			var _params = [];
			for ( var i = 0 ; i< parameters.length; i++ )
				_params.push( parameters[i] );
			for ( var i = 0 ; i< arguments.length; i++ )
				_params.push( arguments[i] );
			return fn.apply( bind , _params );
		};
	},

	/*
	 * returns a function with choosed 'this', first parameter is the Event object
	 */
	_bindEvent : function( fn , bind , parameters ){
		return function( event){
			var params=[ event || window.event ];
			if ( parameters )
				for ( var i=0; i<parameters.length; i++)
					params.push( parameters[i] );
			return fn.apply( bind , params );
		};
	},

	/**
	 * stop the Event propagation
	 */
	_stopEvent : function ( ev ){
		if ( ev ) {
			if ( ev.stopPropagation ){
				ev.stopPropagation();
			}else{
				ev.cancelBubble=true;
			}
			if ( ev.preventDefault){
				ev.preventDefault();
			}else{
				ev.returnValue=false;
			}
		}
	},


	/**
	 * insert add a new css-class to an HTML Element
	 */
	_insertClass : function( element , cssClass ){
		if ( ! ( (' ' + element.className + ' ').indexOf( ' ' + cssClass + ' ')>-1 )  )
			element.className += ' ' + cssClass;
		return element;
	},

	/**
	 * delete a css-class from an HTML Element
	 */
	_deleteClass : function( element , cssClass ){
		if ( (' ' + element.className + ' ').indexOf( ' ' + cssClass + ' ')>-1   )
			element.className = element.className.replace( new RegExp('(^|\\s)' + cssClass + '(?:\\s|$)'), '$1'  );
		return element;
	},

	/**
	 * create an HTML Element with specificated attributes
	 */
	_createElement : function(name, options){
		var el = null;
		var cssClass = null;
		if (options) {
			cssClass = options['class'];
			delete options['class'];
		}
		if ( Calendar._ie ){
			var strTag = '<' + name ;
			for ( var option in options )
				strTag += ' ' + option + '="' + options[ option ] + '"';
			strTag += ' />'
			el =  document.createElement( strTag );
		}else{
			var el = document.createElement( name );
			for ( var option in options )
				el[ option ] = options[ option ];
		}
		if ( cssClass )
			el.className =   ( typeof cssClass == 'object'  )  ? cssClass.join(' ') : cssClass;
		return el;
	},


	/**	Attach an event on element
	* @param {Object} element
	* @param {String} typeEvent
	* @param {function} fn
	*/
	_attachEvent : function( element , typeEvent , fn ){
		if ( Calendar._ie )
			element.attachEvent( 'on' + typeEvent , fn );
		else if ( Calendar._khtml )
			element.addEventListener( typeEvent , fn , true );
		return element;
	},

	/**	Detach an event on element
	* @param {Object} element
	* @param {String} typeEvent
	* @param {function} fn
	*/
	_detachEvent : function( element , typeEvent , fn ){
		if ( Calendar._ie )
			element.detachEvent( 'on' + typeEvent , fn );
		else if ( Calendar._firefox )
			element.removeEventListener( typeEvent , fn , true );
		return element;
	}

};