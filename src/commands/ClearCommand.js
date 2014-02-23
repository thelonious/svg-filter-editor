/**
 *   ClearCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
ClearCommand.prototype             = new Command();
ClearCommand.prototype.constructor = ClearCommand;
ClearCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
ClearCommand.VERSION = 1.0;


/**
 *   constructor
 */
function ClearCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
ClearCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        this.owner.clearScreen();
    }
};
