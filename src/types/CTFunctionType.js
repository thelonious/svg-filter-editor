/**
 *   CTFunctionType.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   class variables
 */
CTFunctionType.VERSION = 1.0;


/**
 *   constructor
 */
function CTFunctionType() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/**
 *   init
 */
CTFunctionType.prototype.init = function() {
    this.name = "ctFunction";
};


/**
 *   applyToSVGNode
 */
CTFunctionType.prototype.applyToSVGNode = function(svgParent, svgNode, inPort) {
    var svgNodeName = "feFunc" + inPort.name.toUpperCase();
    var feFuncNode  = svgDocument.createElementNS(svgNS, svgNodeName);
    var DAGNode     = inPort.getFirstEdge().getInputNode();

    // set feFunc type based on DAGNode
    feFuncNode.setAttributeNS(null, "type", DAGNode.interface.name);
    
    // transfer DAGNode's inputs to the feFunc node
    for ( var i = 0; i < DAGNode.inputs.getLength(); i++ ) {
        var input = DAGNode.inputs.getItem(i);

        input.toXML(svgParent, feFuncNode);
    }

    // add new feFunc node to DOM
    svgNode.appendChild(feFuncNode);
};
