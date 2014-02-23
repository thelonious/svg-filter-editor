/**
 *   Console.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
Console.prototype             = new Widget();
Console.prototype.constructor = Console;
Console.superclass            = Widget.prototype;

/**
 *   class variables
 */
Console.VERSION = 1.0;


/**
 *   constructor
 */
function Console(owner) {
    if ( arguments.length > 0 ) {
        this.init("#console", owner);
    }
}


/**
 *   _createSVG
 */
Console.prototype._createSVG = function(parentNode) {
    // create text and init properties
    this.svgNodes.root = createElement(
        "text", { "class": "console" }
    );
    this.svgNodes.root.setAttributeNS(xmlNS, "xml:space", "preserve");

    // append text to group
    parentNode.appendChild( this.svgNodes.root );

    // position text
    this.update();
};


/**
 *   addLine
 */
Console.prototype.addLine = function(line) {
    var text  = this.svgNodes.root;
    var tspan = svgDocument.createElementNS(svgNS, "tspan");
    var tnode = svgDocument.createTextNode(line);

    tspan.setAttributeNS(null, "x", "0");
    tspan.setAttributeNS(null, "dy", "1em");

    tspan.appendChild(tnode);
    text.appendChild(tspan);
};


/**
 *   clear
 */
Console.prototype.clear = function() {
    var text  = this.svgNodes.root;

    while ( text.firstChild ) {
        text.removeChild(text.firstChild);
    }
};
