/*****
*
*   Button.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   inheritance
*
*****/
Button.prototype             = new Widget();
Button.prototype.constructor = Button;
Button.superclass            = Widget.prototype;


/*****
*
*   class variables
*
*****/
Button.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function Button(name, label, owner) {
    if ( arguments.length > 0 ) this.init(name, label, owner);
}


/*****
*
*   init
*
*****/
Button.prototype.init = function(name, label, owner) {
    // call superclass method
    Button.superclass.init.call(this, name, owner);

    // init properties
    this.label = label;
};


/*****
*
*   _createSVG
*
*****/
Button.prototype._createSVG = function(parentNode) {
    // call superclass method
    Button.superclass._createSVG.call(this, parentNode);

    var root = this.svgNodes.root;
    
    // create background and add to group
    this.svgNodes.background = createElement(
        "rect",
        {
            rx: 3, ry: 3,
            width: this.width, height: this.height,
            "class": "button"
        }
    );
    root.appendChild( this.svgNodes.background );

    // create text and add to group
    this.svgNodes.label = createElement(
        "text",
        {
            x: this.width / 2, y: this.height / 2,
            "class": "button-label"
        }
    );
    this.svgNodes.label.appendChild(
        createElement(
            "tspan", { dy: "0.33em" }, this.label
        )
    );
    root.appendChild( this.svgNodes.label );

    // create mouse region and append to group
    this.svgNodes.mouseRegion = createElement(
        "rect",
        {
            rx: 3, ry: 3,
            width: this.width, height: this.height,
            "class": "mouseRegion"
        }
    );
    root.appendChild( this.svgNodes.mouseRegion );

    // update position
    this.update();
};


/*****
*
*   _createEventListeners
*
*****/
Button.prototype._createEventListeners = function() {
    this.addEventListener("mousedown", this, false);
    this.addEventListener("mouseup", this, false);
    this.addEventListener("mouseout", this, false);
};


/***** Event Handlers *****/

/*****
*
*   mousedown
*
*****/
Button.prototype.mousedown = function(e) {
    this.select(true);
};


/*****
*
*   mouseup
*
*****/
Button.prototype.mouseup = function(e) {
    if ( this.selected ) {
        var elem= this.owner.createElementWithDefaults(this.name);

        elem.setAttribute("x", 10);
        elem.setAttribute("y", this.y);
        this.owner.appendChild(elem);

        this.select(false);
    }
};


/*****
*
*   mouseout
*
*****/
Button.prototype.mouseout = function(e) {
    this.select(false);
};


/*****
*
*   select
*
*****/
Button.prototype.select = function(value) {
    if ( this.selected != value ) {
        var node = this.svgNodes.background;

        if ( value ) {
            node.setAttributeNS(null, "class", "button-selected");
        } else {
            node.setAttributeNS(null, "class", "button");
        }
        this.selected = value;
    }
};
