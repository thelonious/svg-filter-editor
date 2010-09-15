/*****
*
*   NewCommand.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
NewCommand.prototype             = new Command();
NewCommand.prototype.constructor = NewCommand;
NewCommand.superclass            = Command.prototype;


/*****
*
*   class variables
*
*****/
NewCommand.VERSION = 1.0;
NewCommand.COUNTER = 2;


/*****
*
*   constructor
*
*****/
function NewCommand(owner) {
    if ( arguments.length > 0 ) this.init(owner);
}


/*****
*
*   doit
*
*****/
NewCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        currentFile = "";
        this.owner.clearDocument();
        this.owner.clearScreen();
        this.owner.background.setStatus("untitled-" + NewCommand.COUNTER++);
    }
};
