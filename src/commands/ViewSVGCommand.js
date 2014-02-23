/**
 *   ViewSVGCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
ViewSVGCommand.prototype             = new Command();
ViewSVGCommand.prototype.constructor = ViewSVGCommand;
ViewSVGCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
ViewSVGCommand.VERSION = 1.0;
ViewSVGCommand.COUNTER = 2;


/**
 *   constructor
 */
function ViewSVGCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
ViewSVGCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        this.owner.graphToSVG();
    }
};
