

var Menu = new Class({
	'options':{
		'contextMenu': true
	},
	'initialize': function( options ){
		
		this.options = $merge( this.options , options );
		
		this.menu = new Element( 'div' , {'class':'menu'});
		
		this.menu = this.buildMenu( null , this.options.menu );
		
		if (this.options.contextMenu) 
			document.addEvent( 'contextmenu' , this.contextMenu.bindAsEventListener(this) );
		
		
		document.addEvent('mousedown' , this.hide.bind( this , [ this.menu , true ] ) );
		return this;
	},
	
	/*
		 menu : {
			'item1':{
				'text':'Text 1',
				'submenu':{
					'item1-1':{
						'text':'Text 1 - 1'
					},
					'item1-2':{
						'text':'Text 1 - 2'
					},
					'item1-3':{
						'text':'Text 1 - 3',
						'submenu':{
							'item1-3-1':{
								'text':'Text 1 - 3 - 1'
							}
						}
					}
				}
			},
			'item2':{
				'text':'Text 2',
				'submenu':{
					'item2-1':{
						'text':'Text 2 - 1'
					},
					'item2-2':{
						'text':'Text 2 - 2'
					}
				}
			}
		 }
	 */
	'buildMenu':function( parent , menu ){
		if ( ! menu ) return undefined;
		var _isMenu = false;
		for ( var prop in menu ){
			var item = menu[ prop ];
			var menuItem = new Element( 'div' , {'class':'menuItem'});
			menuItem.key = prop;
			menuItem.setHTML( item.text || '&nbsp;' );
			menuItem.addEvents({
				'mouseover': this.mouseOver.bindAsEventListener( this , [ menuItem ] ),
				'click': this.click.bindAsEventListener( this , [ menuItem ] )
			});
			menuItem.submenu = this.buildMenu( null , item.submenu );
			
			parent = parent || new Element( 'div' , {'class':'menu'});
			
			parent.subitems = parent.subitems || [];
			parent.submenus = parent.submenus || [];
			if ( menuItem ) 		parent.subitems.push( menuItem );
			if ( menuItem.submenu ) parent.submenus.push( menuItem.submenu )
			
			menuItem.parentMenu = parent;
			menuItem.inject( parent );
			
			_isMenu = true;
		}
		return ( _isMenu ) ? parent : undefined ;
	},
	
	
	'contextMenu': function( ev ){
		var event = new Event( ev );
		
		this.showMenu( {'top':event.page.y,'left':event.page.x} );
		
		event.stop();
	},
	
	'showMenu': function( position , menu ){
		menu = menu || this.menu;
		if ( ! menu.isLoaded )
			menu.inject( document.body );
			
		menu.setStyles( position );
		
		menu.setStyle( 'display' , 'block' );
		
	},
	
	'mouseOver':function( ev , menuItem ){
		
		if ( menuItem.parentMenu.submenus )
			for ( var i = 0 ; i < menuItem.parentMenu.submenus.length ; i++ )
				this.hide( menuItem.parentMenu.submenus[i] , true );
		
		if ( ! $defined( menuItem.submenu ) ) return;
		var coord = $(menuItem).getCoordinates();
		this.showMenu( {
			'top': coord.top,
			'left': coord.left + coord.width
		} , menuItem.submenu );
	},
	
	'click':function( ev , menuItem ){
		if ( $type(this.options.onClick) == 'function' )
			return this.options.onClick( menuItem , menuItem.parentMenu , menuItem.key , this );
	},
	
	
	'hide': function( menu , submenu ){
		
		if ( ! menu ) return;
		menu.setStyles({
			'display' : '',
			'top':'',
			'left':''
		});
		
		if ( submenu && menu.submenus )
			for ( var i = 0 ; i < menu.submenus.length ; i++ )
				this.hide( menu.submenus[i] , true );
		
		return true;
		
	}
	
})
