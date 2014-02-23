/**
 *   DragEvent.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   class variables
 */
DragEvent.VERSION = 1.0;


/**
 *   constructor
 */
function DragEvent(e, type) {
    if ( arguments.length > 0 ) {
        this.init(e, type);
    }
}


/**
 *   init
 */
DragEvent.prototype.init = function(e, type) {
    for ( var p in e ) {
        this[p] = e[p];
    }

    this.type   = type;
    this.startX = null;
    this.startY = null;
    this.lastX  = null;
    this.lastY  = null;
};
