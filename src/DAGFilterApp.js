/**
 *   DAGFilterApp.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   class variables
 */
DAGFilterApp.VERSION = 1.0;
DAGFilterApp.NOTLOADED = 0;
DAGFilterApp.LOADING   = 1;
DAGFilterApp.LOADED    = 2;


/**
 *   constructor
 */
function DAGFilterApp(parent) {
    if ( arguments.length > 0 ) {
        this.init(parent);
    }
}


/**
 *   init
 */
DAGFilterApp.prototype.init = function(parent) {
    var root;

    // create types
    this.types = {
        attribute: new AttributeType(),
        ctFunction: new CTFunctionType(),
        feMergeNode: new FEMergeNodeType(),
        node: new NodeType(),
        'stdin-or-reference': new StdInOrReferenceType()
    };

    // create selection managers
    this.selections = {
        nodes: new Selection(this)
    };
    //this.selections.ports = new Selection(this);

    this.port = null;
    this.textbox = null;

    // create svgNodes and append to DOM
    root = createElement(
        "g", { id: "world", transform: "translate(130,0)" }
    );

    this.svgNodes = {
        root: root,
        edges: createElement("g", { id: "edges" } ),
        nodes: createElement("g", { id: "nodes" } ),
        samples: createElement("g", { id: "samples", "enable-background": "new" }),
        buttons: createElement("g", { id: "buttons" } )
    };

    root.appendChild(this.svgNodes.edges);
    root.appendChild(this.svgNodes.nodes);
    root.appendChild(this.svgNodes.samples);

    parent.appendChild(root);
    parent.appendChild(this.svgNodes.buttons);

    // init properties
    this.literalId  = 1;
    this.interfaces = {};
    this.nodes      = [];
    this.xOffset    = 5;
    this.dragMode   = "";
    this.genId      = 0;
    this.id         = {};

    // load and process setup file
    this.loadState = DAGFilterApp.NOTLOADED;
    this.loadSetup();

    // create menu bar
    this.menubar = new MenuBar("#menubar1", this);
    this.menubar.realize(parent);
    this.menubar.addMenuItem(
        "File",
        this,
        [ "Open", "New", "Close", "Save", "Save As...", "Export Filters" ]
    );
    this.menubar.addMenuItem(
        "Edit", this, [ "Cut", "Copy", "Paste", "Delete", "Select All" ] );
    this.menubar.addMenuItem(
        "View", this, [ "SVG", "Clear" ]);
    this.menubar.addMenuItem(
        "Debug", this, [ "Dump All" ]);
    this.menubar.addMenuItem(
        "Help", this, []);

    // create info bar
    this.infobar = new InfoBar("OK", this);
    this.infobar.realize(parent);

    // create background
    this.background = new Background(this);
    this.background.realize(root);

    // create foreground
    this.foreground = new DragRegion(MouseRegion.TOP, this);
    this.foreground.realize(root);
    this.foreground.hide();
    
    // create marquee
    this.marquee = createElement("rect", { "class": "marquee", display: "none" } );
    root.appendChild(this.marquee);

    // create console
    this.console = new Console(this);
    this.console.setAttribute("x", 300);
    this.console.setAttribute("y", 20);
    this.console.realize(root);

    // register event handlers
    // NOTE: Next line commented out because it generates an error with
    // ASV's script engine (very strange).  Had to resort to placing an
    // onkeydown attribute on the svg element :-(
    //svgDocument.rootElement.addEventListener("keydown", this, false);
};


/**
 *   makeButtons
 */
DAGFilterApp.prototype.makeButtons = function() {
    // button panel
    var buttonWidth  = 120;
    var buttonHeight = 15;
    var buttonPad    = 3;
    var buttonIndex  = 0;

    // sort keys by interface label name
    // NOTE: we need to assign the local object's property to a variable so
    // that we can access it inside of the function literal in the sort.
    // "this" is not within scope of the function literal.
    var keys = [];
    var interfaces = this.interfaces;
    for ( var p in interfaces ) keys.push(p);
    keys = keys.sort(
        function(a, b) {
            labelA = interfaces[a].label;
            labelB = interfaces[b].label;
            
            if ( labelA <  labelB ) {
                return -1;
            }
            if ( labelA == labelB ) {
                return 0;
            }
            if ( labelA >  labelB ) {
                return 1;
            }
        }
    );
    for ( var i = 0; i < keys.length; i++ ) {
        var interface = this.interfaces[keys[i]];
        var button = new Button(interface.name, interface.label, this);
        
        button.setAttribute("x", "4");
        button.setAttribute("y", buttonIndex * (buttonHeight + buttonPad) + 4 + 15 + 10);
        button.setAttribute("width", buttonWidth);
        button.setAttribute("height", buttonHeight);
        button.realize(this.svgNodes.buttons);

        buttonIndex++;
    }

    // TEMP: for testing
    loadFile("examples/00-multiFilter.xml");
};


/**
 *   loadSetup
 */
DAGFilterApp.prototype.loadSetup = function() {
    getURL("DAGFilterEditor.xml", this);
    this.loadState = DAGFilterApp.LOADING;
};


/**
 *   operationComplete
 */
DAGFilterApp.prototype.operationComplete = function(status) {
    if ( status.success ) {
        var setup = parseXML(status.content);
        var interfaces = setup.getElementsByTagNameNS(null, "interface");

        for ( var i = 0; i < interfaces.length; i++ ) {
            var interface = Interface.FromNode( interfaces.item(i) );

            this.interfaces[interface.name] = interface;
        }
        this.loadState = DAGFilterApp.LOADED;
    }
    else {
        throw "Unable to load DAGFilterEditor.xml";
    }
};


/**
 *   createGraph
 */
DAGFilterApp.prototype.createGraph = function(doc) {
    var elements = doc.getElementsByTagNameNS(null, "element");
    var literals = doc.getElementsByTagNameNS(null, "literal");
    var edges    = doc.getElementsByTagNameNS(null, "edge");
    var names    = {};

    // clear document
    this.clearDocument();

    // clean up the display
    this.clearScreen();
    
    // reset all interface counters
    for ( var i = 0; i < this.interfaces.length; i++) {
        this.interfaces[i].resetCounter();
    }
    this.literalId = 1;

    // create elements
    for ( var i = 0; i < elements.length; i++ ) {
        var element = elements.item(i);
        var DAGNode = this.createElement( element.getAttribute("type") );
        var id      = element.getAttribute("id");

        DAGNode.setAttribute("x", +element.getAttribute("x"));
        DAGNode.setAttribute("y", +element.getAttribute("y"));
        DAGNode.setAttribute("id", id);

        names[id] = DAGNode;

        this.appendChild(DAGNode);

        var inputs = element.getElementsByTagNameNS(null, "input");
        for ( var j = 0; j < inputs.length; j++ ) {
            DAGNode.addInput( inputs.item(j).getAttribute("name") );
        }

        var outputs = element.getElementsByTagNameNS(null, "output");
        if ( outputs.length > 0 ) {
            var output = outputs.item(0);
            DAGNode.output.name = output.getAttribute("name");
        }
    }

    // create literals
    for ( var i = 0; i < literals.length; i++ ) {
        var literal = literals.item(i);
        var DAGNode = this.createLiteral( literal.firstChild.data );
        var id      = literal.getAttribute("id");

        DAGNode.setAttribute("x", +literal.getAttribute("x"));
        DAGNode.setAttribute("y", +literal.getAttribute("y"));
        DAGNode.setAttribute("id", id);

        names[id] = DAGNode;

        this.appendChild(DAGNode);
    }

    // NOTE: Need to add error checking for input port names
    // create edges
    for (var i = 0; i < edges.length; i++ ) {
        var edge       = edges.item(i);
        var inNode     = names[edge.getAttribute("input")];
        var inPortName = edge.getAttribute("name");
        var inPort     = inNode.inputs.getNamedItem(inPortName);
        
        this.connectToInput(
            names[edge.getAttribute("output")].output,
            inPort
        );
    }
};


/**
 *   clearDocument
 */
DAGFilterApp.prototype.clearDocument = function() {
    // remove all existing nodes
    this.selectAll();
    this.deleteSelection("nodes");
};


/**
 *   clearScreen
 */
DAGFilterApp.prototype.clearScreen = function() {
    // remove all filters
    var filters = svgDocument.getElementsByTagNameNS(svgNS, "filter");
    while ( filters.length > 0 ) {
        var node = filters.item(0);

        node.parentNode.removeChild(node);
    }

    // remove all samples
    var samples = this.svgNodes.samples;
    while ( samples.firstChild ) {
        samples.removeChild( samples.firstChild );
    }

    // clear console;
    this.console.clear();
};


/**
 *   createXML
 */
DAGFilterApp.prototype.createXML = function() {
    var filterGraph  = svgDocument.createElementNS(null, "filter-graph");
    var nodes        = svgDocument.createElementNS(null, "nodes");
    var edges        = svgDocument.createElementNS(null, "edges");

    filterGraph.appendChild(nodes);
    filterGraph.appendChild(edges);

    for ( var i = 0; i < this.nodes.length; i++ ) {
        nodes.appendChild( this.nodes[i]._toXML(edges) );
    }

    return formatTree(filterGraph);
};


/**
 *   graphToSVG
 */
DAGFilterApp.prototype.graphToSVG = function() {
    // clear the display
    this.clearScreen();

    // convert graph to forest
    var trees = this.toXML();

    // reset x position for sample images
    this.xOffset = 5;

    for ( var i = 0; i < trees.length; i++ ) {
        var tree  = formatTree(trees[i]);
        var xml   = printNode(tree);
        var lines = xml.split(/\n/);

        for ( var j = 0; j < lines.length; j++ ) {
            this.console.addLine(lines[j]);
        }

        this.showFilter( tree );
    }
};


/**
 *   showFilter
 */
DAGFilterApp.prototype.showFilter = function(filter) {
    var r      = 25;
    var pad    = 5;
    var id     = filter.getAttributeNS(null, "id");
    var circle = createElement(
        "circle",
        {
            cx: this.xOffset + r,
            cy: innerHeight - r - 2*pad - 25,
            r: r,
            fill: "red",
            filter: "url(#" + id + ")"
        }
    );
    var defss = svgDocument.getElementsByTagNameNS(svgNS, "defs");
    var defs;

    if ( defss.length > 0 ) {
        defs = defss.item(0);
    }
    else {
        var svgRoot = svgDocument.rootElement;

        defs = createElement("defs");

        if ( svgRoot.hasChildNodes() ) {
            svgRoot.insertBefore(defs, svgRoot.firstChild);
        }
        else {
            svgRoot.appendChild(defs);
        }
    }
    defs.appendChild(filter);

    this.svgNodes.samples.appendChild(circle);

    this.xOffset += 2*r + pad;
};


/**
 *   createElement
 */
DAGFilterApp.prototype.createElement = function(name) {
    var interface = this.interfaces[name];

    if ( interface == null ) {
        throw "Unrecognized filter name: " + name;
    }

    return new Element(interface, this);
};


/**
 *   createElementWithDefaults
 */
DAGFilterApp.prototype.createElementWithDefaults = function(name) {
    var elem   = this.createElement(name);
    var inputs = elem.interface.getInputsByGroupName("default");

    // create unique id
    var id = elem.interface.getNextId();
    while ( this.id[id] != null ) {
        id = elem.interface.getNextId();
    }
    elem.setAttribute("id", id);

    // add default input ports
    for ( var i = 0; i < inputs.length; i++ ) {
        elem.addInput( inputs[i] );
    }

    return elem;
};


/**
 *   createLiteral
 */
DAGFilterApp.prototype.createLiteral = function(text) {
    var interface = new Interface("string", text);
    
    return new Literal(interface, this);
};


/**
 *   createLiteralWithDefaults
 */
DAGFilterApp.prototype.createLiteralWithDefaults = function(text) {
    var literal = this.createLiteral(text);

    var id = "literal" + this.literalId++;
    while ( this.id[id] != null ) {
        id = "literal" + this.literalId++;
    }
    literal.setAttribute("id", id);

    return literal;
};


/**
 *   appendChild
 */
DAGFilterApp.prototype.appendChild = function(elem) {
    elem.realize( this.svgNodes.nodes );
    this.nodes.push(elem);
    this.id[elem.getAttribute("id")] = elem;
};


/**
 *   removeChild
 */
DAGFilterApp.prototype.removeChild = function(elem) {
    for ( var i = 0; i < this.nodes.length; i++ ) {
        if ( this.nodes[i] === elem ) {
            delete this.id[elem.getAttribute("id")];
            this.nodes.splice(i, 1);
            break;
        }
    }
};


/**  Selection methods  */

/**
 *   selectChild
 */
DAGFilterApp.prototype.selectChild = function(name, widget) {
    var selection = this.selections[name];

    if ( selection == null ) {
        throw "Selection name does not exist: " + name;
    }

    selection.selectChild(widget);
};


/**
 *   deselectChild
 */
DAGFilterApp.prototype.deselectChild = function(name, widget) {
    var selection = this.selections[name];

    if ( selection == null ) {
        throw "Selection name does not exist: " + name;
    }

    selection.deselectChild(widget);
};


/**
 *   selectAll
 */
DAGFilterApp.prototype.selectAll = function() {
    for ( var i = 0; i < this.nodes.length; i++ ) {
        var node = this.nodes[i];

        if ( !node.selected ) {
            this.selections.nodes.selectChild(node);
        }
    }
};


/**
 *   deselectAll
 */
DAGFilterApp.prototype.deselectAll = function(name) {
    if ( name != null ) {
        var selection = this.selections[name];

        if ( selection == null ) {
            throw "Selection name does not exist: " + name;
        }

        selection.deselectAll();
    }
    else {
        for ( var key in this.selections ) {
            this.selections[key].deselectAll();
        }
    }
};


/**
 *   dragSelection
 */
DAGFilterApp.prototype.dragSelection = function(e) {
    this.dragMode = "nodes";
    this.foreground.addEventListener("drag",    this, false);
    this.foreground.addEventListener("dragend", this, false);
    this.foreground.beginDrag(e);
};


/**
 *   duplicateSelection
 */
DAGFilterApp.prototype.duplicateSelection = function() {

};


/**
 *   deleteSelection
 */
DAGFilterApp.prototype.deleteSelection = function(name) {
    var selection = this.selections[name];

    if ( selection == null ) {
        throw "Selection name does not exist: " + name;
    }

    selection.foreachChild(
        function(node) {
            node.owner.removeChild( node );
            node.dispose();
        }
    );
    selection.clearSelection();
};


/**
 *   dragMarquee
 */
DAGFilterApp.prototype.dragMarquee = function(e) {
    this.dragMode = "marquee";
    this.foreground.addEventListener("dragbegin", this, false);
    this.foreground.addEventListener("drag",      this, false);
    this.foreground.addEventListener("dragend",   this, false);
    this.foreground.beginDrag(e);
};


/**
 *   connectToInput
 */
DAGFilterApp.prototype.connectToInput = function(outPort, inPort) {
    var edge = new Edge(outPort, inPort, this);

    edge.realize( this.svgNodes.edges );
};


/**
 *   toXML
 */
DAGFilterApp.prototype.toXML = function() {
    var trees = [];

    for ( var i = 0; i < this.nodes.length; i++ ) {
        var node = this.nodes[i];

        if ( node.constructor === Element ) {
            if ( node.name == "FILTER" ) {
                // increment id to prevent redundant SVG nodes.
                this.genId++;
                trees.push( node.toXML() );
            }
        }
    }

    return trees;
};


/**  Event Handlers  */

/**
 *   handleEvent
 */
DAGFilterApp.prototype.handleEvent = function(e) {
    if ( this[e.type] == null ) {
        throw "Unsupported event: " + e.type;
    }

    this[e.type](e);
};


/**
 *   keydown
 */
DAGFilterApp.prototype.keydown = function(e) {
    // Dont't process keydowns if a textbox is currently active
    if ( this.textbox == null ) {
        switch (e.keyCode) {
            //case 8:   // backspace
            case 127: // delete
                var cmd = new DeleteCommand(this);
                break;

            case 32:  // spacebar
                if ( this.port != null && this.port.hasEdges() ) {
                    if ( e.shiftKey && this.port.inOrOut == Port.INPUT ) {
                        var edge   = this.port.getFirstEdge();
                        var other  = edge.inPort;
                        var parent = other.parent;
                        var p1     = this.port.getUserCoordinate();
                        var p2     = edge.inPort.getUserCoordinate();
                        var diffX  = p1.x - p2.x;

                        parent.rmoveto(diffX, 0);
                        this.selections.nodes.foreachChild(
                            function(node) {
                                if ( node !== parent ) {
                                    node.rmoveto(diffX, 0);
                                }
                            }
                        );
                    }
                    else {
                        var p1     = this.port.getUserCoordinate();
                        var count  = this.port.edges.length;
                        var parent = this.port.parent;
                        var sumX   = 0;
                        var diffX;

                        for ( var i = 0; i < count; i++ ) {
                            var edge = this.port.edges[i];

                            if ( this.port.inOrOut == Port.INPUT ) {
                                sumX += edge.inPort.getUserCoordinate().x;
                            }
                            else {
                                sumX += edge.outPort.getUserCoordinate().x;
                            }
                        }
                        diffX = (sumX / count) - p1.x;
                        parent.rmoveto(diffX, 0);
                        this.selections.nodes.foreachChild(
                            function(node) {
                                if ( node !== parent ) {
                                    node.rmoveto(diffX, 0);
                                }
                            }
                        );
                    }

                    this.port.select(false);
                    this.port = null;
                }
                break;

            case 37:  // left arrow
            case 100: // keypad-4
                var cmd = new MoveSelectionCommand(this, "nodes", -1, 0);
                break;

            case 38:  // up arrow
            case 104: // keypad-8
                var cmd = new MoveSelectionCommand(this, "nodes", 0, -1);
                break;

            case 39:  // right arrow
            case 102: // keypad-6
                var cmd = new MoveSelectionCommand(this, "nodes", 1, 0);
                break;

            case 40:  // down arrow
            case 98:  // keypad-2
                var cmd = new MoveSelectionCommand(this, "nodes", 0, 1);
                break;

            case 49:  // 1
                if ( e.ctrlKey ) {
                    var cmd = new ViewSVGCommand(this);
                }
                break;

            case 65:  // a
                if ( e.ctrlKey ) {
                    var cmd = new SelectAllCommand(this);
                }
                break;

            case 68:  // d
                //this.duplicateSelection("nodes");
                break;

            case 78:  // n
                if ( e.ctrlKey ) {
                    var cmd = new NewCommand(this);
                }
                break;

            case 79:  // o
                if ( e.ctrlKey ) {
                    var cmd = new OpenCommand(this);
                }
                break;
                
            case 83:  // s
                if ( e.ctrlKey ) {
                    var cmd;

                    if ( e.shiftKey || currentFile == "" ) {
                        cmd = new SaveAsCommand(this);
                    }
                    else {
                        cmd = new SaveCommand(this);
                    }
                }
                break;
        }
    }
};


/**
 *   keypress
 */
DAGFilterApp.prototype.keypress = function(e) {
    // pass on this keydown if a textbox is currently active
    if ( this.textbox != null ) {
        this.textbox.keypress(e);
    }
};


/**
 *   dragbegin
 */
DAGFilterApp.prototype.dragbegin = function(e) {
    if ( this.dragMode == "marquee") {
        var node   = this.svgNodes.nodes;
        var curr   = getUserCoordinate(node, e.clientX, e.clientY);

        this.marquee.setAttributeNS(null, "x",      curr.x);
        this.marquee.setAttributeNS(null, "y",      curr.y);
        this.marquee.setAttributeNS(null, "width",  "0");
        this.marquee.setAttributeNS(null, "height", "0");
        this.marquee.setAttributeNS(null, "display", "inline");
    }
};


/**
 *   drag
 */
DAGFilterApp.prototype.drag = function(e) {
    if ( this.dragMode == "nodes" ) {
        var node  = this.svgNodes.nodes;
        var curr  = getUserCoordinate(node, e.clientX, e.clientY);
        var last  = getUserCoordinate(node, e.lastX, e.lastY);
        var diffX = curr.x - last.x;
        var diffY = curr.y - last.y;

        if ( diffX != 0 || diffY != 0 ) {
            this.rmovetoSelection("nodes", diffX, diffY);
        }
    }
    else {
        var node   = this.svgNodes.nodes;
        var first  = getUserCoordinate(node, e.startX, e.startY);
        var curr   = getUserCoordinate(node, e.clientX, e.clientY);
        var x      = Math.min(first.x, curr.x);
        var y      = Math.min(first.y, curr.y);
        var width  = Math.abs(first.x - curr.x);
        var height = Math.abs(first.y - curr.y);

        this.marquee.setAttributeNS(null, "x",      x);
        this.marquee.setAttributeNS(null, "y",      y);
        this.marquee.setAttributeNS(null, "width",  width);
        this.marquee.setAttributeNS(null, "height", height);

        var rect = { x: x, y: y, width: width, height: height };

        for ( var i = 0; i < this.nodes.length; i++ ) {
            var node   = this.nodes[i];
            var select = node.inRect(rect);
            
            if ( node.selected != select ) {
                if ( select ) {
                    this.selections.nodes.selectChild(node);
                }
                else {
                    this.selections.nodes.deselectChild(node);
                }
            }
        }
    }
};


/**
 *   rmovetoSelection
 */
DAGFilterApp.prototype.rmovetoSelection = function(name, dx, dy) {
    this.selections[name].foreachChild(
        function(node) { node.rmoveto(dx, dy) }
    );
};


/**
 *   dragend
 */
DAGFilterApp.prototype.dragend = function(e) {
    if ( this.dragMode == "marquee") {
        this.marquee.setAttributeNS(null, "display", "none");
        this.foreground.removeEventListener("dragbegin", this, false);
    }

    this.foreground.removeEventListener("drag", this, false);
    this.foreground.removeEventListener("dragend", this, false);

    this.dragMode = "";
};


/**
 *   menuselect
 */
DAGFilterApp.prototype.menuselect = function(e) {
    switch ( e.target.name ) {
        case "Clear":
            var cmd = new ClearCommand(this);
            break;

        case "Delete":
            var cmd = new DeleteCommand(this);
            break;

        case "Dump All":
            var cmd = new DumpAllCommand(this);
            break;
            
        case "Export Filters":
            var cmd = new ExportFiltersCommand(this);
            break;

        case "New":
            var cmd = new NewCommand(this);
            break;

        case "Open":
            var cmd = new OpenCommand(this);
            break;

        case "Save":
            var cmd;

            if ( currentFile != null && currentFile != "" ) {
                cmd = new SaveCommand(this);
            }
            else {
                cmd = new SaveAsCommand(this);
            }
            break;

        case "Save As...":
            var cmd = new SaveAsCommand(this);
            break;

        case "Select All":
            var cmd = new SelectAllCommand(this);
            break;

        case "SVG":
            var cmd = new ViewSVGCommand(this);
            break;

        default:
            alert( e.target.name );
    }
};

