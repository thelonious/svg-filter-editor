/**
 *   DAGNode.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
DAGNode.prototype             = new Widget();
DAGNode.prototype.constructor = DAGNode;
DAGNode.superclass            = Widget.prototype;


/**
 *   class variables
 */
DAGNode.VERSION = 1.0;
DAGNode.counter = 1;


/**
 *   constructor
 */
function DAGNode(interface, owner) {
    if ( arguments.length > 0 ) {
        this.init(interface, owner);
    }
}


/**
 *   init
 */
DAGNode.prototype.init = function(interface, owner) {
    // call superclass method
    DAGNode.superclass.init.call(this, interface.label, owner);

    this.interface = interface;
    this.inputs    = new OrderedHash();
    this.output    = null;
    this.getId     = null;
};


/**
 *   dispose
 */
DAGNode.prototype.dispose = function() {
    // remove all input ports
    for ( var i = 0; i < this.inputs.getLength(); i++ ) {
        var port = this.inputs.getItem(i);

        if ( port != null ) {
            port.dispose();
        }
    }

    // remove output port
    if ( this.output != null ) {
        this.output.dispose();
    }

    // call superclass method
    DAGNode.superclass.dispose.call(this);
};


/**
 *   realize
 */
DAGNode.prototype.realize = function(parentNode) {
    // call superclass method
    DAGNode.superclass.realize.call(this, parentNode);

    for ( var i = 0; i < this.inputs.getLength(); i++ ) {
        this.inputs.getItem(i).realize(this.svgNodes.root);
    }
    this.distributeInputs();

    this._createOutputs();
};


/**
 *   _createEventListeners
 */
DAGNode.prototype._createEventListeners = function() {
    var mouseRegion = this.svgNodes.mouseRegion;
    
    mouseRegion.addEventListener("mousedown", this, false);
};


/**
 *   addInput
 */
DAGNode.prototype.addInput = function(name) {
    var root = this.svgNodes.root;
    var typeName = this.interface.getInputType(name);

    if ( typeName == null ) {
        throw "Unsupported input port name: " + name;
    }

    var type = this.owner.types[typeName];

    if ( type == null ) {
        throw "The " + name + " input port uses unknown type " + type;
    }

    var port = new Port(Port.INPUT, name, type, this, this.owner);
    
    this.inputs.setNamedItem(name, port);

    if ( root != null ) {
        port.realize(root);
        this.distributeInputs();
    }
};


/**
 *   distributeInputs
 */
DAGNode.prototype.distributeInputs = function() {
    var count = this.inputs.getLength();
    var bbox  = this.svgNodes.mouseRegion.getBBox();
    var step  = bbox.width / (count + 1);

    for ( var i = 0; i < count; i++ ) {
        var port = this.inputs.getItem(i);
        
        port.setAttribute("cx", bbox.x + i*step + step);
        port.setAttribute("cy", bbox.y - Port.RADIUS - 1);
    }
};


/**
 *   _createOutputs
 */
DAGNode.prototype._createOutputs = function() {
    var name;
    
    if ( this.constructor === Element ) {
        name = "result" + DAGNode.counter++;
    }
    else if ( this.constructor === Literal ) {
        name = this.name;
    }
    else {
        throw "Unknown DAGNode class in _createOutputs";
    }

    this.output = new Port(Port.OUTPUT, name, null, this, this.owner);
    this.centerOutput();
    this.output.realize( this.svgNodes.root );
};


/**
 *   centerOutput
 */
DAGNode.prototype.centerOutput = function() {
    if ( this.output != null ) {
        var bbox = this.svgNodes.mouseRegion.getBBox();
        var xmid = bbox.x + bbox.width/2;
        var y    = bbox.y + bbox.height;

        this.output.setAttribute("cx", xmid);
        this.output.setAttribute("cy", y + Port.RADIUS + 1);
    }
};


/**
 *   moveto
 */
DAGNode.prototype.moveto = function(x, y) {
    this.x = x;
    this.y = y;
    this.update();
};


/**
 *   rmoveto
 */
DAGNode.prototype.rmoveto = function(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.update();
};


/**
 *   update
 */
DAGNode.prototype.update = function() {
    for ( var i = 0; i < this.inputs.getLength(); i++ ) {
        var edge = this.inputs.getItem(i).edges[0];

        if ( edge != null ) {
            edge.updateOutput();
        }
    }

    if ( this.output != null ) {
        var edges = this.output.edges;

        for ( var i = 0; i < edges.length; i++ ) {
            var edge = edges[i];

            if ( edge != null ) {
                edge.updateInput();
            }
        }
    }
};


/**
 *   getValue
 */
DAGNode.prototype.getValue = function() {
    // abstract method
};


/**
 *   _toXML
 */
DAGNode.prototype._toXML = function(parent) {
    var node = this._createXMLNode();

    node.setAttributeNS(null, "id", this.getAttribute("id"));
    node.setAttributeNS(null, "x",  this.getAttribute("x"));
    node.setAttributeNS(null, "y",  this.getAttribute("y"));
    
    for ( var i = 0; i < this.inputs.getLength(); i++ ) {
        var input     = this.inputs.getItem(i);
        var inputNode = svgDocument.createElementNS(null, "input");
        var edge      = input.edges[0];

        inputNode.setAttributeNS(null, "name", input.name);
        node.appendChild(inputNode);
        
        if ( edge != null ) {
            var inputElem = edge.inPort.parent;
            var edgeNode  = svgDocument.createElementNS(null, "edge");

            edgeNode.setAttributeNS(null, "output", inputElem.getAttribute("id"));
            edgeNode.setAttributeNS(null, "input", this.getAttribute("id"));
            edgeNode.setAttributeNS(null, "name", input.name);

            parent.appendChild(edgeNode);
        }
    }

    return node;
};


/**
 *   _createXMLNode
 */
DAGNode.prototype._createXMLNode = function() {
    // abstract method
};


/** Event Handlers */

/**
 *   mousedown
 */
DAGNode.prototype.mousedown = function(e) {
    var owner = this.owner;

    if ( e.shiftKey ) {
        if ( this.selected ) {
            owner.deselectChild("nodes", this);
        }
        else {
            owner.selectChild("nodes", this);
            owner.dragSelection(e);
        }
    }
    else {
        if ( this.selected ) {
            owner.dragSelection(e);
        }
        else {
            owner.deselectAll("nodes");
            owner.selectChild("nodes", this);
            owner.dragSelection(e);
        }
    }
};
