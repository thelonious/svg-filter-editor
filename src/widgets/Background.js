/*****
*
*   Background.js
*
*   copyright 2002, Kevin Lindsey
*
*****/


/*****
*
*   inheritance
*
*****/
Background.prototype             = new MouseRegion();
Background.prototype.constructor = Background;
Background.superclass            = MouseRegion.prototype;


/*****
*
*   class variables
*
*****/
Background.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function Background(owner) {
    if ( arguments.length > 0 )
        this.init("#background", MouseRegion.BOTTOM, owner);
}


/*****
*
*   init
*
*****/
Background.prototype.init = function(name, layer, owner) {
    // call superclass method
    Background.superclass.init.call(this, name, layer, owner);

    // init properties
    this.status = "untitled-1";
};


/*****
*
*   _createEventListeners
*
*****/
Background.prototype._createEventListeners = function() {
    this.addEventListener("mouseover", this, false);
    this.addEventListener("mousedown", this, false);
};


/*****
*
*   setStatus
*
*****/
Background.prototype.setStatus = function(text) {
    this.status = text;
    this.owner.infobar.setLabel( this.status );
};


/*****  Event handlers *****/

/*****
*
*   mouseover
*
*****/
Background.prototype.mouseover = function(e) {
    this.owner.infobar.setLabel( this.status );
};


/*****
*
*   mousedown
*
*****/
Background.prototype.mousedown = function(e) {
    if ( e.ctrlKey ) {
        // do nothing to allow zooming
    } else if ( e.altKey ) {
        // do nothing to allow panning
    } else {
        // NOTE: deselect unneeded for now.  See shiftKey comment above
        this.owner.deselectAll();
        if ( this.owner.port ) {
            this.owner.port.select(false);
            this.owner.port = null;
        }
        if ( this.owner.textbox ) {
            this.owner.textbox.select(false);
            this.owner.textbox = null;
        }
        this.owner.dragMarquee(e);
    }
};
