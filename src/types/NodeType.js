/*****
*
*   NodeType.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
NodeType.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function NodeType() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/*****
*
*   init
*
*****/
NodeType.prototype.init = function() {
    this.name = "node";
};


/*****
*
*   applyToSVGNode
*
*****/
NodeType.prototype.applyToSVGNode = function(svgParent, svgNode, inPort) {
    var edge  = inPort.getFirstEdge();
    var child = edge.getNode(svgNode);

    if ( child ) svgNode.appendChild(child);
};

