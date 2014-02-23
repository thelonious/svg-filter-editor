/**
 *   SaveAsCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
SaveAsCommand.prototype             = new Command();
SaveAsCommand.prototype.constructor = SaveAsCommand;
SaveAsCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
SaveAsCommand.VERSION = 1.0;


/**
 *   constructor
 */
function SaveAsCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
SaveAsCommand.prototype.doit = function() {
    if ( this.owner != null ) {
        var newName = prompt("Save File As...", currentFile);

        if ( newName != null && newName != "" ) {
            currentFile = newName;
            saveFile( [this.owner.createXML()] );
            this.owner.background.setStatus(newName);
        }
    }
};
