/**
 *   DumpAllCommand.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
DumpAllCommand.prototype             = new Command();
DumpAllCommand.prototype.constructor = DumpAllCommand;
DumpAllCommand.superclass            = Command.prototype;


/**
 *   class variables
 */
DumpAllCommand.VERSION = 1.0;


/**
 *   constructor
 */
function DumpAllCommand(owner) {
    if ( arguments.length > 0 ) {
        this.init(owner);
    }
}


/**
 *   doit
 */
DumpAllCommand.prototype.doit = function() {
    var tmpFile = currentFile;

    currentFile = "dump_all.xml";
    cleanTree( svgDocument.rootElement );
    formatTree( svgDocument.rootElement );
    saveFile( [svgDocument.rootElement] );
    currentFile = tmpFile;
};
