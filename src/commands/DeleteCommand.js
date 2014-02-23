/**
 *   DeleteCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
DeleteCommand.prototype             = new Command();
DeleteCommand.prototype.constructor = DeleteCommand;
DeleteCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
DeleteCommand.VERSION = 1.0;


/**
 *   constructor
 */
function DeleteCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
DeleteCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        this.owner.deleteSelection("nodes");
    }
};
