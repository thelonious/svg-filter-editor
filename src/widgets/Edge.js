/**
 *   Edge.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   inheritance
 */
Edge.prototype             = new Widget();
Edge.prototype.constructor = Edge;
Edge.superclass            = Widget.prototype;


/**
 *   class variables
 */
Edge.VERSION = 1.0;


/**
 *   constructor
 */
function Edge(inPort, outPort, owner) {
    if ( arguments.length > 0 ) {
        this.init(inPort, outPort, owner);
    }
}


/**
 *   init
 */
Edge.prototype.init = function(inPort, outPort, owner) {
    // call superclass method
    Edge.superclass.init.call(this, "#edge", owner);

    // init properites
    this.inPort  = inPort;
    this.outPort = outPort;

    // associate this edge with i/o ports
    inPort.edges.push(this);
    outPort.edges.push(this);
};


/**
 *   dispose
 */
Edge.prototype.dispose = function(port) {
    var root = this.svgNodes.root;
    
    // Remove from DOM and clear node reference
    root.parentNode.removeChild(root);
    this.svgNodes.root = null;
    
    if ( port === this.inPort ) {
        this.outPort.removeEdge(this);
    }
    else if ( port === this.outPort ) {
        this.inPort.removeEdge(this);
    }
    else {
        throw "Edge does not contain referenced Port";
    }
    
    // clear element references
    this.inPort  = null;
    this.outPort = null;
};


/**
 *   _createSVG
 */
Edge.prototype._createSVG = function(parentNode) {
    this.svgNodes.root = createElement( "line", { "class": "edge" } );
    this.update();
    parentNode.appendChild( this.svgNodes.root );
};


/**
 *   getValue
 */
Edge.prototype.getValue = function() {
    var result = this.inPort.getValue();

    this.inPort.genId = this.owner.genId;

    return result;
};


/**
 *   getNode
 */
Edge.prototype.getNode = function(filterNode) {
    var result = this.inPort.getNode(filterNode);

    this.inPort.genId = this.owner.genId;

    return result;
};


/**
 *   getInputNode
 */
Edge.prototype.getInputNode = function() {
    return this.inPort.parent;
};


/**
 *   getOutputName
 */
Edge.prototype.getOutputName = function() {
    return this.inPort.name;
};


/**
 *   getOutputGenId
 */
Edge.prototype.getOutputGenId = function() {
    return this.inPort.genId;
};


/**
 *   update
 */
Edge.prototype.update = function() {
    this.updateInput();
    this.updateOutput();
};


/**
 *   updateInput
 */
Edge.prototype.updateInput = function() {
    var root = this.svgNodes.root;
    var p1   = this.inPort.getUserCoordinate();

    root.setAttributeNS(null, "x1", p1.x);
    root.setAttributeNS(null, "y1", p1.y);
};


/**
 *   updateOutput
 */
Edge.prototype.updateOutput = function() {
    var root = this.svgNodes.root;
    var p2   = this.outPort.getUserCoordinate();

    root.setAttributeNS(null, "x2", p2.x);
    root.setAttributeNS(null, "y2", p2.y);
};

