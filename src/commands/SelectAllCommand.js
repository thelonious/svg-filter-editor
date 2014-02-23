/**
 *   SelectAllCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
SelectAllCommand.prototype             = new Command();
SelectAllCommand.prototype.constructor = SelectAllCommand;
SelectAllCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
SelectAllCommand.VERSION = 1.0;


/**
 *   constructor
 */
function SelectAllCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
SelectAllCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        this.owner.selectAll();
    }
};
