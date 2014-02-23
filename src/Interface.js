/**
 *   Interface.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   class variables
 */
Interface.VERSION = 1.0;


/**
 *   FromNode
 */
Interface.FromNode = function(node) {
    var name   = node.getAttribute("name");
    var label  = node.getAttribute("label");
    var alias  = node.getAttribute("alias");
    var fi     = new Interface(name, label, alias);
    var inputs, output;
    
    inputs = node.getElementsByTagNameNS(null, "input");
    for ( var i = 0; i < inputs.length; i++ ) {
        fi.appendInput( Parameter.FromNode(inputs.item(i)) );
    }

    output = node.getElementsByTagNameNS(null, "output");
    if ( output.length > 0 ) {
        fi.setOutput( Parameter.FromNode(output.item(0)) );
    }
    
    return fi;
};


/**
 *   constructor
 */
function Interface(name, label, alias) {
    if ( arguments.length > 0 ) {
        this.init(name, label, alias);
    }
}


/**
 *   init
 */
Interface.prototype.init = function(name, label, alias) {
    this.name    = name;
    this.label   = label;
    this.alias   = alias;
    this.inputs  = [];
    this.output  = null;
    this.counter = 1;
};


/**
 *   appendInput
 */
Interface.prototype.appendInput = function(param) {
    this.inputs.push(param);
};


/**
 *   setOutput
 */
Interface.prototype.setOutput = function(param) {
    this.output = param;
};


/**
 *   getInputType
 */
Interface.prototype.getInputType = function(name) {
    var type = null;
    
    // NOTE: should probably add hash to this class
    for ( var i = 0; i < this.inputs.length; i++ ) {
        var param = this.inputs[i];

        if ( param.name == name ) {
            type = param.type;
            break;
        }
    }

    return type;
};


/**
 *   getInputsByGroupName
 */
Interface.prototype.getInputsByGroupName = function(name) {
    var result = [];

    for ( var i = 0; i < this.inputs.length; i++ ) {
        var param = this.inputs[i];

        if ( param.groups[name] != null ) {
            result.push(param.name);
        }
    }

    return result;
};


/**
 *   resetCounter
 */
Interface.prototype.resetCounter = function() {
    this.counter = 1;
};


/**
 *   getNextId
 */
Interface.prototype.getNextId = function() {
    return this.alias + this.counter++;
};
