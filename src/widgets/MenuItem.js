/**
 *   MenuItem.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
MenuItem.prototype             = new Widget();
MenuItem.prototype.constructor = MenuItem;
MenuItem.superclass            = Widget.prototype;


/**
 *   class variables
 */
MenuItem.VERSION = 1.0;
MenuItem.PADDING_LEFT  = 5;
MenuItem.PADDING_RIGHT = 5;


/**
 *   constructor
 */
function MenuItem(name, callback, parent, owner) {
    if ( arguments.length > 0 ) {
        this.init(name, callback, parent, owner);
    }
}


/**
 *   init
 */
MenuItem.prototype.init = function(name, callback, parent, owner) {
    // call superclass method
    MenuItem.superclass.init.call(this, name, owner);

    // init properties
    this.callback        = callback;
    this.parent          = parent;
    this.menuItems       = [];
    this.currentMenuItem = null;
};


/**
 *   _createSVG
 */
MenuItem.prototype._createSVG = function(parentNode) {
    // call superclass method
    MenuItem.superclass._createSVG.call(this, parentNode);

    // get root node
    var root = this.svgNodes.root;

    // hide this menu item by default
    root.setAttributeNS(null, "display", "none");

    // create the label and get its bbox
    this.svgNodes.label = createElement(
        "text",
        {
            x: MenuItem.PADDING_LEFT,
            y: "1em",
            "class": "menuitem-label"
        },
        this.name
    );
    // NOTE: we have to add the label here to get a valid bbox
    root.appendChild( this.svgNodes.label );
    var bbox = this.svgNodes.label.getBBox();
    
    // set width based on bbox
    this.width = bbox.width + MenuItem.PADDING_LEFT + MenuItem.PADDING_RIGHT;

    // create background and add to group
    this.svgNodes.background = createElement(
        "rect",
        {
            width: this.width, height: "1.4em",
            "class": "menuitem"
        }
    );
    root.appendChild( this.svgNodes.background );

    // add text to group again to put it in the correct z-order
    root.appendChild( this.svgNodes.label );

    // create mouse region and add to group
    this.svgNodes.mouseRegion = createElement(
        "rect",
        {
            width: this.width, height: "1.4em",
            "class": "mouseRegion"
        }
    );
    root.appendChild( this.svgNodes.mouseRegion );

    // create menuItems and adjust widths to match
    for ( var i = 0; i < this.menuItems.length; i++ ) {
        this.menuItems[i].realize(root);
    }
    this._adjustWidths();
    
    // update position
    this.update();
};


/**
 *   _createEventListeners
 */
MenuItem.prototype._createEventListeners = function () {
    var node = this.svgNodes.mouseRegion;

    node.addEventListener("mousedown", this, false);
};


/**
 *   _getHeight
 */
MenuItem.prototype._getHeight = function() {
    var result = 0;
    
    if ( this.svgNodes.root != null ) {
        result = this.svgNodes.background.getBBox().height;
    }

    return result;
};


/**
 *   _adjustWidths
 */
MenuItem.prototype._adjustWidths = function() {
    var maxWidth = 0;

    for ( var i = 0; i < this.menuItems.length; i++ ) {
        var width = this.menuItems[i].getAttribute("width");

        if ( width > maxWidth) {
            maxWidth = width;
        }
    }

    for ( var i = 0; i < this.menuItems.length; i++ ) {
        this.menuItems[i].setAttribute("width", maxWidth);
    }
};


/**
 *   addMenuItem
 */
MenuItem.prototype.addMenuItem = function(name, callback) {
    var mi = new MenuItem(name, callback, this, this.owner);
    var height;

    if ( this.menuItems.length == 0 ) {
        height = this._getHeight();
    }
    else {
        var lastMenuItem = this.menuItems[this.menuItems.length-1];

        height = lastMenuItem.getAttribute("y");
        height += lastMenuItem._getHeight();
    }

    mi.setAttribute("x", 0);
    mi.setAttribute("y", height);
    this.menuItems.push(mi);

    if ( this.svgNodes.root != null ) {
        mi.realize( this.svgNodes.root );
        this._adjustWidths();
    }
};


/**
 *   selectItem
 */
MenuItem.prototype.selectItem = function(menuItem) {
    if ( this.currentMenuItem != null ) {
        this.currentMenuItem.select(false);
    }

    if ( menuItem.callback ) {
        menuItem.callback.handleEvent(
            { type: "menuselect", target: menuItem }
        );
        this.parent.selectItem(this);
    }
    else {
        menuItem.select(true);
        this.currentMenuItem = menuItem;
    }
};


/** Event Handlers */

/**
 *   mousedown
 */
MenuItem.prototype.mousedown = function(e) {
    this.parent.selectItem(this);
    e.stopPropagation();
};


/**
 *   select
 */
MenuItem.prototype.select = function(value) {
    if ( this.selected != value ) {
        var node = this.svgNodes.background;

        if ( value ) {
            node.setAttributeNS(null, "class", "menuitem-selected");
        }
        else {
            node.setAttributeNS(null, "class", "menuitem");
        }
        this.selected = value;

        if ( this.currentMenuItem != null ) {
            this.currentMenuItem.select(false);
        }

        var display = ( value ) ? "inline" : "none";
        for ( var i = 0; i < this.menuItems.length; i++ ) {
            this.menuItems[i].svgNodes.root.setAttributeNS(null, "display", display);
        }
    }
};


/**
 *   _set_width
 */
MenuItem.prototype._set_width = function(value) {
    if ( this.svgNodes.root != null ) {
        this.svgNodes.background.setAttribute("width", value);
        this.svgNodes.mouseRegion.setAttribute("width", value);
    }
};

