/*****
*
*   MouseRegion.js
*
*   copyright 2002, Kevin Lindsey
*
*****/


/*****
*
*   inheritance
*
*****/
MouseRegion.prototype             = new Widget();
MouseRegion.prototype.constructor = MouseRegion;
MouseRegion.superclass            = Widget.prototype;


/*****
*
*   class variables
*
*****/
MouseRegion.VERSION = 1.0;
MouseRegion.TOP     = 0;
MouseRegion.BOTTOM  = 1;


/*****
*
*   constructor
*
*****/
function MouseRegion(position, owner) {
    if ( arguments.length > 0 ) this.init("#mouseRegion", position, owner);
}


/*****
*
*   init
*
*****/
MouseRegion.prototype.init = function(name, position, owner) {
    // call superclass method
    MouseRegion.superclass.init.call(this, name, owner);

    this.position = position;
};


/*****
*
*   _createSVG
*
*****/
MouseRegion.prototype._createSVG = function(parentNode) {
    var rect = createElement(
        "rect",
        { width: "100%", height: "100%", "class": "mouseRegion" }
    );

    // store node
    this.svgNodes.root = rect;

    if ( this.position == MouseRegion.TOP ) {
        parentNode.appendChild(rect);
    } else if ( this.position == MouseRegion.BOTTOM ) {
        if ( parentNode.hasChildNodes() ) {
            parentNode.insertBefore( rect, parentNode.firstChild );
        } else {
            parentNode.appendChild(rect);
        }
    } else {
        throw "Unrecognized MouseRegion position: " + this.layer;
    }
};
