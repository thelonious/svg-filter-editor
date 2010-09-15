/*****
*
*   AttributeType.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
AttributeType.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function AttributeType() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/*****
*
*   init
*
*****/
AttributeType.prototype.init = function() {
    this.name = "attribute";
};


/*****
*
*   applyToSVGNode
*
*****/
AttributeType.prototype.applyToSVGNode = function(svgParent, svgNode, inPort) {
    var edge = inPort.getFirstEdge();
    var ns   = null;

    if ( inPort.name.match(/^xlink:/) ) ns = xlinkNS;

    svgNode.setAttributeNS(ns, inPort.name, edge.getValue() );
};

