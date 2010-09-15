/*****
*
*   Widget.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
Widget.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function Widget(name, owner) {
    if ( arguments.length > 0 ) this.init(name, owner);
}


/*****
*
*   init
*
*****/
Widget.prototype.init = function(name, owner) {
    this.name     = name;
    this.owner    = owner;
    this.svgNodes = {};
    this.x        = 0;
    this.y        = 0;
    this.width    = 0;
    this.height   = 0;
    this.id       = "";
    this.selected = false;
};


/*****
*
*   dispose
*
*****/
Widget.prototype.dispose = function() {
    var root = this.svgNodes.root;

    if ( root != null ) {
        root.parentNode.removeChild(root);
    }
};


/*****
*
*   realize
*
*****/
Widget.prototype.realize = function(parentNode) {
    this._createSVG(parentNode);
    this._createEventListeners();
}


/*****
*
*   _createSVG
*
*****/
Widget.prototype._createSVG = function(parentNode) {
    this.svgNodes.root = createElement("g");
    parentNode.appendChild(this.svgNodes.root);
};


/*****
*
*   _createEventListeners
*
*****/
Widget.prototype._createEventListeners = function() {
    // abstract method
};


/*****  z-order  *****/

/*****
*
*   bringToFront
*
*****/
Widget.prototype.bringToFront = function() {
    var node   = this.svgNodes.root;
    var parent = node.parentNode;
    
    parent.appendChild(node);
};


/*****  display  *****/

/*****
*
*   show
*
*****/
Widget.prototype.show = function() {
    this.svgNodes.root.setAttributeNS(null, "display", "inline");
};


/*****
*
*   hide
*
*****/
Widget.prototype.hide = function() {
    this.svgNodes.root.setAttributeNS(null, "display", "none");
};


/*****
*
*   inRect
*
*****/
Widget.prototype.inRect = function(rect) {
    var root   = this.svgNodes.root;
    var region = this.svgNodes.mouseRegion;
    var CTM    = root.getCTM();
    var bbox   = region.getBBox();

    bbox.x += CTM.e;
    bbox.y += CTM.f;

    var rectX  = new Interval(rect.x, rect.x + rect.width);
    var rectY  = new Interval(rect.y, rect.y + rect.height);
    var shapeX = new Interval(bbox.x, bbox.x + bbox.width);
    var shapeY = new Interval(bbox.y, bbox.y + bbox.height);

    return rectX.isOverlapping(shapeX) && rectY.isOverlapping(shapeY);
};


/*****
*
*   update
*
*****/
Widget.prototype.update = function() {
    // update the element's position
    this.svgNodes.root.setAttributeNS(
        null,
        "transform",
        "translate(" + this.x + "," + this.y + ")"
    );
};


/*****  event handlers  *****/

/*****
*
*   handleEvent
*
*****/
Widget.prototype.handleEvent = function(e) {
    if ( this[e.type] == null )
        throw "Unsupported event: " + e.type;

    this[e.type](e);
};


/*****
*
*   addEventListener
*
*****/
Widget.prototype.addEventListener = function(type, handler, capture) {
    this.svgNodes.root.addEventListener(type, handler, capture);
};


/*****
*
*   removeEventListener
*
*****/
Widget.prototype.removeEventListener = function(type, handler, capture) {
    this.svgNodes.root.removeEventListener(type, handler, capture);
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   getAttribute
*
*****/
Widget.prototype.getAttribute = function(name) {
    var value = this[name];

    if ( value == null )
        throw "Unrecognized attribute name: " + name;

    return value;
};


/*****
*
*   setAttribute
*
*****/
Widget.prototype.setAttribute = function(name, value) {
    if ( this[name] == null )
        throw "Unrecognized attribute name: " + name;

    var handler = "_set_" + name;

    this[name] = value;
    if ( this[handler] != null ) this[handler](value);
};
