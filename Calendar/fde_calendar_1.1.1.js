Calendar._style = '.fde_tmp_calendar{display:none;}div.fde_calendar_inputs{float:left;}input.fde_calendar_text{width:80%;float:left;}div.fde_calendar_opener{margin-left:1px;float:left;cursor:pointer;}div.fde_calendar_container{position:absolute;border:1px dotted black;z-index:10000;background-color:white;}div.fde_calendar_container_hide{top:-1000px;left:-1000px;visibility:hidden;}div.fde_calendar_container_notPresent{display:none;}div.fde_calendar_container iframe{position:absolute;z-index:-1;top:0;width:100%;height:100%;left:0;border:none;}div.fde_calendar_container table.fde_calendar_table{border:none;font-size:80%;margin:0;padding:0;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_month_name{text-align:center;vertical-align:middle;}div.fde_calendar_container table.fde_calendar_table td.fde_days_title{text-align:center;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_navigation{cursor:pointer;}div.fde_calendar_container table.fde_calendar_table span.fde_calendar_navigation_month{cursor:n-resize;}div.fde_calendar_container table.fde_calendar_table span.fde_calendar_navigation_year{cursor:n-resize;margin-left:10px;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_navigation_back_year{text-align:left;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_navigation_back_month{text-align:center;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_navigation_next_month{text-align:center;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_navigation_next_year{text-align:right;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_holiday{color:red;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_selected{color:blue;background-color:#CCCCCC;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_disabled{color:gray;cursor:default !important;}div.fde_calendar_container table.fde_calendar_table td.fde_calendar_day{font-weight:bold;text-align:center;}';
document.write('<style type="text/css">');
document.write( Calendar._style );			
document.write('</style>');

Calendar.RELEASE = {
	'@author'	: 	'Fat {fabio.tunno@gmail.com}',
	'@version' 	: 	'1.1',
	'@release' 	: 	'1'
};
Calendar._TAGS=['calendar','div'];
Calendar._OPTION_TAGS = ['calendar_option', 'input'];
Calendar._DEFAULT_LANGUAGE = 'it';
Calendar._SEPARATORS = '/^$%:-_';
Calendar._SPECIAL_SEPARATORS = '/^$%';
Calendar._DEFAULT_SEPARATOR = Calendar._SEPARATORS.substring( 0 , 1 );
Calendar._SHORT_YEAR_LIMIT = 50;
Calendar._DEFAULT_FORMAT = 'DD' + Calendar._DEFAULT_SEPARATOR + 'MM' + Calendar._DEFAULT_SEPARATOR + 'YYYY';
Calendar._DEFAULT_MIN_DATE = function( _format ){
	_format = _format || Calendar._DEFAULT_FORMAT;
	var _isShortYear = (( _format.indexOf( 'YYYY') == -1 ) && ( _format.indexOf('YY')!=-1 ) );
	var _date = {
		'DD' :  '01',
		'MM' :  '01',
		'YYYY': '19' + Calendar._SHORT_YEAR_LIMIT
	}
	_format = _format.replace( 'DD' , _date.DD );
	_format = _format.replace( 'MM' , _date.MM );
	if ( _isShortYear ){
		_format = _format.replace( 'YY' , (''+_date.YYYY).substring(2) );
	}else
		_format = _format.replace( 'YYYY' , _date.YYYY );
	return _format;
};
Calendar._DEFAULT_MAX_DATE = function( _format ){
	_format = _format || Calendar._DEFAULT_FORMAT;
	var _isShortYear = (( _format.indexOf( 'YYYY') == -1 ) && ( _format.indexOf('YY')!=-1 ) );
	var _date = {
		'DD' :  '31',
		'MM' :  '12',
		'YYYY': '20' + (Calendar._SHORT_YEAR_LIMIT-1)
	}
	_format = _format.replace( 'DD' , _date.DD );
	_format = _format.replace( 'MM' , _date.MM );
	if ( _isShortYear ){
		_format = _format.replace( 'YY' , (''+_date.YYYY).substring(2) );
	}else
		_format = _format.replace( 'YYYY' , _date.YYYY );
	return _format;
};


/**
 * Initialize method
 * @param {Object} parameters
 */
function Calendar(parameters){
	if ( !parameters ) return this;
	
	this.parameters = parameters;
	
	/* Delete application parameters */
	this.APPLICATION_PARAMETERS =  Calendar._splitApplicationParameters( this.parameters );

	/* apply settings */
	this.setFormat	( this.APPLICATION_PARAMETERS['format'] || Calendar._DEFAULT_FORMAT  ) ;
	this.setLanguage( 	this.APPLICATION_PARAMETERS['language'] || Calendar._DEFAULT_LANGUAGE  ) ;
	
	if (  this.APPLICATION_PARAMETERS['onMonthLoad']  )
		eval( "this.onMonthLoad = function(){" + this.APPLICATION_PARAMETERS['onMonthLoad'] + "}" );
	if (  this.APPLICATION_PARAMETERS['onSelection']  )
		eval( "this.onMonthLoad = function(){" + this.APPLICATION_PARAMETERS['onSelection'] + "}" );
	if (  this.APPLICATION_PARAMETERS['onErrorDate']  )
		eval( "this.onMonthLoad = function(){" + this.APPLICATION_PARAMETERS['onErrorDate'] + "}" );
	
	this.wrapper = this.APPLICATION_PARAMETERS['node'];
	
	if ( this.wrapper ){
		/* Create all element */
		this.node = Calendar._createElement( 'div' ,{
			'class': Calendar._css['calendar_elements']
		} );
		this.parameters.type = 'text';
		this.parameters.maxLength = this.format.length;
		this.parameters['class'] = (  this.parameters['class']  )  ? this.parameters['class'] + ' ' +  Calendar._css['calendar_text']   : Calendar._css['calendar_text'] ;
		this.text = Calendar._createElement( 'input' , this.parameters );
		this.opener = Calendar._createElement( 'div' , {
			'class': Calendar._css['calendar_opener']
		});
		
		/* TODO: set the correct HTML text into opener link */
		this.opener.innerHTML = 'v';
		
		this.opener.onclick = Calendar._bindEvent( this.open , this );
		
		/* Append the elements into master node */
		this.node.appendChild( this.text );
		this.node.appendChild( this.opener );
		
		this.text.onblur = Calendar._bind( this.onAfterInsertDate , this , [] );

		this.doCalendar();
		this.onAfterInsertDate();
		
		this.text.calendar = this;
		
		this.bodyTag = document.getElementsByTagName('body')[0];
		
		this.bodyTag.insertBefore( this.calendar , this.bodyTag.firstChild );

		Calendar._attachEvent( document , 'mousedown' , Calendar._bindEvent(  this.unLoad , this ,  [] ) );

		this.mountInputElements();
	}
	
	
	this.setDisabled 	( this.APPLICATION_PARAMETERS['disabled'] == 'true' ) ;
	this.setDraggable 	( this.APPLICATION_PARAMETERS['draggable'] == 'true' ) ;
	
	return this;
}

/**
 * Main function of architecture of class
 */
Calendar._utility = {
	
	'convertDate':function( sourceFormat , destFormat , date ){
		var _date ='';
		if (typeof date == 'string') {
			_date = date;
		}else if (typeof date == 'object' && typeof date.getDate == 'function' ) {
			_date = this.getFormatStringFromDate(date, destFormat);
		}else 
			return null;
		
		var obj = this.getDateObjectByFormat( date , sourceFormat );
		
		if ( obj.DD > 0)
			_date = destFormat.replace( 'DD' , obj.DD );
		_date = _date.replace( 'MM' , obj.MM );
		if ( _date.indexOf('YYYY') > -1 )
			_date = _date.replace( 'YYYY' , obj.YYYY );
		else
			_date = _date.replace( 'YY' , ('' + obj.YYYY).substring(2) );
		
		return _date;
	},
	
	'setFormat':function( _format ){
		if ( this.text && (   this.text.value.trimed().length > 0 &&  this.format  )  ){
			this.text.value = this.convertDate( this.format , _format , this.text.value );
		}
		this.format = _format || Calendar._DEFAULT_FORMAT;
		this.getSeparator();
		this.isShortYear = (  ( this.format.indexOf('YYYY') == -1 ) && (  this.format.indexOf('YY') != -1 )  );
		if ( ! this.maxDate ) this.setMaxDate (  this.APPLICATION_PARAMETERS['max']		|| Calendar._DEFAULT_MAX_DATE( this.format )   ) ;
		if ( ! this.minDate ) this.setMinDate (  this.APPLICATION_PARAMETERS['min']		|| Calendar._DEFAULT_MIN_DATE( this.format )   ) ;
		if ( ! this.startDate ) this.setStartDate(  this.APPLICATION_PARAMETERS['start'] 	|| Calendar._getToday( this.format ) ) ;
	},
	
	'setLanguage':function( _language ){
		this.language = _language || Calendar._DEFAULT_LANGUAGE ;
		this.MONTHS = Calendar._months[ this.language ];
		this.DAYS = Calendar._days[ this.language ];
	},
	
	'setDisabled':function( _disabled ){
		this.disabled = ( typeof _disabled == 'boolean' )  ? _disabled : _disabled == 'true';
		if (this.text) {
			if ( this.disabled ) this.text.disabled = 'disabled';
			else this.text.removeAttribute('disabled');
		}
	},
	
	
	
	'setDraggable':function( _draggable ){
		this.draggable = ( typeof _draggable == 'boolean'  ) ? _draggable : _draggable == 'true';
		return this;			
	},
	
	
	/**
	 * Get the right separator of date from FORMAT
	 */
	'getSeparator':function(){
		var _format = this.format.replace('DD','');
		_format = _format.replace('MM','');
		_format = _format.replace('YY','');
		_format = _format.replace('YY','');
		if ( _format.length == 1 )
			this.separator = _format;
		else if ( _format.length>1)
			this.separator = _format.substring(0,1);
		else
			throw 'bad format';
		return this.separator;
	},
	
	/**
	 * set the start date
	 * @param {String} date
	 */
	'setStartDate':function( date ){
		var arrDate = this.getDateObjectFromString( date );
		this.startDate = Calendar._newDate();
		this.startDate.setMonth( arrDate.MM-1 );
		this.startDate.setDate( (arrDate.DD>0) ? arrDate.DD : 1 );
		this.startDate.setYear( arrDate.YYYY );
		return this.startDate;
	},
	
	/**
	 * Set the minum range of date
	 * @param {String} date
	 */
	'setMinDate':function( date ){
		var arrDate = this.getDateObjectFromString( date );
		this.minDate = Calendar._newDate();
		this.minDate.setMonth( arrDate.MM-1 );
		this.minDate.setDate( (arrDate.DD>0) ? arrDate.DD : 1 );
		this.minDate.setYear( arrDate.YYYY );
		return this.minDate;
	},
	
	/**
	 * Set the maximun range of date
	 * @param {String} date
	 */
	'setMaxDate':function( date ){
		var arrDate = this.getDateObjectFromString( date );
		this.maxDate = Calendar._newDate();
		this.maxDate.setMonth( arrDate.MM-1 );
		this.maxDate.setDate( (arrDate.DD>0) ? arrDate.DD : 1 );
		this.maxDate.setYear( arrDate.YYYY );
		return this.maxDate;
	},
	
	
	/**
	 *	Return the date. if date is empty and TODAY is true then return today
	 */
	getDate:function(today){
		var date = this.text.value;
		if ( date.length == 0 && today ){
			var _date = Calendar._newDate();
			var _day = '' + _date.getDate();
	        var _month = '' + (_date.getMonth() + 1);
	        var _year = '' + _date.getUTCFullYear();
	        _day = (_day.length < 2) ? '0' + _day : _day;
	        _month = (_month.length < 2) ? '0' + _month : _month;
	        
	        var _format = this.format;
	        _format = _format.replace('DD', _day);
	        _format = _format.replace('MM', _month);
	        if ( this.isShortYear ) {
	            _format = _format.replace('YY', ('' + _year).substring(2) );
	        }else {
	            _format = _format.replace('YYYY', _year);
	        }
	        
	        date = _format;
		}
			
		return date;
	},
	
	
	/**
	 * Return an object from a formatted string date
	 * @param {String} formatted date
	 */
	'getDateObjectFromString':function( date ){
		var _date = date;
		date = date.split( this.separator );
		if ( date.length == 3 )
			return this.getDateObjectByFormat( _date );
		else if ( date.length == 2)
			return this.getDateObjectByFormat( _date , this.format.replace('DD' + this.separator ,'' ).replace(this.separator + 'DD' , '' ) );
		else
			throw "bad date";
		return null;
	},
	
	/**
	 * return an object from a formatted string date.
	 * 	{ 
	 * 		'DD' 	= day of date,
	 * 		'MM' 	= month of date,
	 * 		'YYYY' 	= year of date
	 * 	}
	 * @param {String} formatted date
	 * @param {String} format to use else default format
	 */
	'getDateObjectByFormat':function( date , format ){
		var _obj = {};
		format = format || this.format;
		var _iDD = format.indexOf('DD');
		var _iMM = format.indexOf('MM');
		var _iYY = ( this.isShortYear ? format.indexOf('YY')  :  format.indexOf('YYYY') );
		
		_obj.DD = (_iDD!=-1) ? parseInt( date.substring( _iDD , _iDD + 2 )  , 10  ) : 0;
		_obj.MM = parseInt( date.substring( _iMM , _iMM+2 )  , 10  );
		
		if ( this.isShortYear ){
			var _year = date.substring( _iYY , _iYY+2 );
			_year = parseInt( _year , 10 );
			if ( _year < Calendar._SHORT_YEAR_LIMIT )
				_obj.YYYY = parseInt( '20' + ( (_year<10) ? '0' + _year : _year ) , 10 );
			else
				_obj.YYYY = parseInt( '19' + ( (_year<10) ? '0' + _year : _year ) , 10 );
		}else{
			_obj.YYYY = parseInt (   date.substring( _iYY , _iYY+4 )  , 10  );
		}
		return _obj;
	},
	
	/**
	 * 	return a Date class from string;
	 * @param {String} date
	 */
	'getDateFromString':function( date ){
		if ( !date || date.length==0)
		      return null;
		var _obj = this.getDateObjectByFormat( date );
		var _date = new Date( obj.YYYY , obj.MM-1 ,  ( ( obj.DD > 0 )  ?  obj.DD  :  1  )    );
		return Calendar._newDate( _date );
      },
	
	/**
	 * Test if the date is present in a given range of dates
	 * @param {Date} date to test
	 * @param {Date} min date {range}
	 * @param {Date} max date {range}
	 */
	'isBetweenDate':function( date , min , max , simpleControl ){
		Calendar._newDate( date );
		Calendar._newDate( min );
		Calendar._newDate( max );
		if ( simpleControl   ){
			min = Calendar._copyDate( min );
			max = Calendar._copyDate( max );
			min.setDate( 1 );
			max.setDate( 1 );
			max.setMonth( max.getMonth() + 1 );
			max.setDate( max.getDate() -1 );
		}
		return (   ( date.getTime() >= min.getTime() )  &&  (  date.getTime() <= max.getTime()  )   );
	},
	
	
	
	'getFormatStringFromDate':function( date , format ){
		var obj = {
			'DD':	'' + date.getDate(),
			'MM':	'' + (date.getMonth()+1),
			'YYYY':	'' + date.getFullYear()
		}
		
		obj.DD = ( obj.DD.length < 2 )  ?  '0' + obj.DD : obj.DD;
		obj.MM = ( obj.MM.length < 2 )  ?  '0' + obj.MM : obj.MM;
		
		var _date = format || this.format ;
		_date = _date.replace( 'DD' , obj.DD );
		_date = _date.replace( 'MM' , obj.MM );
		if ( this.isShortYear )
			_date = _date.replace( 'YY' , obj.YYYY.substring( 2 ) );
		else
			_date = _date.replace( 'YYYY' , obj.YYYY );

		return _date;
	},
	
	/**
	 * return a string such as correct format
	 * @param {String} date
	 * @return {String} formatted date or null string
	 */
	'buildCorrectDate':function( date ){
		var _val1 = Calendar._occurrencesOf( date , this.separator );
		var _val2 = Calendar._occurrencesOf( this.format , this.separator );
		
		if ( _val1 == 0 || ( date.length != this.format.length )  ) {
			var _format = this.format;

			var _reg = this.separator;
			if ( Calendar._SPECIAL_SEPARATORS.indexOf( this.separator ) > -1  )
				_reg = "\\" + this.separator;
			
			_format = _format.replace( new RegExp( _reg , "g" )  , '' );
			date = date.replace ( new RegExp( _reg , "g" )  , '' );
			
			var _shortDate = ( Math.abs( _format.length - date.length ) == 2 );
			
			if (  ( _format.length != date.length ) && ! _shortDate  )
				return null;
			
			var _iDD = _format.indexOf( 'DD' );
			var _iMM = _format.indexOf('MM');
			var _iYY = ( this.isShortYear ) ?  _format.indexOf('YY') : _format.indexOf('YYYY') ;
			
			var _obj = {
				'DD': date.substring( _iDD ,  _iDD + 2 ),
				'MM': date.substring( _iMM ,  _iMM + 2 ),
				'YYYY': date.substring( _iYY ,  _iYY + ( ( this.isShortYear || _shortDate ) ? 2 : 4 ) )
			};
			
			if ( _shortDate )
				_obj.YYYY = (  parseInt( _obj.YYYY , 10 ) < Calendar._SHORT_YEAR_LIMIT   )  ?  '20' + _obj.YYYY : '19' + _obj.YYYY;
						
			_format = this.format;
			_format = _format.replace('DD' , _obj.DD );
			_format = _format.replace('MM' , _obj.MM );
			_format = _format.replace( ( ( this.isShortYear) ? 'YY' : 'YYYY' ) , _obj.YYYY );
			
			return _format
			
		}else if ( _val1 != _val2 )
			return null;
		
		return date;
	},
	
	
	/**
	 * Build a RegExp to test the syntact of date
	 */
	'buildRegExp':function(){
		var reg = this.format;
		 
		reg = reg.replace( 'DD' , '(([0-2][0-9])|(3[0-1]))' );
		reg = reg.replace( 'MM' , '((0[1-9])|(1[0-2]))');
		
		if ( this.isShortYear )
			reg = reg.replace( 'YY' , '([0-9]{2})'  );
		else
			reg = reg.replace( 'YYYY' , '([1-2]([0-9]{3}))');
		
		if ( Calendar._SPECIAL_SEPARATORS.indexOf( this.separator )>-1 )
			reg = reg.replace(  new RegExp( "\\" + this.separator , "g" )  , "\\" + this.separator  );
		
		return new RegExp('^' + reg + '$');
	},
	
	
	/**
	 * test a formatted date by a regexp
	 * @param {Object} date
	 */
	'testSyntactDate':function( date ){
		return this.buildRegExp().test( date );
	},
	
	'enableDisableButton':function( date ){
		Calendar._deleteClass(  this.backMonth  , Calendar._css['disabled']  ) ;
		Calendar._deleteClass(  this.backYear  , Calendar._css['disabled']  ) ;
		Calendar._deleteClass(  this.nextMonth  , Calendar._css['disabled']  ) ;
		Calendar._deleteClass(  this.nextYear  , Calendar._css['disabled']  ) ;
		
		var _date = Calendar._copyDate( date );
		_date.setMonth( date.getMonth() + 1 )
		if ( ! this.isBetweenDate( _date , this.minDate , this.maxDate ) )
			Calendar._insertClass(  this.nextMonth  , Calendar._css['disabled']  ) ;
			
		_date = Calendar._copyDate( date );
		_date.setMonth( _date.getMonth() + 12 )
		if ( ! this.isBetweenDate( _date , this.minDate , this.maxDate ) )
			Calendar._insertClass(  this.nextYear  , Calendar._css['disabled']  ) ;
			
		_date = Calendar._copyDate( date );
		_date.setDate( _date.getDate() - 1 )
		if ( ! this.isBetweenDate( _date , this.minDate , this.maxDate ) )
			Calendar._insertClass(  this.backMonth  , Calendar._css['disabled']  ) ;
			
		_date = Calendar._copyDate( date );
		_date.setMonth( _date.getMonth() -11 );
		_date.setDate( _date.getDate() - 1 );
		if ( ! this.isBetweenDate( _date , this.minDate , this.maxDate ) )
			Calendar._insertClass(  this.backYear  , Calendar._css['disabled']  ) ;
			
	}
	
};


/**
 * Main function of structure of class.
 * These functions are the core of class
 */
Calendar._architecture = {
	
	/**
	 *	Inject in page new node with correct input elements
	 */	
	'mountInputElements':function(){
		if (  Calendar._ie && Calendar._TAG == Calendar._TAGS[0] ){
			var _wrapper = this.wrapper.nextSibling;
			while( _wrapper.tagName != '/' + this.wrapper.tagName ){
				_wrapper.parentNode.removeChild( _wrapper );
				_wrapper = this.wrapper.nextSibling;
			}
			
			this.wrapper.nextSibling.parentNode.removeChild( this.wrapper.nextSibling );
		}
		this.wrapper.parentNode.replaceChild( this.node , this.wrapper );
	},

	/**
	 *	Create the calendar container and inject in page
	 */
	'doCalendar': function(){
		this.calendar = Calendar._createElement( 'div' ,{
			'class': [ Calendar._css['calendar'] ,  Calendar._css['calendar_invisible']  ,  Calendar._css['calendar_notPresent']   ]
		} );
		this.calendarTable = Calendar._createElement( 'table',{
			'class': Calendar._css['table']
		} );

		if ( Calendar._ie )
			this.calendar.appendChild (  Calendar._createElement( 'iframe' , {'frameborder':'0'} )  );
		

		var tbody = Calendar._createElement( 'tbody' );
		var allTr = [];
		for ( var i =0; i< 9 ; i++ ){
			var tr = Calendar._createElement( 'tr' );
			tbody.appendChild( tr );
			allTr.push( tr );
		}

		
		this.tdTitleMonth = Calendar._createElement( 'td' , {
			'colSpan':'7',
			'class': Calendar._css['month_title']
		});

		this.spanMonth = Calendar._createElement( 'span' , {
			'class': Calendar._css['navigation_month']
		});
		this.spanYear = Calendar._createElement( 'span' , {
			'class': Calendar._css['navigation_year']
		});

		this.tdTitleMonth.appendChild ( this.spanMonth );
		this.tdTitleMonth.appendChild ( this.spanYear  );

		allTr[0].appendChild( this.tdTitleMonth );
		
		this.backYear = Calendar._createElement( 'td',{
			'class': [  Calendar._css['navigation']  ,   Calendar._css['navigation_back_year']  ]
		} );
		this.backMonth = Calendar._createElement( 'td' ,{
			'class': [  Calendar._css['navigation']  ,   Calendar._css['navigation_back_month']  ]
		});
		
		var spaceTd = Calendar._createElement( 'td' , {
			'colSpan':'3'
		});
		spaceTd.innerHTML='&nbsp;';
		
		
		this.nextMonth = Calendar._createElement( 'td',{
			'class': [  Calendar._css['navigation']  ,   Calendar._css['navigation_next_month']  ]
		} );
		this.nextYear = Calendar._createElement( 'td' ,{
			'class': [  Calendar._css['navigation']  ,   Calendar._css['navigation_next_year']  ]
		});
		
		allTr[1].appendChild( this.backYear );
		allTr[1].appendChild( this.backMonth );
		allTr[1].appendChild( spaceTd );
		allTr[1].appendChild( this.nextMonth );
		allTr[1].appendChild( this.nextYear );


		/**
		 * Build days header
		 */
		for ( var i=0 ;i<7; i++ ){
			var td = Calendar._createElement( 'td' ,{
				'class': [  Calendar._css['day_title'] , ( i==5 || i==6 ) ? Calendar._css['holiday'] : '' ]
			} );
			td.innerHTML = this.DAYS[ i ];
			allTr[2].appendChild( td );
		}


		/**
		 * Build TDs of days
		 */
		this.tdDays =[];
		for ( var i=3; i<9; i++){
			var currTr = allTr[i];
			for ( var j=0; j<7; j++ ){
				var td = Calendar._createElement( 'td' ,{
					'class': [  Calendar._css['day'] , ( j==5 || j==6 ) ? Calendar._css['holiday'] : '' ]
				} );
				this.tdDays.push ( td );
				currTr.appendChild( td );
			}
		}

		this.spanMonth.innerHTML = '';
		this.spanYear.innerHTML = '';
		
		Calendar._attachEvent (  this.spanMonth , (Calendar._ie) ? 'mousewheel' : 'DOMMouseScroll' ,  Calendar._bindEvent( this.mouseWheel , this , ['MONTH'] )  );
		Calendar._attachEvent (  this.spanYear , (Calendar._ie) ? 'mousewheel' : 'DOMMouseScroll' ,  Calendar._bindEvent( this.mouseWheel , this , ['YEAR'] )  );
		
		
		this.backYear.innerHTML = '&laquo;';
		this.backMonth.innerHTML = '&lt;';
		this.nextMonth.innerHTML = '&gt;';
		this.nextYear.innerHTML = '&raquo;';

		this.backYear.onclick = Calendar._bind( this.load , this ,  [ -12 ] );
		this.backMonth.onclick = Calendar._bind( this.load , this , [ - 1 ] );
		this.nextMonth.onclick = Calendar._bind( this.load , this , [   1 ] );
		this.nextYear.onclick = Calendar._bind( this.load , this ,  [  12 ] );
		
		this.calendarTable.appendChild( tbody );

		this.calendar.appendChild( this.calendarTable );
		
		
		/* Drag management */
		Calendar._attachEvent( this.calendar , 'mouseup' , Calendar._bind( function(){this.doDrag=false;} , this , [] )  );
		Calendar._attachEvent( this.calendar , 'mousedown' , Calendar._bindEvent( function( event ){
				this.startClip={
					'x':event.clientX,
					'y':event.clientY
				};
				this.doDrag=this.draggable;
		} , this , [] )  );
		Calendar._attachEvent( document , 'mousemove' , Calendar._bindEvent( this.drag , this , [] )  );
		
		return this.calendar;
	},
	
	/**
	 * Load month calendar
	 * @param {Event} event		coordinates of position of calendar
	 * @param {int} flag			number of month to show from attual month showed
	 */
	'open':function( event ){
		if (this.disabled) {
			this.unLoad();
			return this;
		}
		this.currentDate = undefined;
		if ( ! this.load( 0 )  )
			return false;
		
		Calendar._deleteClass( this.calendar , Calendar._css['calendar_notPresent'] ) ;
		
		var _top = event.clientY;
		var _left = event.clientX;
		var position = {
			'top': _top ,
			'left': _left
		};
		
		var diff = ( position.left + this.calendar.offsetWidth ) - this.bodyTag.scrollWidth;
		if (  diff > 0  ) 
			position.left = position.left - diff;
		
		diff = ( position.top + this.calendar.offsetHeight ) - this.bodyTag.scrollHeight;
		if (  diff > 0  ) 
			position.top = position.top - diff;
		
		
		
		this.calendar.style['top'] = (   (position.top>0) ? position.top : 0  ) + 'px';
		this.calendar.style['left'] = (  (position.left>0) ? position.left : 0 ) + 'px';
		
		
		Calendar._deleteClass( this.calendar , Calendar._css['calendar_invisible'] ) ;
		
		return true;
		
	},
	
	/**
	 * return a date after test it
	 * @param {String} date
	 * @return formatted date else an empty string
	 */
	'returnTestedDate':function( date ){
		
		date = this.buildCorrectDate( date );
		if ( date == null )
			return '';
		
		if ( ! this.testSyntactDate( date ) )
			return '';
		
		var _date = this.getDateObjectByFormat( date );
		var __date = this.getDateFromString( date );
		if (  ( _date.MM - 1 ) != __date.getMonth() )
			return '';
		
		if ( !this.isBetweenDate( this.getDateFromString( date ) , this.minDate , this.maxDate )  )
			return '';
		
		return date;
		
	},
	
	/**
	 * NOT USED
	 * accept only number KEYCODE, CTRLKEY, ALTKEY and FUNCTION BUTTONs
	 * @param {Event} the event
	 */
	'onKeyDown':function( event ){
		var code = event.which || event.keyCode ;

		if ( Calendar._contains( [ 8 , 9 , 13 , 27 , 35 , 36 , 37 , 38 , 39 ,40 , 46 ]  , code )  ) 
			return true;
			
		if ( /*event.shiftKey || */event.altKey || event.ctrlKey )
			return true;

		if ( (code -111)>0 && (code -111)<13   )
			return true;

		var reg = new RegExp(  "[0-9]" );
		
		var khar = String.fromCharCode( code );

		if (reg.test( khar ) ) {
			this.executeControl = true;
		}else {
			Calendar._stopEvent( event );
		}
		
		return true;
	},
	
	/**
	 * lost focus of text element
	 */
	'onAfterInsertDate':function(){
		
		if ( this.text.value.trimed().length == 0 ) return true;
		
		var value = this.text.value;
		this.text.value = this.returnTestedDate( this.text.value );
		
		if (this.text.value.trimed().length == 0) {
			if (this.onErrorDate) 
				this.onErrorDate(value);
		}else {
			if (!this.onDateSelection( null , this.getDateFromString(this.text.value))) 
				this.text.value = '';
		}
		
		this.executeControl = false;
		
		return true;
		
	},
	
	'onDateSelection':function( event , date ){
		
		var result = true;
		
		if ( this.onSelection  )
			result = this.onSelection(  date.getDate() , date.getMonth() +1 , date.getFullYear() , this  );
			
		if (typeof result == 'boolean' && !result) 
			return false;
			
		this.unLoad(null , true);
	
		this.text.value = this.getFormatStringFromDate(date);
		
		if ( event )
			this.text.focus();
		
		this.executeControl = false;
		
		return (  typeof result == 'boolean'  )  ? result : true ;
	},
	
	'mouseWheel':function( event , option ){
		
		var increment =  ( Calendar._ie )  ?  window.event.wheelDelta  : -event.detail ;
		var flag = 0;
		if (increment > 0) {
			if (option == 'MONTH') {
				flag = 1;
			}else if (option == 'YEAR') {
				flag = 12;
			}
		}else if ( increment < 0 ){
			if (option == 'MONTH') {
				flag = -1;
			}else if (option == 'YEAR') {
				flag = -12;
			}
		}
		
		Calendar._stopEvent( event );

		this.load( flag  ) ;
		return false;
		
	},
	
	'drag':function( event ){
		if ( ! this.doDrag ) return true;
		var _x = this.startClip.x;
		var _y = this.startClip.y;
		
		var x=event.clientX;
		var y=event.clientY;
		
		this.calendar.style.left = ( this.calendar.offsetLeft - (_x - x ) ) + 'px';	
		this.calendar.style.top = ( this.calendar.offsetTop - (_y - y) ) + 'px';
		
		this.startClip.x = x;
		this.startClip.y = y;
	}

};


Calendar._core = {
	
	'unLoad':function( event , force ){
		
		event = event || window.event;
		if ( event && !force ){
			
			var target = event.target || event.srcElement;
			while ( target && target != this.calendar )
				target = target.parentNode;
			
			if ( target === this.calendar )
				return;
			
		}
		
		Calendar._insertClass( this.calendar , Calendar._css['calendar_invisible']  );
		Calendar._insertClass( this.calendar , Calendar._css['calendar_notPresent']  );
		
		this.currentDate = null;
		
		return true;
	},
	
	'load':function( flag ){
		
		this.selectedDate = this.getDateFromString(  this.text.value );
		this.currentDate = this.currentDate || Calendar._newDate( this.selectedDate || this.startDate );
		
		var _date = Calendar._copyDate (  this.currentDate ) ;
		_date.setMonth(  _date.getMonth() + flag  );
		if (  ! this.isBetweenDate( _date , this.minDate , this.maxDate , true )   )
			return false;
		
		this.currentDate = _date;
		
		var _YEAR = _date.getFullYear();
		var _MONTH = _date.getMonth();
		
		for ( var i=0; i<this.tdDays.length; i++)
			Calendar._resetDay( this.tdDays[i] );
		
		
		var _day = 1;
		_date.setDate( _day );
		var _indx = _date.getUTCDay();
		if ( _indx == 0)
			_indx =7;
		while(  true  ){
			
			this.tdDays[ _indx ].innerHTML = _date.getDate();
			
			if ( this.selectedDate  &&   _date.getTime() == this.selectedDate.getTime() )
				Calendar._insertClass( this.tdDays[ _indx ] , Calendar._css['selected']  );
			
			var _disabled =  ( ! this.isBetweenDate( _date, this.minDate, this.maxDate )  ) || 
								(  ( typeof this.onMonthLoad == 'function' ) &&  ! this.onMonthLoad( _day , _MONTH , _YEAR , this )  );
			
			if ( !_disabled ) {
				this.tdDays[ _indx ].onclick = Calendar._bindEvent( this.onDateSelection, this, [ Calendar._copyDate( _date ) ] );
				Calendar._insertClass( this.tdDays[ _indx ] , Calendar._css['navigation']  );
			}else 
				Calendar._insertClass( this.tdDays[ _indx ], Calendar._css['disabled'] );
			
			_day++;_indx++;
			_date.setDate( _day );
			
			if ( _date.getMonth() != _MONTH ) 
				break;
		}
		
		_date.setMonth( _MONTH );
		_date.setYear( _YEAR );
		this.currentDate = _date;
		this.spanMonth.innerHTML = this.MONTHS[ _MONTH ];
		this.spanYear.innerHTML = _YEAR
		
		this.enableDisableButton(  this.currentDate  );
	
		return true;
		
	}
	
};


/* Build prototype object of Calendar */
Calendar._objectFunctions = [ Calendar._utility , Calendar._architecture , Calendar._core ];
for ( var i =0; i< Calendar._objectFunctions.length ; i++)
	for ( var prop in Calendar._objectFunctions[i]  )
		Calendar.prototype[prop] = Calendar._objectFunctions[i][prop];

/**
 * Startup function ( when DOM is ready )
 */
Calendars =[];
Calendar._TAG = Calendar._TAGS[0];
Calendar._OPTION_TAG = Calendar._OPTION_TAGS[0];

Calendar._load=function( ev ){
	ev = ev || window.event;
	if ( ev && Calendar._loaded ) return this;
	var _calendars = document.getElementsByTagName( Calendar._TAG );
	for ( var i = _(calendars.length-1) ; i >= 0; i-- ){
		var _calendar = _calendars[i];
		var _cssClasses = _calendar.className.split(' ');
		if (  Calendar._contains (   _cssClasses , Calendar._css['calendar_element']  )   ){
			var _params = {};
			if ( Calendar._ie && Calendar._TAG == Calendar._TAGS[0] ){
				var __calendar = _calendar.nextSibling;
				while( __calendar.tagName != '/' + _calendar.tagName ){	
					if (  __calendar.tagName.toLowerCase() == Calendar._OPTION_TAGS[1].toLowerCase() ){
						_params[ __calendar.getAttribute('name')  ] = __calendar.getAttribute('value');
					}
					__calendar = __calendar.nextSibling
				}
			}else{

				_calendar.getOptions = _calendar.getElementsByTagName;
				var _options = _calendar.getOptions( Calendar._OPTION_TAG );
				for ( var j=0; j < _options.length; j++ ){
					_params[ _options[j].getAttribute('name')  ]   =   _options[j].getAttribute('value');
				}
			}
			_params['node'] = _calendar;

			Calendars.push( new Calendar( params ) );
		}
	}
	if ( ev ) Calendar._loaded = true;
};

/**
 * Parameter or Default settings
 */
Calendar._ie = ( document.attachEvent ) ? true : false;
Calendar._khtml = ( document.addEventListener ) ? true : false;


/**
 * Application functions
 */
Calendar._contains = function( array , element){
	for ( var i =0; i<array.length; i++)
		if ( array[i] === element )
			return true;
	return false;
}

Calendar._bind = function( fn , bind , parameters ){
	parameters = parameters || [];
	return function(){
		var _params = [];
		for ( var i = 0 ; i< parameters.length; i++ )
			_params.push( parameters[i] );
		for ( var i = 0 ; i< arguments.length; i++ )
			_params.push( arguments[i] );
		return fn.apply( bind , _params );
	};
};

Calendar._bindEvent = function( fn , bind , parameters ){
	return function( event){
		var params=[ event || window.event ];
		if ( parameters )
			for ( var i=0; i<parameters.length; i++)
				params.push( parameters[i] );
		return fn.apply( bind , params );
	};
};

Calendar._stopEvent = function ( ev ){
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
};


/**
 * Add a function in String class.
 * Return a trimed string
 */
String.prototype.trimed = function(){
	return this.replace( /^\s+|\s+$/g , '');
};

/*
 * 	Utility function for DOM
 */
Calendar._insertClass= function( element , cssClass ){
	if ( ! ( (' ' + element.className + ' ').indexOf( ' ' + cssClass + ' ')>-1 )  )
		element.className += ' ' + cssClass;
	return element;
};
Calendar._deleteClass = function( element , cssClass ){
	if ( (' ' + element.className + ' ').indexOf( ' ' + cssClass + ' ')>-1   )
		element.className = element.className.replace( new RegExp('(^|\\s)' + cssClass + '(?:\\s|$)'), '$1'  );
	return element;
};


Calendar._getToday = function( _format ){
	_format = _format || Calendar._DEFAULT_FORMAT;
	var _isShortYear = (( _format.indexOf( 'YYYY') == -1 ) && ( _format.indexOf('YY')!=-1 ) );
	
	var _date = Calendar._newDate();
	_date ={
		'DD': _date.getDate(),
		'MM': _date.getMonth()+1,
		'YYYY': _date.getFullYear()
	};
	
	_date.DD = (''+_date.DD).length < 2  ?  '0' + _date.DD : _date.DD;
	_date.MM = (''+_date.MM).length < 2  ?  '0' + _date.MM : _date.MM;
	_date.YYYY = ( _isShortYear ) ? (''+_date.YYYY).substring(2) : _date.YYYY;
	
	_format = _format.replace( 'DD' , _date.DD );
	_format = _format.replace( 'MM' , _date.MM );
	if ( _isShortYear ){
		_format = _format.replace( 'YY' , (''+_date.YYYY).substring(2) );
	}else
		_format = _format.replace( 'YYYY' , _date.YYYY );
	return _format;
};


Calendar._occurrencesOf= function( source , khar ){
	var result=0;
	for ( var i =0 ; i<source.length; i++)
		result += (  source.substring(i,i+1) == khar ) ? 1 : 0;
	return result;
};

Calendar._createElement = function(name, options){
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
};

/**
 * Reset the date
 * @param {Date} date
 */
Calendar._newDate=function(date){
	if ( !date ) date = new Date();
	date.setHours(0);
	date.setMilliseconds(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return date;
};


/**
 * Copy input date ( or today ) into new date object
 * @param {Object} date
 */
Calendar._copyDate = function( date ){
	var _date = Calendar._newDate();    
	_date.setMonth( date.getMonth() );
	_date.setDate( date.getDate() );          
	while ( true ){
	if ( date.getMonth() == _date.getMonth() )
	      break;
	var _day = 0;
	if ( date.getMonth() > _date.getMonth() )
	      _day =  + 1;
	else
	      _day = - 1;
	_date.setDate( _date.getDate() + _day );
	}
	_date.setDate( date.getDate() );    
	_date.setYear( date.getFullYear() );
	return _date;
};

/**	Attach an event on element
 * @param {Object} element
 * @param {String} typeEvent
 * @param {function} fn
 */
Calendar._attachEvent = function( element , typeEvent , fn ){
	if ( Calendar._ie )
		element.attachEvent( 'on' + typeEvent , fn );
	else if ( Calendar._khtml )
		element.addEventListener( typeEvent , fn , true );
	return element;
};

/**	Detach an event on element
 * @param {Object} element
 * @param {String} typeEvent
 * @param {function} fn
 */
Calendar._detachEvent = function( element , typeEvent , fn ){
	if ( Calendar._ie )
		element.detachEvent( 'on' + typeEvent , fn );
	else if ( Calendar._firefox )
		element.removeEventListener( typeEvent , fn , true );
	return element;
}

/**Reset properties: innerHTML, className and click event
 * 
 * @param {Object} HTMLElement
 * @param {function} fn
 */
Calendar._resetDay = function( td ){
	td.innerHTML = '';
	
	var classes = [ Calendar._css['selected'] , Calendar._css['disabled'] , Calendar._css['navigation'] ];
	for(var i =0; i<classes.length; i++)
		Calendar._deleteClass( td , classes[i] );
	
	if ( ! Calendar._ie ) td.onclick = undefined;
	else td.removeAttribute('onclick');
};

Calendar._splitApplicationParameters = function( parameters ){
	var obj = {};
	for (var i = 0; i < Calendar._applParams.length; i++) {
		obj[ Calendar._applParams[i] ]  = parameters[ Calendar._applParams[i] ];
		delete parameters[ Calendar._applParams[i] ];
	}
	return obj;
}
/**
 * Application parameters
 */

/*Action parameters*/
Calendar._applParams = ['format','min','max','start','disabled','draggable','language','node','onMonthLoad','onSelection','onErrorDate'];

/*Months splitted by language*/
Calendar._months = {
	'it':['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'	],
	'fr':['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre' ],
	'en':['January','February','March','April','May','June','July','August','September','October','November','December' ]
};

/*Days splitted by language*/
Calendar._days = {
	'it': ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
	'fr':['Lun','Mar','Mer','Jeu','Ven','Sam','Dim' ],
	'en':['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
};

/*CSS classes of elements*/
Calendar._css={
	'calendar_element':		'fde_calendar_wrapper',							// CSS class of wrapper element in HTML
	'calendar_elements':	'fde_calendar_inputs',						// CSS class of new DIV-container of input elements
	'calendar_text':		'fde_calendar_text',						// text in page
	'calendar_opener':		'fde_calendar_opener',						// element that open the calendar
	'calendar':				'fde_calendar_container',					// div container of calendar
	'table':				'fde_calendar_table',						// table of calendar
	'month_title':			'fde_calendar_month_name',					// name of month
	'day_title':			'fde_days_title',							// name of days
	'navigation':			'fde_calendar_navigation',					// calendar navigator
	'navigation_month':		'fde_calendar_navigation_month',			// span of month ( enable mouse-scroll event )
	'navigation_year':		'fde_calendar_navigation_year',				// span of year ( enable mouse-scroll event )
	'navigation_back_year':	'fde_calendar_navigation_back_year',		// back year step 1
	'navigation_back_month':'fde_calendar_navigation_back_month',		// back month step 1
	'navigation_next_month':'fde_calendar_navigation_next_month',		// next month step 1
	'navigation_next_year':	'fde_calendar_navigation_next_year',		// next year step 1
	'holiday':				'fde_calendar_holiday',						// holiday days
	'selected':				'fde_calendar_selected',					// preselected day
	'disabled':				'fde_calendar_disabled',					// a disabled element ( disabled event )
	'day':					'fde_calendar_day',							// every day
	'calendar_invisible':	'fde_calendar_container_hide',
	'calendar_notPresent':	'fde_calendar_container_notPresent'
};

if ( ! Calendar._ie ) {
	Calendar._attachEvent(window,'load',Calendar._load);
	Calendar._attachEvent(document,'DOMContentLoaded',Calendar._load);
}else{
	var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
	var id = 'calendar_ie_script_on_load';
	document.write(  '<script src="' + src + '" id="' + id + '" defer ><\/script>' );
	var calendar_ie_script = document.getElementById( id );
	calendar_ie_script.onreadystatechange = function(){
		if (this.readyState == 'complete')
			Calendar._load();
	}
}
