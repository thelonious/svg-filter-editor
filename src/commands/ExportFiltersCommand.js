/*****
*
*   ExportFiltersCommand.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
ExportFiltersCommand.prototype             = new Command();
ExportFiltersCommand.prototype.constructor = ExportFiltersCommand;
ExportFiltersCommand.superclass            = Command.prototype;


/*****
*
*   class variables
*
*****/
ExportFiltersCommand.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function ExportFiltersCommand(owner) {
    if ( arguments.length > 0 ) this.init(owner);
}


/*****
*
*   doit
*
*****/
ExportFiltersCommand.prototype.doit = function() {
    var tmpFile = currentFile;
    var svgRoot = svgDocument.rootElement;

    if ( this.owner ) {
        var newName = prompt("Save File As...", currentFile);

        if ( newName != null && newName != "" ) {
            var cmd  = new ViewSVGCommand(this.owner);
            var defs = svgDocument.getElementsByTagNameNS(svgNS, "defs");

            if ( defs.length > 0 ) {
                defs = defs.item(0);

                currentFile = newName;
                cleanTree( defs );
                formatTree( defs );
                saveFile( [defs] );
                currentFile = tmpFile;
            } else {
                alert("Export Filters failed: no defs in document");
            }
        }
    }
};
