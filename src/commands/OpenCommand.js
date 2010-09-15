/*****
*
*   OpenCommand.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
OpenCommand.prototype             = new Command();
OpenCommand.prototype.constructor = OpenCommand;
OpenCommand.superclass            = Command.prototype;


/*****
*
*   class variables
*
*****/
OpenCommand.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function OpenCommand(owner) {
    if ( arguments.length > 0 ) this.init(owner);
}


/*****
*
*   doit
*
*****/
OpenCommand.prototype.doit = function() {
    if ( browseButton != null ) {
        browseButton.click();
    }
};
