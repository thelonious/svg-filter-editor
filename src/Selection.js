/*****
*
*   Selection.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
Selection.VERSION = 1.0;


/*****
*
*   constructor
*
*****/
function Selection(owner) {
    if ( arguments.length > 0 ) this.init(owner);
}


/*****
*
*   init
*
*****/
Selection.prototype.init = function(owner) {
    this.owner    = owner;
    this.children = [];
};


/*****
*
*   selectChild
*
*****/
Selection.prototype.selectChild = function(elem) {
    // NOTE: should make sure not already in selection

    this.children.push(elem);
    elem.select(true);
};


/*****
*
*   deselectChild
*
*****/
Selection.prototype.deselectChild = function(elem) {
    for ( var i = 0; i < this.children.length; i++ ) {
        if ( elem === this.children[i] ) {
            this.children.splice(i, 1);
            elem.select(false);
            break;
        }
    }
};


/*****
*
*   deselectAll
*
*   NOTE: It would be "cleaner" to call deselectChild on each child in the
*   selection, but since the deselection logic is so simple, it seems better
*   (faster) to recreate the logic here.  This avoids the potential multiple
*   calls to splice (one for each child) in deselectChild
*
*****/
Selection.prototype.deselectAll = function() {
    for ( var i = 0; i < this.children.length; i++ ) {
        this.children[i].select(false);
    }

    this.children = [];
};


/*****
*
*   clearSelection
*
*****/
Selection.prototype.clearSelection = function() {
    this.children = [];
};


/*****
*
*   foreachChild
*
*****/
Selection.prototype.foreachChild = function(func) {
    for ( var i = 0; i < this.children.length; i++ ) {
        func( this.children[i] );
    }
};

