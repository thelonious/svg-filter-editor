/**
 *   Utilities.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   globals
 */
var svgNS   = "http://www.w3.org/2000/svg";
var xmlNS   = "http://www.w3.org/XML/1998/namespace";
var xlinkNS = "http://www.w3.org/1999/xlink";


/**
 *   getTransformToElement
 *
 *   NOTE: stopAt must be an ancestor of node.  This version of this routine
 *   does not verify this condition.  A "method not implemented" or something
 *   equivalent should fire if stopAt is not an ancestor.
 */
function getTransformToElement(node, stopAt) {
    var nodeTransform = node.getScreenCTM();
    var stopAtTransform = stopAt.getScreenCTM();

    return nodeTransform.multiply(stopAtTransform.inverse());
}


/**
 *   getUserCoordinate
 */
function getUserCoordinate(node, x, y) {
    var svgRoot    = svgDocument.rootElement;
    var pan        = svgRoot.currentTranslate;
    var zoom       = svgRoot.currentScale;
    var iCTM       = getTransformToElement(node, svgRoot).inverse();
    var worldPoint = svgRoot.createSVGPoint();
    
    worldPoint.x = (x - pan.x) / zoom;
    worldPoint.y = (y - pan.y) / zoom;

    return worldPoint.matrixTransform(iCTM);
};


/**
 *   cleanTree
 */
function cleanTree(tree) {
    var queue = [ tree ];

    while ( queue.length > 0 ) {
        var node = queue.shift();

        for ( var i = 0; i < node.childNodes.length; i++ ) {
            var child = node.childNodes.item(i);
            
            if ( child.nodeType == 1 ) {
                queue.push(child)
            }
            else if ( child.nodeType == 3 ) {
                if ( child.data.match(/^\s*$/) ) {
                    node.removeChild(child);
                    i--;
                }
            }
        }
    }

    return tree;
}


/**
 *   formatTree
 */
function formatTree(tree) {
    var queue = [ [tree, 1] ];
    var level = 1;
    var space = "    ";

    while ( queue.length > 0 ) {
        var entry = queue.shift();
        var node  = entry[0];
        var level = entry[1];
        var filler1 = "\n";
        var filler2 = "\n";

        for ( var i = 0; i < level;     i++ ) filler1 += space;
        for ( var i = 0; i < level - 1; i++ ) filler2 += space;
        
        if ( node.hasChildNodes() ) {
            if ( node.firstChild.nodeType == 3 ) {
                continue;
            }

            for ( var i = 0; i < node.childNodes.length; i++ ) {
                var child = node.childNodes.item(i);
                
                queue.push( [child, level + 1] );
                node.insertBefore( svgDocument.createTextNode(filler1), child );
                i++;
            }
            node.appendChild(svgDocument.createTextNode(filler2));
        }
    }

    return tree;
}


/**
 *   createElement
 */
function createElement(tagName, attrs, text) {
    var element = svgDocument.createElementNS(svgNS, tagName);

    for (var a in attrs) {
        if ( a.match(/^xml:/) ) {
            // HACK: please fix :)
            a = a.replace(/^xml:/, "");
            element.setAttributeNS(xmlNS, a, attrs[a]);
        }
        else {
            element.setAttributeNS(null, a, attrs[a]);
        }
    }

    if ( text != null ) {
        element.appendChild( svgDocument.createTextNode(text) );
    }
    
    return element;
}
