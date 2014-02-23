/**
 *   SaveCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
SaveCommand.prototype             = new Command();
SaveCommand.prototype.constructor = SaveCommand;
SaveCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
SaveCommand.VERSION = 1.0;


/**
 *   constructor
 */
function SaveCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
SaveCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        saveFile( [this.owner.createXML()] );
    }
};
