/*****
*
*   Element.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
Element.prototype             = new DAGNode();
Element.prototype.constructor = Element;
Element.superclass            = DAGNode.prototype;


/*****
*
*   class properties
*
*****/
Element.VERSION        = 1.0;
Element.PADDING_TOP    = 4;
Element.PADDING_BOTTOM = 4;
Element.PADDING_LEFT   = 15;
Element.PADDING_RIGHT  = 15;


/*****
*
*   constructor
*
*****/
function Element(interface, owner) {
    if ( arguments.length > 0 ) this.init(interface, owner);
}


/*****
*
*   _createSVG
*
*****/
Element.prototype._createSVG = function(parentNode) {
    // call superclass method
    Element.superclass._createSVG.call(this, parentNode);
    
    var root = this.svgNodes.root;
    var labelBBox;
    var tx, ty;
    
    this.svgNodes.label = createElement(
        "text", { "class": "element-label" }, this.name);
    labelBBox = this.svgNodes.label.getBBox();

    // set width and height
    this.width  = labelBBox.width  + Element.PADDING_LEFT + Element.PADDING_RIGHT;
    this.height = labelBBox.height + Element.PADDING_TOP  + Element.PADDING_BOTTOM;

    // create background and add to group
    this.svgNodes.background = createElement(
        "rect",
        {
            x: labelBBox.x - Element.PADDING_LEFT,
            y: labelBBox.y - Element.PADDING_TOP,
            rx: 3, ry: 3,
            width: this.width, height: this.height,
            "class": "element"
        }
    );
    root.appendChild( this.svgNodes.background );

    // create text knockout and append to group
    root.appendChild(
        createElement(
            "rect",
            {
                x: labelBBox.x - 2,
                y: labelBBox.y - 2,
                rx: 3, ry: 3,
                width: labelBBox.width  + 4,
                height: labelBBox.height + 4,
                "class": "knockout"
            }
        )
    );

    // add text to group
    root.appendChild( this.svgNodes.label );

    // create mouse region and append to group
    this.svgNodes.mouseRegion = createElement(
        "rect",
        {
            x: labelBBox.x - Element.PADDING_LEFT,
            y: labelBBox.y - Element.PADDING_TOP,
            rx: 3, ry: 3,
            width: this.width, height: this.height,
            "class": "mouseRegion"
        }
    );
    root.appendChild( this.svgNodes.mouseRegion );

    // update position
    this.update();
};


/*****
*
*   update
*
*****/
Element.prototype.update = function() {
    // update the element's position
    var root = this.svgNodes.root;
    var bbox = this.svgNodes.label.getBBox();
    var tx   = this.x - bbox.x + Element.PADDING_LEFT;
    var ty   = this.y - bbox.y + Element.PADDING_TOP;

    root.setAttributeNS(
        null,
        "transform",
        "translate(" + tx + "," + ty + ")"
    );

    // call superclass method
    Element.superclass.update.call(this);
};


/*****
*
*   toXML
*
*****/
Element.prototype.toXML = function(filterNode) {
    var node = svgDocument.createElementNS(svgNS, this.interface.name);

    if ( filterNode == null ) filterNode = node;

    for ( var j = 0; j < this.inputs.getLength(); j++ ) {
        this.inputs.getItem(j).toXML(filterNode, node);
    }

    return node;
};


/*****
*
*   _toXML
*
*****/
Element.prototype._toXML = function(parent) {
    // call superclass method
    var node = Element.superclass._toXML.call(this, parent);

    node.setAttributeNS(null, "type", this.interface.name);

    // create an output node
    if ( this.output ) {
        var outputNode = svgDocument.createElementNS(null, "output");

        outputNode.setAttributeNS(null, "name", this.output.name);
        node.appendChild(outputNode);
    }

    return node;
};


/*****
*
*   _createXMLNode
*
*****/
Element.prototype._createXMLNode = function() {
    return svgDocument.createElementNS(null, "element");
};


/*****
*
*   event handlers
*
*****/

/*****
*
*   select
*
*****/
Element.prototype.select = function(value) {
    if ( this.selected != value ) {
        var node = this.svgNodes.background;

        if ( value ) {
            node.setAttributeNS(null, "class", "element-selected");
        } else {
            node.setAttributeNS(null, "class", "element");
        }
        this.selected = value;
    }
};
