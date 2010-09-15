/*****
*
*   Parameter.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   class variables
*
*****/
Parameter.VERSION = 1.0;


/*****
*
*   FromNode
*
*****/
Parameter.FromNode = function(node) {
    var name   = node.getAttribute("name");
    var type   = node.getAttribute("type");
    var groups = node.getAttribute("groups");
    var groupNames = {};

    if ( groups ) {
        var names = groups.split(/\s*,\s*/);

        for ( var i = 0; i < names.length; i++ ) {
            var group = names[i];
            
            groupNames[group] = group;
        }
    }

    return new Parameter(name, type, groupNames);
};


/*****
*
*   constructor
*
*****/
function Parameter(name, type, groups) {
    if ( arguments.length > 0 ) this.init(name, type, groups);
}


/*****
*
*   init
*
*****/
Parameter.prototype.init = function(name, type, groups) {
    this.name   = name;
    this.type   = type;
    this.groups = groups;
};

