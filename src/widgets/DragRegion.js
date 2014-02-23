/**
 *   DragRegion.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
DragRegion.prototype             = new MouseRegion();
DragRegion.prototype.constructor = DragRegion;
DragRegion.superclass            = MouseRegion.prototype;


/**
 *   class variables
 */
DragRegion.VERSION = 1.0;


/**
 *   constructor
 */
function DragRegion(position, owner) {
    if ( arguments.length > 0 ) {
        this.init("#dragRegion", position, owner);
    }
}


/**
 *   init
 */
DragRegion.prototype.init = function(name, position, owner) {
    // call superclass method
    DragRegion.superclass.init.call(this, name, position, owner);

    // init properties;
    this.handlers = {};
    this.startX   = null;
    this.startY   = null;
    this.lastX    = null;
    this.lastY    = null;
};


/**
 *   addEventListener
 */
DragRegion.prototype.addEventListener = function(type, handler, captures) {
    if ( this.handlers[type] == null ) {
        this.handlers[type] = [];
    }
        
    this.handlers[type].push(handler);
};


/**
 *   removeEventListener
 */
DragRegion.prototype.removeEventListener = function(type, handler, captures) {
    var handlers = this.handlers[type];

    if ( handlers == null ) {
        throw "No events of this type or registered with this dragger: " + type;
    }

    for ( var i = 0; i < handlers.length; i++ ) {
        if ( handlers[i] === handler ) {
            handlers.splice(i, 1);
            break;
        }
    }
};


/**
 *   beginDrag
 */
DragRegion.prototype.beginDrag = function(e) {
    // save the start and current point
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX  = e.clientX;
    this.lastY  = e.clientY;

    // add event handlers to foreground
    DragRegion.superclass.addEventListener.call(this, "mousemove", this, false);
    DragRegion.superclass.addEventListener.call(this, "mouseup",   this, false);

    // bring mouseRegion to front (should this be here?)
    this.bringToFront();

    // display mouseRegion to capture events
    this.show();

    // send dragbegin
    this.sendEvent(e, "dragbegin");
};


/**
 *   mousemove
 */
DragRegion.prototype.mousemove = function(e) {
    this.sendEvent(e, "drag");
};


/**
 *   mouseup
 */
DragRegion.prototype.mouseup = function(e) {
    // send event (forced)
    this.sendEvent(e, "dragend");
    
    // remove event listeners
    DragRegion.superclass.removeEventListener.call(this, "mousemove", this, false);
    DragRegion.superclass.removeEventListener.call(this, "mouseup",   this, false);

    // hide foreground to disable event processing
    this.hide();
};


/**
 *   sendEvent
 */
DragRegion.prototype.sendEvent = function(e, type) {
    var handlers = this.handlers[type];
    
    if ( handlers != null ) {
        var event = new DragEvent(e, type);

        event.startX = this.startX;
        event.startY = this.startY;
        event.lastX  = this.lastX;
        event.lastY  = this.lastY;

        for ( var i = 0; i < handlers.length; i++ ) {
            handlers[i].handleEvent(event);
        }
        
        // update lastPoint
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }
};

