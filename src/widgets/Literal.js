/*****
*
*   Literal.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
Literal.prototype             = new DAGNode();
Literal.prototype.constructor = Literal;
Literal.superclass            = DAGNode.prototype;


/*****
*
*   class properties
*
*****/
Literal.VERSION = 1.0;
Literal.PADDING_TOP    = 4;
Literal.PADDING_BOTTOM = 4;
Literal.PADDING_LEFT   = 8;
Literal.PADDING_RIGHT  = 8;


/*****
*
*   constructor
*
*****/
function Literal(interface, owner) {
    if ( arguments.length > 0 ) this.init(interface, owner);
}


/*****
*
*   _createSVG
*
*****/
Literal.prototype._createSVG = function(parentNode) {
    // call superclass method
    Literal.superclass._createSVG.call(this, parentNode);
    
    // get root node
    var root = this.svgNodes.root;
    
    // create background and add to group
    this.svgNodes.background = createElement( "rect", { "class": "literal" } );
    root.appendChild( this.svgNodes.background );

    // create bar and add to group
    this.svgNodes.bar = createElement( "line", { "class": "literal-bar" } );
    root.appendChild( this.svgNodes.bar );

    // create text knockout and append to group
    this.svgNodes.knockout = createElement( "rect", { "class": "knockout" } );
    root.appendChild( this.svgNodes.knockout );

    // create label and add to group
    this.svgNodes.label = this._makeLabel();
    root.appendChild( this.svgNodes.label );

    // create mouse region and append to group
    this.svgNodes.mouseRegion = createElement( "rect", { "class": "mouseRegion" } );
    root.appendChild( this.svgNodes.mouseRegion );

    // update size and position
    this.updateSize();
    this.update();
};


/*****
*
*   _createEventListeners
*
*****/
Literal.prototype._createEventListeners = function() {
    var mouseRegion = this.svgNodes.mouseRegion;
    
    mouseRegion.addEventListener("mousedown", this, false);
};


/*****
*
*   _makeLabel
*
*****/
Literal.prototype._makeLabel = function() {
    var label = createElement(
        "text",
        { "class": "literal-label", "xml:space": "preserve" }
    );
    var lines = this.name.split(/[\r\n]/);

    this.svgNodes.label = label;
    for ( var i = 0; i < lines.length; i++ ) {
            this.addTspan(lines[i]);
    }

    return label;
};


/*****
*
*   getValue
*
*****/
Literal.prototype.getValue = function() {
    var result = "";
    var lines  = [];
    var node   = this.svgNodes.label.firstChild;

    while ( node ) {
        lines.push( node.firstChild.data );
        node = node.nextSibling;
    }
    
    return lines.join("\n");
};


/*****
*
*   _toXML
*
*****/
Literal.prototype._toXML = function(parent) {
    // call superclass method
    var node  = Element.superclass._toXML.call(this, parent);
    
    node.appendChild( svgDocument.createTextNode(this.getValue()) );

    return node;
};


/*****
*
*   _createXMLNode
*
*****/
Literal.prototype._createXMLNode = function() {
    return svgDocument.createElementNS(null, "literal");
};


/*****
*
*   update
*
*****/
Literal.prototype.update = function() {
    // update the literal's position
    var root = this.svgNodes.root;
    var bbox = this.svgNodes.label.getBBox();
    var tx   = this.x - bbox.x + Literal.PADDING_LEFT;
    var ty   = this.y - bbox.y + Literal.PADDING_TOP;
    
    root.setAttributeNS(
        null,
        "transform",
        "translate(" + tx + "," + ty + ")"
    );
    
    // call the superclass method
    Literal.superclass.update.call(this);
};


/*****
*
*   updateSize
*
*****/
Literal.prototype.updateSize = function() {
    var background  = this.svgNodes.background;
    var bar         = this.svgNodes.bar;
    var knockout    = this.svgNodes.knockout;
    var mouseRegion = this.svgNodes.mouseRegion;
    var labelBBox   = this.svgNodes.label.getBBox();
    
    // set width and height
    if ( labelBBox.width < 1 || labelBBox.height < 1 ) {
        // do nothing
    } else {
        this.width = labelBBox.width + Literal.PADDING_LEFT + Literal.PADDING_RIGHT;
        this.height = labelBBox.height + Literal.PADDING_TOP + Literal.PADDING_BOTTOM;

        // update background
        background.setAttributeNS(null, "x", labelBBox.x - Literal.PADDING_LEFT);
        background.setAttributeNS(null, "y", labelBBox.y - Literal.PADDING_TOP);
        background.setAttributeNS(null, "width",  this.width);
        background.setAttributeNS(null, "height", this.height);

        // update bar
        var x1 = labelBBox.x - Literal.PADDING_LEFT;
        var y  = labelBBox.y + labelBBox.height + Literal.PADDING_BOTTOM;
        var x2 = x1 + Literal.PADDING_LEFT + labelBBox.width + Literal.PADDING_RIGHT;
        bar.setAttributeNS(null, "x1", x1);
        bar.setAttributeNS(null, "y1", y);
        bar.setAttributeNS(null, "x2", x2);
        bar.setAttributeNS(null, "y2", y);

        // update knockout
        knockout.setAttributeNS(null, "x", labelBBox.x - 2);
        knockout.setAttributeNS(null, "y", labelBBox.y - 2);
        knockout.setAttributeNS(null, "width",  labelBBox.width  + 4);
        knockout.setAttributeNS(null, "height", labelBBox.height + 4);

        // update mouse region
        mouseRegion.setAttributeNS(null, "x", labelBBox.x - Literal.PADDING_LEFT);
        mouseRegion.setAttributeNS(null, "y", labelBBox.y - Literal.PADDING_TOP);
        mouseRegion.setAttributeNS(null, "width",  this.width);
        mouseRegion.setAttributeNS(null, "height", this.height);

        // update output port position
        if ( this.output != null ) {
            this.centerOutput();
            if ( this.output.hasEdges() ) {
                var edges = this.output.edges;

                for ( var i = 0; i < edges.length; i++ ) {
                    edges[i].updateInput();
                }
            }
        }
    }
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
Literal.prototype.select = function(value) {
    if ( this.selected != value ) {
        var node = this.svgNodes.background;

        if ( value ) {
            node.setAttributeNS(null, "class", "literal-selected");
            //this.addEventListener("keypress", this, false);
        } else {
            node.setAttributeNS(null, "class", "literal");
            //this.removeEventListener("keypress", this, false);
        }
        this.selected = value;
    }
};

/***** Event Handlers *****/

/*****
*
*   mousedown
*
*****/
Literal.prototype.mousedown = function(e) {
    if ( e.detail == 2 ) {
        this.owner.textbox = this;
        this.svgNodes.background.setAttributeNS(null, "class", "literal-editable");
    } else {
        // call superclass method
        Literal.superclass.mousedown.call(this, e);
    }
};


/*****
*
*   keypress
*
*****/
Literal.prototype.keypress = function(e) {
	var key = e.charCode;

	if ( key >= 32 && key <= 127 ) {
		this.addChar( String.fromCharCode(key) );
	} else if ( key == 8 ) {
		this.deleteChar();
	} else if ( key == 13 ) {
		this.addTspan("");
	} else {
		//alert(key);
	}

    e.stopPropagation();
};


/*****
*
*	addChar
*
*	Add a character to end of the current line
*	If the current line exceeds the width of the
*	textbox, then create a new line
*
*****/
Literal.prototype.addChar = function(char) {
	var textbox = this.svgNodes.label;

    // make sure our text box has at least one tspan
    if ( !textbox.hasChildNodes() ) this.addTspan("", 0);
    
    // get the last tspan's text node
	var tspan = textbox.lastChild;
    var data  = tspan.firstChild;

    // add text to the text node
    data.appendData(char);

    // update widget size
    this.updateSize();
};

/*****
*
*	deleteChar
*
*	Delete the last character of the last line
*	If a line is empty as a result, then remove
*	that line from the <text> element
*
*****/
Literal.prototype.deleteChar = function() {
	var textbox = this.svgNodes.label;

    // only delete if the textbox has child nodes
	if ( textbox.hasChildNodes() ) {
        // get the last line's text node's length
	    var tspan  = textbox.lastChild;
	    var data   = tspan.firstChild;
	    var length = data.length;

	    if ( length > 1 ) {
            // we have more than one character in the last line
            // remove the last character
	        data.deleteData(length-1, 1);
	    } else {
            // we have only one character
            // remove the tspan (line)
	        textbox.removeChild(tspan);
	    }

        // update widget size
        this.updateSize();
	}
};

/*****
*
*	addTspan
*
*	Used to add a new line to the textbox
*	Offset is an optional parameter which designates
*	the vertical offset of the new <tspan> element.
*	This was needed to handle the first <tspan> added
*	to the <text> element
*
*****/
Literal.prototype.addTspan = function(char) {
    var textbox = this.svgNodes.label;
    var offset  = "1em";

    if ( !textbox.hasChildNodes() ) offset = "0";

    // create new tspan
	var tspan = createElement(
        "tspan",
        { x: 0, dy: offset },
        char
    );

    // add line to textbox
	textbox.appendChild(tspan);
};

