/**
 *   MoveSelectionCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
MoveSelectionCommand.prototype             = new Command();
MoveSelectionCommand.prototype.constructor = MoveSelectionCommand;
MoveSelectionCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
MoveSelectionCommand.VERSION = 1.0;


/**
 *   constructor
 */
function MoveSelectionCommand(owner, name, dx, dy) {
    if ( arguments.length > 0 ) {
        this.init(owner, name, dx, dy);
    }
}


/**
 *   init
 */
MoveSelectionCommand.prototype.init = function(owner, name, dx, dy) {
    // set properties
    // NOTE: we have to do this before calling the superclass since the
    // superclass immediately invokes doit()
    this.name = name;
    this.dx   = dx;
    this.dy   = dy;

    // call the superclass method
    MoveSelectionCommand.superclass.init.call(this, owner);
};


/**
 *   doit
 */
MoveSelectionCommand.prototype.doit = function() {
    var dx = this.dx;
    var dy = this.dy;

    if ( this.owner != null ) {
        this.owner.selections[this.name].foreachChild(
            function(node) { node.rmoveto(dx, dy) }
        );
    }
};
