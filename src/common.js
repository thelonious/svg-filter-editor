/***
 *   common.js
 *   copyright 2002, 2014, Kevin Lindsey
 */

/**
 *   globals
 */
var app;
var currentFile = "";


/**
 *   init
 */
function init(e) {
    if ( window.svgDocument == null ) {
        svgDocument = e.target.ownerDocument;
    }

    app = new DAGFilterApp(svgDocument.rootElement);
    waitForApp();
}


/**
 *   waitForApp
 */
function waitForApp() {
    if ( app.loadState != DAGFilterApp.LOADED ) {
        setTimeout("waitForApp()", 100);
    }
    else {
        app.makeButtons();
        //run();
    }
}


/**
 *   loadFile
 */
function loadFile(name) {
    var filename = name.replace(/^.+\\/, "");
    
    currentFile = name;
    getURL(name, loadedFile);
    app.background.setStatus(filename);
}


/**
 *   loadedFile
 */
function loadedFile(status) {
    if ( status.success ) {
        app.createGraph( parseXML(status.content) );
    }
    else {
        throw "Unable to open file";
    }
}
