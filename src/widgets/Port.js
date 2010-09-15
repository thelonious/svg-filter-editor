/*****
*
*   Port.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
Port.prototype             = new Widget();
Port.prototype.constructor = Port;
Port.superclass            = Widget.prototype;


/*****
*
*   class properties
*
*****/
Port.VERSION = 1.0;
Port.RADIUS = 2;
Port.INPUT  = 0;
Port.OUTPUT = 1;


/*****
*
*   Constructor
*
*****/
function Port(inOrOut, name, type, parent, owner) {
    if ( arguments.length > 0 ) this.init(inOrOut, name, type, parent, owner);
}


/*****
*
*   init
*
*****/
Port.prototype.init = function(inOrOut, name, type, parent, owner) {
    // call superclass method
    Port.superclass.init.call(this, name, owner);

    this.inOrOut = inOrOut;
    this.type    = type;
    this.cx      = 0;
    this.cy      = 0;
    this.parent  = parent;
    this.edges   = [];
    this.genId   = null;
};


/*****
*
*   dispose
*
*****/
Port.prototype.dispose = function() {
    // remove all edges attached to this port
    for ( var i = 0; i < this.edges.length; i++ ) {
        this.edges[i].dispose(this);
    }

    // call superclass method
    Port.superclass.dispose.call(this);
};


/*****
*
*   _createSVG
*
*****/
Port.prototype._createSVG = function(parentNode) {
    var circle = createElement(
        "circle",
        {
            cx: this.cx,
            cy: this.cy,
            r: Port.RADIUS,
            "class": "port"
        }
    );

    parentNode.appendChild(circle);

    // Remember SVG Node for later
    this.svgNodes.root = circle;
};


/*****
*
*   _createEventListeners
*
*****/
Port.prototype._createEventListeners = function() {
    var mouseRegion = this.svgNodes.root;
    
    mouseRegion.addEventListener("mousedown", this, false);
    //mouseRegion.addEventListener("mouseout", this, false);
    mouseRegion.addEventListener("mouseover", this, false);
};


/*****
*
*   getValue
*
*****/
Port.prototype.getValue = function() {
    return this.parent.getValue();
};


/*****
*
*   getNode
*
*****/
Port.prototype.getNode = function(filterNode) {
    return this.parent.toXML(filterNode);
};


/*****
*
*   removeEdge
*
*****/
Port.prototype.removeEdge = function(edge) {
    for ( var i = 0; i < this.edges.length; i++ ) {
        if ( edge === this.edges[i] ) {
            this.edges.splice(i, 1);
            break;
        }
    }
};


/*****
*
*   toXML
*
*****/
Port.prototype.toXML = function(filterNode, node) {
    if ( this.edges.length > 0 ) {
        this.type.applyToSVGNode(filterNode, node, this);
    }
};


/*****
*
*   hasEdges
*
*****/
Port.prototype.hasEdges = function() {
    return this.edges.length > 0;
};


/*****
*
*   getFirstEdge
*
*****/
Port.prototype.getFirstEdge = function() {
    return this.edges[0];
};


/*****
*
*   getUserCoordinate
*
*****/
Port.prototype.getUserCoordinate = function() {
    var root  = this.svgNodes.root;
    var nodes = this.owner.svgNodes.nodes;
    var trans = getTransformToElement(root, nodes);
    var point = svgDocument.rootElement.createSVGPoint();
    var p1;

    point.x = root.getAttributeNS(null, "cx");
    point.y = root.getAttributeNS(null, "cy");
    
    return point.matrixTransform(trans);
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
Port.prototype.select = function(value) {
    if ( this.selected != value ) {
        var node = this.svgNodes.root;

        if ( value ) {
            node.setAttributeNS(null, "class", "port-selected");
        } else {
            node.setAttributeNS(null, "class", "port");
        }
        this.selected = value;
    }
};


/*****
*
*   mousedown
*
*****/
Port.prototype.mousedown = function(e) {
    if ( e.detail == 1 ) {
        if ( e.ctrlKey ) {
            if ( this.inOrOut == Port.INPUT && this.edges.length == 0 ) {
                var position = this.getUserCoordinate();
                var literal  = this.owner.createLiteralWithDefaults("?");

                literal.setAttribute("x", position.x - 10);
                literal.setAttribute("y", position.y - 40);

                this.owner.appendChild(literal);
                this.owner.connectToInput(literal.output, this);
            } else {
                for ( var i = 0; i < this.edges.length; i++ ) {
                    this.edges[i].dispose(this);
                }

                this.edges = [];
            }
        } else {
            if ( this.selected == false ) {
                if ( this.owner.port != null ) {
                    if ( this.owner.port.inOrOut != this.inOrOut ) {
                        var inPort, outPort;

                        if ( this.inOrOut == Port.INPUT ) {
                            inPort  = this;
                            outPort = this.owner.port;
                        } else {
                            inPort  = this.owner.port;
                            outPort = this;
                        }
                        this.owner.connectToInput(outPort, inPort);

                        this.owner.port.select(false);
                        this.owner.port = null
                    } else {
                        // should throw exception or at least show an error
                    }
                } else {
                    this.owner.port = this;
                    this.select(true);
                }
            }
        }
    } else if ( e.detail == 2 ) {
        var newName = prompt("Output Port Name", this.name);

        if (newName != null && newName != "" ) {
            this.name = newName;
            this.setAttribute("id", newName);
        }
    }
};


/*****
*
*   mouseover
*
*****/
Port.prototype.mouseover = function(e) {
    this.owner.infobar.setLabel( this.name );
};


/*****
*
*   _set_cx
*
*****/
Port.prototype._set_cx = function() {
    var root = this.svgNodes.root;

    if ( root != null )
        root.setAttributeNS(null, "cx", this.cx);
};


/*****
*
*   _set_cy
*
*****/
Port.prototype._set_cy = function() {
    var root = this.svgNodes.root;

    if ( root != null )
        root.setAttributeNS(null, "cy", this.cy);
};
