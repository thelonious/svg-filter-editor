/**
 *   OrderedHash.js
 *
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   class variables
 */
OrderedHash.VERSION = 1.0;


/**
 *   constructor
 */
function OrderedHash() {
    //if ( arguments.length > 0 ) this.init();
    this.init();
}


/**
 *   init
 */
OrderedHash.prototype.init = function() {
    this.elements = {};
    this.keys     = [];
};


/**
 *   getItem
 */
OrderedHash.prototype.getItem = function(index) {
    if ( index < 0 || this.keys.length <= index ) {
        throw "OrderedHash::getItem - index out of range: " + index;
    }

    return this.elements[ this.keys[index] ];
};


/**
 *   setItem
 */
OrderedHash.prototype.setItem = function(index, value) {
    if ( index < 0 || this.keys.length <= index ) {
        throw "OrderedHash::setItem - index out of range: " + index;
    }

    this.elements[ this.keys[index] ] = value;

    return value;
};


/**
 *   getNamedItem
 */
OrderedHash.prototype.getNamedItem = function(key) {
    if ( this.elements[key] == null ) {
        throw "OrderedHash::getNamedItem - key does not exist: " + key;
    }

    return this.elements[key];
};


/**
 *   setNamedItem
 */
OrderedHash.prototype.setNamedItem = function(key, value) {
    if ( this.elements[key] == null ) {
        this.keys.push(key);
    }

    this.elements[key] = value;

    return value;
};


/**
 *   getLength
 */
OrderedHash.prototype.getLength = function() {
    return this.keys.length;
};
