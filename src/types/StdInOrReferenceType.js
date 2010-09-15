/*****
*
*   StdInOrReferenceType.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
StdInOrReferenceType.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function StdInOrReferenceType() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/*****
*
*   init
*
*****/
StdInOrReferenceType.prototype.init = function() {
    this.name = "stdin-or-reference";
};


/*****
*
*   applyToSVGNode
*
*****/
StdInOrReferenceType.prototype.applyToSVGNode = function(svgParent, svgNode, inPort) {
    var edge    = inPort.getFirstEdge();
    var DAGNode = edge.getInputNode();

    if ( DAGNode.constructor === Element ) {
        var reference   = edge.getOutputName();
        var outputGenId = edge.getOutputGenId();

        if ( outputGenId != inPort.owner.genId ) {
            var child = edge.getNode(svgParent);

            if ( child ) {
                svgParent.appendChild(child);
                child.setAttributeNS(null, "result", reference);
            }
        }
        svgNode.setAttributeNS(null, inPort.name, reference);
    } else if ( DAGNode.constructor === Literal ) {
        svgNode.setAttributeNS(null, inPort.name, edge.getValue());
    } else {
        throw "Unrecognized DAGNode class in Port::toXML";
    }
};
