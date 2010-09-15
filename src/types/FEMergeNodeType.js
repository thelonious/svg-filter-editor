/*****
*
*   FEMergeNodeType.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
FEMergeNodeType.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function FEMergeNodeType() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/*****
*
*   init
*
*****/
FEMergeNodeType.prototype.init = function() {
    this.name = "feMergeNode";
};


/*****
*
*   applyToSVGNode
*
*****/
FEMergeNodeType.prototype.applyToSVGNode = function(svgParent, svgNode, inPort) {
    var svgMergeNode = svgDocument.createElementNS(svgNS, this.name);
    var edge         = inPort.getFirstEdge();
    var DAGNode      = edge.getInputNode();

    if ( DAGNode.constructor === Element ) {
        var reference = edge.getOutputName();
        var child     = edge.getNode(svgParent);

        if ( child ) {
            svgParent.appendChild(child);
            child.setAttributeNS(null, "result", reference);
            svgMergeNode.setAttributeNS(null, "in", reference);
        }
    } else if ( DAGNode.constructor === Literal ) {
        svgMergeNode.setAttributeNS(null, "in", edge.getValue());
    } else {
        throw "Unrecognized DAGNode class in Port::toXML";
    }

    svgNode.appendChild(svgMergeNode);
};
