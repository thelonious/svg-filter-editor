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

function getURL(url, target) {
    var request;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        request = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.onreadystatechange = function() {
        if (request.readyState == 4) { //} && request.status == 200) {
            var status = {
                success: true,
                content: request.responseText
            }

            if (typeof target == "function") {
                target(status);
            }
            else {
                target.operationComplete(status);
            }
        }
    }

    request.open("GET", url, true);
    request.send();
}

function parseXML(xml) {
    var parser = new DOMParser();
    var result = parser.parseFromString(xml, "text/xml");

    return result;
}

function printNode(node) {
    var serializer = new XMLSerializer();

    return serializer.serializeToString(node);
}
