/**
 *   MenuBar.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
MenuBar.prototype             = new Widget();
MenuBar.prototype.constructor = MenuBar;
MenuBar.superclass            = Widget.prototype;


/**
 *   class variables
 */
MenuBar.VERSION = 1.0;


/**
 *   constructor
 */
function MenuBar(name, owner) {
    if ( arguments.length > 0 ) {
        this.init(name, owner);
    }
}


/**
 *   init
 */
MenuBar.prototype.init = function(name, owner) {
    // call superclass method
    MenuBar.superclass.init.call(this, name, owner);

    // init properties
    this.menuItems       = [];
    this.currentMenuItem = null;
};


/**
 *   _createSVG
 */
MenuBar.prototype._createSVG = function(parentNode) {
    // call superclass method
    MenuBar.superclass._createSVG.call(this, parentNode);
    
    var root = this.svgNodes.root;
    var parentSize = { width: innerWidth, height: innerHeight };

    // create background and add to group
    this.svgNodes.background = createElement(
        "rect",
        {
            width: parentSize.width, height: 15,
            "class": "menubar"
        }
    );
    root.appendChild( this.svgNodes.background );

    // Calculate translation to place infobar at bottom of window
    root.setAttributeNS(
        null,
        "transform",
        "translate(" + this.x + "," + this.y + ")"
    );
};


/**
 *   _createEventListeners
 */
MenuBar.prototype._createEventListeners = function() {
    svgDocument.rootElement.addEventListener("SVGResize", this, false);
    this.addEventListener("mousedown", this, false);
};


/**
 *   _updateHeight
 */
MenuBar.prototype._updateHeight = function() {
    if ( this.svgNodes.root != null ) {
        var height = 0;

        for ( var i = 0; i < this.menuItems.length; i++ ) {
            var miHeight = this.menuItems[i]._getHeight();
            
            if ( miHeight > height ) {
                height = miHeight;
            }
        }

        this.svgNodes.background.setAttributeNS(null, "height", height);
    }
};


/**
 *   addMenuItem
 */
MenuBar.prototype.addMenuItem = function(name, callback, items) {
    var mi = new MenuItem(name, null, this, this.owner);
    var x;

    if ( this.menuItems.length == 0 ) {
        x = MenuItem.PADDING_LEFT;
    }
    else {
        var lastMenuItem = this.menuItems[this.menuItems.length-1];

        x = lastMenuItem.getAttribute("x");
        x += lastMenuItem.getAttribute("width");
        x += MenuItem.PADDING_RIGHT;
    }

    mi.setAttribute("x", x);
    this.menuItems.push(mi);
    mi.realize( this.svgNodes.root );
    mi.svgNodes.root.setAttributeNS(null, "display", "inline");
    this._updateHeight();

    if ( items != null ) {
        for ( var i = 0; i < items.length; i++ ) {
            mi.addMenuItem(items[i], callback);
        }
    }
};


/**
 *   selectItem
 */
MenuBar.prototype.selectItem = function(menuItem) {
    if ( this.currentMenuItem != null ) this.currentMenuItem.select(false);

    if ( this.currentMenuItem == menuItem ) {
        menuItem.select(false);
        this.currentMenuItem = null;
    }
    else {
        this.currentMenuItem = menuItem;
        this.currentMenuItem.select(true);
    }
};


/** Event Handlers */

/**
 *   mousedown
 */
MenuBar.prototype.mousedown = function(e) {
    if ( this.currentMenuItem != null ) {
        this.currentMenuItem.select(false);
        this.currentMenuItem = null;
    }
};


/**
 *   SVGResize
 */
MenuBar.prototype.SVGResize = function(e) {
    var rect = this.svgNodes.background;
    var parentSize = { width: innerWidth, height: innerHeight };

    rect.setAttributeNS(null, "width", parentSize.width);
};
