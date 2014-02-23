/**
 *   Command.js
 *
 *   copyright 2002, 2014 Kevin Lindsey
 */

/**
 *   class variables
 */
Command.VERSION = 1.0;


/**
 *   constructor
 */
function Command(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   init
 */
Command.prototype.init = function(owner) {
    this.owner = owner;
    this.doit();
};


/**
 *   doit
 */
Command.prototype.doit = function() {
    // abstract method
};


/**
 *   undo
 */
Command.prototype.undo = function() {
    // abstract method
};


/**
 *   redo
 */
Command.prototype.redo = function() {
    // abstract method
};
