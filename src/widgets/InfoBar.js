/*****
*
*   InfoBar.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
InfoBar.prototype             = new Widget();
InfoBar.prototype.constructor = InfoBar;
InfoBar.superclass            = Widget.prototype;


/*****
*
*   class variables
*
*****/
InfoBar.VERSION = 1.0;
InfoBar.PADDING_LEFT   = 3;
InfoBar.PADDING_TOP    = 3;
InfoBar.PADDING_BOTTOM = 3;


/*****
*
*   constructor
*
*****/
function InfoBar(name, owner) {
    if ( arguments.length > 0 ) this.init(name, owner);
}


/*****
*
*   _createSVG
*
*****/
InfoBar.prototype._createSVG = function(parentNode) {
    // call superclass method
    InfoBar.superclass._createSVG.call(this, parentNode);
    
    var root = this.svgNodes.root;
    var parentSize = { width: innerWidth, height: innerHeight };
    //var parentSize = this.getParentSize();
    var bbox;
    var tx, ty;

    this.svgNodes.label = this._makeLabel();
    bbox = this.svgNodes.label.getBBox();

    // create background and add to group
    this.svgNodes.background = createElement(
        "rect",
        {
            x: bbox.x - InfoBar.PADDING_LEFT,
            y: bbox.y - InfoBar.PADDING_TOP,
            width: parentSize.width,
            height: bbox.height + InfoBar.PADDING_TOP  + InfoBar.PADDING_BOTTOM,
            "class": "infobar"
        }
    );
    root.appendChild( this.svgNodes.background );

    // add text to group
    root.appendChild( this.svgNodes.label );

    // Calculate translation to place infobar at bottom of window
    tx = InfoBar.PADDING_LEFT - bbox.x;
    ty = parentSize.height - bbox.y - (bbox.height + InfoBar.PADDING_BOTTOM);

    root.setAttributeNS(
        null,
        "transform",
        "translate(" + tx + "," + ty + ")"
    );
};


/*****
*
*   _createEventListeners
*
*****/
InfoBar.prototype._createEventListeners = function() {
    svgDocument.rootElement.addEventListener("SVGResize", this, false);
};


/*****
*
*   _makeLabel
*
*****/
InfoBar.prototype._makeLabel = function() {
    var text  = svgDocument.createElementNS(svgNS, "text");
    var tnode = svgDocument.createTextNode(this.name);

    text.setAttributeNS(null, "pointer-events", "none");
    text.setAttributeNS(null, "class", "infobar-label");
    text.appendChild(tnode);

    return text;
};


/*****
*
*   SVGResize
*
*****/
InfoBar.prototype.SVGResize = function(e) {
    var root = this.svgNodes.root;
    var rect = this.svgNodes.background;
    var bbox = this.svgNodes.label.getBBox();
    var parentSize = { width: innerWidth, height: innerHeight };
    //var parentSize = this.getParentSize();
    var tx, ty;

    rect.setAttributeNS(null, "width", parentSize.width);

    tx = InfoBar.PADDING_LEFT - bbox.x;
    ty = parentSize.height - bbox.y - (bbox.height + InfoBar.PADDING_BOTTOM);
    root.setAttributeNS(
        null,
        "transform",
        "translate(" + tx + "," + ty + ")"
    );
};


/*****
*
*   get/set methods
*
*****/
InfoBar.prototype.setLabel = function(text) {
    var label = this.svgNodes.label;

    if ( label ) {
        label.firstChild.data = text;
    }
};

