/*****
*
*   The contents of this file were written by Kevin Lindsey
*   copyright 2002 Kevin Lindsey
*
*   This file was compacted by jscompact
*   A Perl utility written by Kevin Lindsey (kevin@kevlindev.com)
*
*****/
var app;var currentFile="";
function init(e){if(window.svgDocument==null)svgDocument=e.target.ownerDocument;app=new DAGFilterApp(svgDocument.rootElement);waitForApp();}
function waitForApp(){if(app.loadState!=DAGFilterApp.LOADED){setTimeout("waitForApp()",100);}else{app.makeButtons();}}
function loadFile(name){var filename=name.replace(/^.+\\/,"");currentFile=name;getURL(name,loadedFile);app.background.setStatus(filename);}
function loadedFile(status){if(status.success){app.createGraph(parseXML(status.content));}else{throw"Unable to open file";}}
DragEvent.VERSION=1.0;
function DragEvent(e,type){if(arguments.length>0)this.init(e,type);}
DragEvent.prototype.init=function(e,type){for(var p in e)this[p]=e[p];this.type=type;this.startX=null;this.startY=null;this.lastX=null;this.lastY=null;};
Interface.VERSION=1.0;
Interface.FromNode=function(node){var name=node.getAttribute("name");var label=node.getAttribute("label");var alias=node.getAttribute("alias");var fi=new Interface(name,label,alias);var inputs,output;inputs=node.getElementsByTagNameNS(null,"input");for(var i=0;i<inputs.length;i++){fi.appendInput(Parameter.FromNode(inputs.item(i)));}output=node.getElementsByTagNameNS(null,"output");if(output.length>0)fi.setOutput(Parameter.FromNode(output.item(0)));return fi;};
function Interface(name,label,alias){if(arguments.length>0)this.init(name,label,alias);}
Interface.prototype.init=function(name,label,alias){this.name=name;this.label=label;this.alias=alias;this.inputs=[];this.output=null;this.counter=1;};
Interface.prototype.appendInput=function(param){this.inputs.push(param);};
Interface.prototype.setOutput=function(param){this.output=param;};
Interface.prototype.getInputType=function(name){var type=null;for(var i=0;i<this.inputs.length;i++){var param=this.inputs[i];if(param.name==name){type=param.type;break;}}return type;};
Interface.prototype.getInputsByGroupName=function(name){var result=[];for(var i=0;i<this.inputs.length;i++){var param=this.inputs[i];if(param.groups[name]!=null){result.push(param.name);}}return result;};
Interface.prototype.resetCounter=function(){this.counter=1;};
Interface.prototype.getNextId=function(){return this.alias+this.counter++;};
Interval.VERSION=1.0;
function Interval(lo,hi){if(arguments.length>0)this.init(lo,hi);}
Interval.prototype.init=function(lo,hi){this.lo=Math.min(lo,hi);this.hi=Math.max(lo,hi);};
Interval.prototype.contains=function(value){return this.lo<=value&&value<=this.hi;}
Interval.prototype.isOverlapping=function(that){return(this.contains(that.lo)||this.contains(that.hi)||that.contains(this.lo)||that.contains(this.hi));}
OrderedHash.VERSION=1.0;
function OrderedHash(){this.init();}
OrderedHash.prototype.init=function(){this.elements={};this.keys=[];};
OrderedHash.prototype.getItem=function(index){if(index<0||this.keys.length<=index)throw"OrderedHash::getItem - index out of range: "+index;return this.elements[this.keys[index]];};
OrderedHash.prototype.setItem=function(index,value){if(index<0||this.keys.length<=index)throw"OrderedHash::setItem - index out of range: "+index;this.elements[this.keys[index]]=value;return value;};
OrderedHash.prototype.getNamedItem=function(key){if(this.elements[key]==null)throw"OrderedHash::getNamedItem - key does not exist: "+key;return this.elements[key];};
OrderedHash.prototype.setNamedItem=function(key,value){if(this.elements[key]==null)this.keys.push(key);this.elements[key]=value;return value;};
OrderedHash.prototype.getLength=function(){return this.keys.length;};
Parameter.VERSION=1.0;
Parameter.FromNode=function(node){var name=node.getAttribute("name");var type=node.getAttribute("type");var groups=node.getAttribute("groups");var groupNames={};if(groups){var names=groups.split(/\s*,\s*/);for(var i=0;i<names.length;i++){var group=names[i];groupNames[group]=group;}}return new Parameter(name,type,groupNames);};
function Parameter(name,type,groups){if(arguments.length>0)this.init(name,type,groups);}
Parameter.prototype.init=function(name,type,groups){this.name=name;this.type=type;this.groups=groups;};
Selection.VERSION=1.0;
function Selection(owner){if(arguments.length>0)this.init(owner);}
Selection.prototype.init=function(owner){this.owner=owner;this.children=[];};
Selection.prototype.selectChild=function(elem){this.children.push(elem);elem.select(true);};
Selection.prototype.deselectChild=function(elem){for(var i=0;i<this.children.length;i++){if(elem===this.children[i]){this.children.splice(i,1);elem.select(false);break;}}};
Selection.prototype.deselectAll=function(){for(var i=0;i<this.children.length;i++){this.children[i].select(false);}this.children=[];};
Selection.prototype.clearSelection=function(){this.children=[];};
Selection.prototype.foreachChild=function(func){for(var i=0;i<this.children.length;i++){func(this.children[i]);}};var svgNS="http://www.w3.org/2000/svg";var xmlNS="http://www.w3.org/XML/1998/namespace";var xlinkNS="http://www.w3.org/1999/xlink";
function getTransformToElement(node,stopAt){var CTM=node.getCTM();if(stopAt==null)stopAt=svgDocument.rootElement;while((node=node.parentNode)!=stopAt)CTM=node.getCTM().multiply(CTM);return CTM;}
function getUserCoordinate(node,x,y){var svgRoot=svgDocument.rootElement;var pan=svgRoot.currentTranslate;var zoom=svgRoot.currentScale;var iCTM=getTransformToElement(node).inverse();var worldPoint=svgRoot.createSVGPoint();worldPoint.x=(x-pan.x)/zoom;worldPoint.y=(y-pan.y)/zoom;return worldPoint.matrixTransform(iCTM);};
function cleanTree(tree){var queue=[tree];while(queue.length>0){var node=queue.shift();for(var i=0;i<node.childNodes.length;i++){var child=node.childNodes.item(i);if(child.nodeType==1){queue.push(child)}else if(child.nodeType==3){if(child.data.match(/^\s*$/)){node.removeChild(child);i--;}}}}return tree;}
function formatTree(tree){var queue=[[tree,1]];var level=1;var space="    ";while(queue.length>0){var entry=queue.shift();var node=entry[0];var level=entry[1];var filler1="\n";var filler2="\n";for(var i=0;i<level;i++)filler1+=space;for(var i=0;i<level-1;i++)filler2+=space;if(node.hasChildNodes()){if(node.firstChild.nodeType==3)continue;for(var i=0;i<node.childNodes.length;i++){var child=node.childNodes.item(i);queue.push([child,level+1]);node.insertBefore(svgDocument.createTextNode(filler1),child);i++;}node.appendChild(svgDocument.createTextNode(filler2));}}return tree;}
function createElement(tagName,attrs,text){var element=svgDocument.createElementNS(svgNS,tagName);for(var a in attrs)element.setAttributeNS(null,a,attrs[a]);if(text!=null)element.appendChild(svgDocument.createTextNode(text));return element;}
Command.VERSION=1.0;
function Command(owner){if(arguments.length>0)this.init(owner);}
Command.prototype.init=function(owner){this.owner=owner;this.doit();};
Command.prototype.doit=function(){};
Command.prototype.undo=function(){};
Command.prototype.redo=function(){};
ClearCommand.prototype=new Command();
ClearCommand.prototype.constructor=ClearCommand;
ClearCommand.superclass=Command.prototype;
ClearCommand.VERSION=1.0;
function ClearCommand(owner){if(arguments.length>0)this.init(owner);}
ClearCommand.prototype.doit=function(){if(this.owner!=null){this.owner.clearScreen();}};
DeleteCommand.prototype=new Command();
DeleteCommand.prototype.constructor=DeleteCommand;
DeleteCommand.superclass=Command.prototype;
DeleteCommand.VERSION=1.0;
function DeleteCommand(owner){if(arguments.length>0)this.init(owner);}
DeleteCommand.prototype.doit=function(){if(this.owner!=null){this.owner.deleteSelection("nodes");}};
DumpAllCommand.prototype=new Command();
DumpAllCommand.prototype.constructor=DumpAllCommand;
DumpAllCommand.superclass=Command.prototype;
DumpAllCommand.VERSION=1.0;
function DumpAllCommand(owner){if(arguments.length>0)this.init(owner);}
DumpAllCommand.prototype.doit=function(){var tmpFile=currentFile;currentFile="dump_all.xml";cleanTree(svgDocument.rootElement);formatTree(svgDocument.rootElement);saveFile([svgDocument.rootElement]);currentFile=tmpFile;};
ExportFiltersCommand.prototype=new Command();
ExportFiltersCommand.prototype.constructor=ExportFiltersCommand;
ExportFiltersCommand.superclass=Command.prototype;
ExportFiltersCommand.VERSION=1.0;
function ExportFiltersCommand(owner){if(arguments.length>0)this.init(owner);}
ExportFiltersCommand.prototype.doit=function(){var tmpFile=currentFile;var svgRoot=svgDocument.rootElement;if(this.owner){var newName=prompt("Save File As...",currentFile);if(newName!=null&&newName!=""){var cmd=new ViewSVGCommand(this.owner);var defs=svgDocument.getElementsByTagNameNS(svgNS,"defs");if(defs.length>0){defs=defs.item(0);currentFile=newName;cleanTree(defs);formatTree(defs);saveFile([defs]);currentFile=tmpFile;}else{alert("Export Filters failed: no defs in document");}}}};
MoveSelectionCommand.prototype=new Command();
MoveSelectionCommand.prototype.constructor=MoveSelectionCommand;
MoveSelectionCommand.superclass=Command.prototype;
MoveSelectionCommand.VERSION=1.0;
function MoveSelectionCommand(owner,name,dx,dy){if(arguments.length>0)this.init(owner,name,dx,dy);}
MoveSelectionCommand.prototype.init=function(owner,name,dx,dy){this.name=name;this.dx=dx;this.dy=dy;MoveSelectionCommand.superclass.init.call(this,owner);};
MoveSelectionCommand.prototype.doit=function(){var dx=this.dx;var dy=this.dy;if(this.owner!=null){this.owner.selections[this.name].foreachChild(function(node){node.rmoveto(dx,dy)});}};
NewCommand.prototype=new Command();
NewCommand.prototype.constructor=NewCommand;
NewCommand.superclass=Command.prototype;
NewCommand.VERSION=1.0;
NewCommand.COUNTER=2;
function NewCommand(owner){if(arguments.length>0)this.init(owner);}
NewCommand.prototype.doit=function(){if(this.owner!=null){currentFile="";this.owner.clearDocument();this.owner.clearScreen();this.owner.background.setStatus("untitled-"+NewCommand.COUNTER++);}};
OpenCommand.prototype=new Command();
OpenCommand.prototype.constructor=OpenCommand;
OpenCommand.superclass=Command.prototype;
OpenCommand.VERSION=1.0;
function OpenCommand(owner){if(arguments.length>0)this.init(owner);}
OpenCommand.prototype.doit=function(){if(browseButton!=null){browseButton.click();}};
SaveCommand.prototype=new Command();
SaveCommand.prototype.constructor=SaveCommand;
SaveCommand.superclass=Command.prototype;
SaveCommand.VERSION=1.0;
function SaveCommand(owner){if(arguments.length>0)this.init(owner);}
SaveCommand.prototype.doit=function(){if(this.owner!=null){saveFile([this.owner.createXML()]);}};
SaveAsCommand.prototype=new Command();
SaveAsCommand.prototype.constructor=SaveAsCommand;
SaveAsCommand.superclass=Command.prototype;
SaveAsCommand.VERSION=1.0;
function SaveAsCommand(owner){if(arguments.length>0)this.init(owner);}
SaveAsCommand.prototype.doit=function(){if(this.owner!=null){var newName=prompt("Save File As...",currentFile);if(newName!=null&&newName!=""){currentFile=newName;saveFile([this.owner.createXML()]);this.owner.background.setStatus(newName);}}};
SelectAllCommand.prototype=new Command();
SelectAllCommand.prototype.constructor=SelectAllCommand;
SelectAllCommand.superclass=Command.prototype;
SelectAllCommand.VERSION=1.0;
function SelectAllCommand(owner){if(arguments.length>0)this.init(owner);}
SelectAllCommand.prototype.doit=function(){if(this.owner!=null){this.owner.selectAll();}};
ViewSVGCommand.prototype=new Command();
ViewSVGCommand.prototype.constructor=ViewSVGCommand;
ViewSVGCommand.superclass=Command.prototype;
ViewSVGCommand.VERSION=1.0;
ViewSVGCommand.COUNTER=2;
function ViewSVGCommand(owner){if(arguments.length>0)this.init(owner);}
ViewSVGCommand.prototype.doit=function(){if(this.owner!=null){this.owner.graphToSVG();}};
AttributeType.VERSION=1.0;
function AttributeType(){this.init();}
AttributeType.prototype.init=function(){this.name="attribute";};
AttributeType.prototype.applyToSVGNode=function(svgParent,svgNode,inPort){var edge=inPort.getFirstEdge();var ns=null;if(inPort.name.match(/^xlink:/))ns=xlinkNS;svgNode.setAttributeNS(ns,inPort.name,edge.getValue());};
CTFunctionType.VERSION=1.0;
function CTFunctionType(){this.init();}
CTFunctionType.prototype.init=function(){this.name="ctFunction";};
CTFunctionType.prototype.applyToSVGNode=function(svgParent,svgNode,inPort){var svgNodeName="feFunc"+inPort.name.toUpperCase();var feFuncNode=svgDocument.createElementNS(svgNS,svgNodeName);var DAGNode=inPort.getFirstEdge().getInputNode();feFuncNode.setAttributeNS(null,"type",DAGNode.interface.name);for(var i=0;i<DAGNode.inputs.getLength();i++){var input=DAGNode.inputs.getItem(i);input.toXML(svgParent,feFuncNode);}svgNode.appendChild(feFuncNode);};
FEMergeNodeType.VERSION=1.0;
function FEMergeNodeType(){this.init();}
FEMergeNodeType.prototype.init=function(){this.name="feMergeNode";};
FEMergeNodeType.prototype.applyToSVGNode=function(svgParent,svgNode,inPort){var svgMergeNode=svgDocument.createElementNS(svgNS,this.name);var edge=inPort.getFirstEdge();var DAGNode=edge.getInputNode();if(DAGNode.constructor===Element){var reference=edge.getOutputName();var child=edge.getNode(svgParent);if(child){svgParent.appendChild(child);child.setAttributeNS(null,"result",reference);svgMergeNode.setAttributeNS(null,"in",reference);}}else if(DAGNode.constructor===Literal){svgMergeNode.setAttributeNS(null,"in",edge.getValue());}else{throw"Unrecognized DAGNode class in Port::toXML";}svgNode.appendChild(svgMergeNode);};
NodeType.VERSION=1.0;
function NodeType(){this.init();}
NodeType.prototype.init=function(){this.name="node";};
NodeType.prototype.applyToSVGNode=function(svgParent,svgNode,inPort){var edge=inPort.getFirstEdge();var child=edge.getNode(svgNode);if(child)svgNode.appendChild(child);};
StdInOrReferenceType.VERSION=1.0;
function StdInOrReferenceType(){this.init();}
StdInOrReferenceType.prototype.init=function(){this.name="stdin-or-reference";};
StdInOrReferenceType.prototype.applyToSVGNode=function(svgParent,svgNode,inPort){var edge=inPort.getFirstEdge();var DAGNode=edge.getInputNode();if(DAGNode.constructor===Element){var reference=edge.getOutputName();var outputGenId=edge.getOutputGenId();if(outputGenId!=inPort.owner.genId){var child=edge.getNode(svgParent);if(child){svgParent.appendChild(child);child.setAttributeNS(null,"result",reference);}}svgNode.setAttributeNS(null,inPort.name,reference);}else if(DAGNode.constructor===Literal){svgNode.setAttributeNS(null,inPort.name,edge.getValue());}else{throw"Unrecognized DAGNode class in Port::toXML";}};
Widget.VERSION=1.0;
function Widget(name,owner){if(arguments.length>0)this.init(name,owner);}
Widget.prototype.init=function(name,owner){this.name=name;this.owner=owner;this.svgNodes={};this.x=0;this.y=0;this.width=0;this.height=0;this.id="";this.selected=false;};
Widget.prototype.dispose=function(){var root=this.svgNodes.root;if(root!=null){root.parentNode.removeChild(root);}};
Widget.prototype.realize=function(parentNode){this._createSVG(parentNode);this._createEventListeners();}
Widget.prototype._createSVG=function(parentNode){this.svgNodes.root=createElement("g");parentNode.appendChild(this.svgNodes.root);};
Widget.prototype._createEventListeners=function(){};
Widget.prototype.bringToFront=function(){var node=this.svgNodes.root;var parent=node.parentNode;parent.appendChild(node);};
Widget.prototype.show=function(){this.svgNodes.root.setAttributeNS(null,"display","inline");};
Widget.prototype.hide=function(){this.svgNodes.root.setAttributeNS(null,"display","none");};
Widget.prototype.inRect=function(rect){var root=this.svgNodes.root;var region=this.svgNodes.mouseRegion;var CTM=root.getCTM();var bbox=region.getBBox();bbox.x+=CTM.e;bbox.y+=CTM.f;var rectX=new Interval(rect.x,rect.x+rect.width);var rectY=new Interval(rect.y,rect.y+rect.height);var shapeX=new Interval(bbox.x,bbox.x+bbox.width);var shapeY=new Interval(bbox.y,bbox.y+bbox.height);return rectX.isOverlapping(shapeX)&&rectY.isOverlapping(shapeY);};
Widget.prototype.update=function(){this.svgNodes.root.setAttributeNS(null,"transform","translate("+this.x+","+this.y+")");};
Widget.prototype.handleEvent=function(e){if(this[e.type]==null)throw"Unsuppored event: "+e.type;this[e.type](e);};
Widget.prototype.addEventListener=function(type,handler,capture){this.svgNodes.root.addEventListener(type,handler,capture);};
Widget.prototype.removeEventListener=function(type,handler,capture){this.svgNodes.root.removeEventListener(type,handler,capture);};
Widget.prototype.getAttribute=function(name){var value=this[name];if(value==null)throw"Unrecognized attribute name: "+name;return value;};
Widget.prototype.setAttribute=function(name,value){if(this[name]==null)throw"Unrecognized attribute name: "+name;var handler="_set_"+name;this[name]=value;if(this[handler]!=null)this[handler](value);};
Button.prototype=new Widget();
Button.prototype.constructor=Button;
Button.superclass=Widget.prototype;
Button.VERSION=1.0;
function Button(name,label,owner){if(arguments.length>0)this.init(name,label,owner);}
Button.prototype.init=function(name,label,owner){Button.superclass.init.call(this,name,owner);this.label=label;};
Button.prototype._createSVG=function(parentNode){Button.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;this.svgNodes.background=createElement("rect",{rx:3,ry:3,width:this.width,height:this.height,"class":"button"});root.appendChild(this.svgNodes.background);this.svgNodes.label=createElement("text",{x:this.width/ 2, y: this.height /2,"class":"button-label"});this.svgNodes.label.appendChild(createElement("tspan",{dy:"0.33em"},this.label));root.appendChild(this.svgNodes.label);this.svgNodes.mouseRegion=createElement("rect",{rx:3,ry:3,width:this.width,height:this.height,"class":"mouseRegion"});root.appendChild(this.svgNodes.mouseRegion);this.update();};
Button.prototype._createEventListeners=function(){this.addEventListener("mousedown",this,false);this.addEventListener("mouseup",this,false);this.addEventListener("mouseout",this,false);};
Button.prototype.mousedown=function(e){this.select(true);};
Button.prototype.mouseup=function(e){if(this.selected){var elem=this.owner.createElementWithDefaults(this.name);elem.setAttribute("x",10);elem.setAttribute("y",this.y);this.owner.appendChild(elem);this.select(false);}};
Button.prototype.mouseout=function(e){this.select(false);};
Button.prototype.select=function(value){if(this.selected!=value){var node=this.svgNodes.background;if(value){node.setAttributeNS(null,"class","button-selected");}else{node.setAttributeNS(null,"class","button");}this.selected=value;}};
Console.prototype=new Widget();
Console.prototype.constructor=Console;
Console.superclass=Widget.prototype;
Console.VERSION=1.0;
function Console(owner){if(arguments.length>0)this.init("#console",owner);}
Console.prototype._createSVG=function(parentNode){this.svgNodes.root=createElement("text",{"class":"console"});this.svgNodes.root.setAttributeNS(xmlNS,"xml:space","preserve");parentNode.appendChild(this.svgNodes.root);this.update();};
Console.prototype.addLine=function(line){var text=this.svgNodes.root;var tspan=svgDocument.createElementNS(svgNS,"tspan");var tnode=svgDocument.createTextNode(line);tspan.setAttributeNS(null,"x","0");tspan.setAttributeNS(null,"dy","1em");tspan.appendChild(tnode);text.appendChild(tspan);};
Console.prototype.clear=function(){var text=this.svgNodes.root;while(text.firstChild)text.removeChild(text.firstChild);};
DAGNode.prototype=new Widget();
DAGNode.prototype.constructor=DAGNode;
DAGNode.superclass=Widget.prototype;
DAGNode.VERSION=1.0;
DAGNode.counter=1;
function DAGNode(interface,owner){if(arguments.length>0)this.init(interface,owner);}
DAGNode.prototype.init=function(interface,owner){DAGNode.superclass.init.call(this,interface.label,owner);this.interface=interface;this.inputs=new OrderedHash();this.output=null;this.getId=null;};
DAGNode.prototype.dispose=function(){for(var i=0;i<this.inputs.getLength();i++){var port=this.inputs.getItem(i);if(port!=null)port.dispose();}if(this.output!=null)this.output.dispose();DAGNode.superclass.dispose.call(this);};
DAGNode.prototype.realize=function(parentNode){DAGNode.superclass.realize.call(this,parentNode);for(var i=0;i<this.inputs.getLength();i++)this.inputs.getItem(i).realize(this.svgNodes.root);this.distributeInputs();this._createOutputs();};
DAGNode.prototype._createEventListeners=function(){var mouseRegion=this.svgNodes.mouseRegion;mouseRegion.addEventListener("mousedown",this,false);};
DAGNode.prototype.addInput=function(name){var root=this.svgNodes.root;var typeName=this.interface.getInputType(name);if(typeName==null)throw"Unsupported input port name: "+name;var type=this.owner.types[typeName];if(type==null)throw"The "+name+" input port uses unknown type "+type;var port=new Port(Port.INPUT,name,type,this,this.owner);this.inputs.setNamedItem(name,port);if(root!=null){port.realize(root);this.distributeInputs();}};
DAGNode.prototype.distributeInputs=function(){var count=this.inputs.getLength();var bbox=this.svgNodes.mouseRegion.getBBox();var step=bbox.width/(count+1);for(var i=0;i<count;i++){var port=this.inputs.getItem(i);port.setAttribute("cx",bbox.x+i*step+step);port.setAttribute("cy",bbox.y-Port.RADIUS-1);}};
DAGNode.prototype._createOutputs=function(){var name;if(this.constructor===Element){name="result"+DAGNode.counter++;}else if(this.constructor===Literal){name=this.name;}else{throw"Unknown DAGNode class in _createOutputs";}this.output=new Port(Port.OUTPUT,name,null,this,this.owner);this.centerOutput();this.output.realize(this.svgNodes.root);};
DAGNode.prototype.centerOutput=function(){if(this.output!=null){var bbox=this.svgNodes.mouseRegion.getBBox();var xmid=bbox.x+bbox.width/2;var y=bbox.y+bbox.height;this.output.setAttribute("cx",xmid);this.output.setAttribute("cy",y+Port.RADIUS+1);}};
DAGNode.prototype.moveto=function(x,y){this.x=x;this.y=y;this.update();};
DAGNode.prototype.rmoveto=function(dx,dy){this.x+=dx;this.y+=dy;this.update();};
DAGNode.prototype.update=function(){for(var i=0;i<this.inputs.getLength();i++){var edge=this.inputs.getItem(i).edges[0];if(edge!=null)edge.updateOutput();}if(this.output!=null){var edges=this.output.edges;for(var i=0;i<edges.length;i++){var edge=edges[i];if(edge!=null)edge.updateInput();}}};
DAGNode.prototype.getValue=function(){};
DAGNode.prototype._toXML=function(parent){var node=this._createXMLNode();node.setAttributeNS(null,"id",this.getAttribute("id"));node.setAttributeNS(null,"x",this.getAttribute("x"));node.setAttributeNS(null,"y",this.getAttribute("y"));for(var i=0;i<this.inputs.getLength();i++){var input=this.inputs.getItem(i);var inputNode=svgDocument.createElementNS(null,"input");var edge=input.edges[0];inputNode.setAttributeNS(null,"name",input.name);node.appendChild(inputNode);if(edge!=null){var inputElem=edge.inPort.parent;var edgeNode=svgDocument.createElementNS(null,"edge");edgeNode.setAttributeNS(null,"output",inputElem.getAttribute("id"));edgeNode.setAttributeNS(null,"input",this.getAttribute("id"));edgeNode.setAttributeNS(null,"name",input.name);parent.appendChild(edgeNode);}}return node;};
DAGNode.prototype._createXMLNode=function(){};
DAGNode.prototype.mousedown=function(e){var owner=this.owner;if(e.shiftKey){if(this.selected){owner.deselectChild("nodes",this);}else{owner.selectChild("nodes",this);owner.dragSelection(e);}}else{if(this.selected){owner.dragSelection(e);}else{owner.deselectAll("nodes");owner.selectChild("nodes",this);owner.dragSelection(e);}}};
Edge.prototype=new Widget();
Edge.prototype.constructor=Edge;
Edge.superclass=Widget.prototype;
Edge.VERSION=1.0;
function Edge(inPort,outPort,owner){if(arguments.length>0)this.init(inPort,outPort,owner);}
Edge.prototype.init=function(inPort,outPort,owner){Edge.superclass.init.call(this,"#edge",owner);this.inPort=inPort;this.outPort=outPort;inPort.edges.push(this);outPort.edges.push(this);};
Edge.prototype.dispose=function(port){var root=this.svgNodes.root;root.parentNode.removeChild(root);this.svgNodes.root=null;if(port===this.inPort){this.outPort.removeEdge(this);}else if(port===this.outPort){this.inPort.removeEdge(this);}else{throw"Edge does not contain referenced Port";}this.inPort=null;this.outPort=null;};
Edge.prototype._createSVG=function(parentNode){this.svgNodes.root=createElement("line",{"class":"edge"});this.update();parentNode.appendChild(this.svgNodes.root);};
Edge.prototype.getValue=function(){var result=this.inPort.getValue();this.inPort.genId=this.owner.genId;return result;};
Edge.prototype.getNode=function(filterNode){var result=this.inPort.getNode(filterNode);this.inPort.genId=this.owner.genId;return result;};
Edge.prototype.getInputNode=function(){return this.inPort.parent;};
Edge.prototype.getOutputName=function(){return this.inPort.name;};
Edge.prototype.getOutputGenId=function(){return this.inPort.genId;};
Edge.prototype.update=function(){this.updateInput();this.updateOutput();};
Edge.prototype.updateInput=function(){var root=this.svgNodes.root;var p1=this.inPort.getUserCoordinate();root.setAttributeNS(null,"x1",p1.x);root.setAttributeNS(null,"y1",p1.y);};
Edge.prototype.updateOutput=function(){var root=this.svgNodes.root;var p2=this.outPort.getUserCoordinate();root.setAttributeNS(null,"x2",p2.x);root.setAttributeNS(null,"y2",p2.y);};
InfoBar.prototype=new Widget();
InfoBar.prototype.constructor=InfoBar;
InfoBar.superclass=Widget.prototype;
InfoBar.VERSION=1.0;
InfoBar.PADDING_LEFT=3;
InfoBar.PADDING_TOP=3;
InfoBar.PADDING_BOTTOM=3;
function InfoBar(name,owner){if(arguments.length>0)this.init(name,owner);}
InfoBar.prototype._createSVG=function(parentNode){InfoBar.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;var parentSize={width:innerWidth,height:innerHeight};var bbox;var tx,ty;this.svgNodes.label=this._makeLabel();bbox=this.svgNodes.label.getBBox();this.svgNodes.background=createElement("rect",{x:bbox.x-InfoBar.PADDING_LEFT,y:bbox.y-InfoBar.PADDING_TOP,width:parentSize.width,height:bbox.height+InfoBar.PADDING_TOP+InfoBar.PADDING_BOTTOM,"class":"infobar"});root.appendChild(this.svgNodes.background);root.appendChild(this.svgNodes.label);tx=InfoBar.PADDING_LEFT-bbox.x;ty=parentSize.height-bbox.y-(bbox.height+InfoBar.PADDING_BOTTOM);root.setAttributeNS(null,"transform","translate("+tx+","+ty+")");};
InfoBar.prototype._createEventListeners=function(){svgDocument.rootElement.addEventListener("SVGResize",this,false);};
InfoBar.prototype._makeLabel=function(){var text=svgDocument.createElementNS(svgNS,"text");var tnode=svgDocument.createTextNode(this.name);text.setAttributeNS(null,"pointer-events","none");text.setAttributeNS(null,"class","infobar-label");text.appendChild(tnode);return text;};
InfoBar.prototype.SVGResize=function(e){var root=this.svgNodes.root;var rect=this.svgNodes.background;var bbox=this.svgNodes.label.getBBox();var parentSize={width:innerWidth,height:innerHeight};var tx,ty;rect.setAttributeNS(null,"width",parentSize.width);tx=InfoBar.PADDING_LEFT-bbox.x;ty=parentSize.height-bbox.y-(bbox.height+InfoBar.PADDING_BOTTOM);root.setAttributeNS(null,"transform","translate("+tx+","+ty+")");};
InfoBar.prototype.setLabel=function(text){var label=this.svgNodes.label;if(label){label.firstChild.data=text;}};
MenuBar.prototype=new Widget();
MenuBar.prototype.constructor=MenuBar;
MenuBar.superclass=Widget.prototype;
MenuBar.VERSION=1.0;
function MenuBar(name,owner){if(arguments.length>0)this.init(name,owner);}
MenuBar.prototype.init=function(name,owner){MenuBar.superclass.init.call(this,name,owner);this.menuItems=[];this.currentMenuItem=null;};
MenuBar.prototype._createSVG=function(parentNode){MenuBar.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;var parentSize={width:innerWidth,height:innerHeight};this.svgNodes.background=createElement("rect",{width:parentSize.width,height:15,"class":"menubar"});root.appendChild(this.svgNodes.background);root.setAttributeNS(null,"transform","translate("+this.x+","+this.y+")");};
MenuBar.prototype._createEventListeners=function(){svgDocument.rootElement.addEventListener("SVGResize",this,false);this.addEventListener("mousedown",this,false);};
MenuBar.prototype._updateHeight=function(){if(this.svgNodes.root!=null){var height=0;for(var i=0;i<this.menuItems.length;i++){var miHeight=this.menuItems[i]._getHeight();if(miHeight>height)height=miHeight;}this.svgNodes.background.setAttributeNS(null,"height",height);}};
MenuBar.prototype.addMenuItem=function(name,callback,items){var mi=new MenuItem(name,null,this,this.owner);var x;if(this.menuItems.length==0){x=MenuItem.PADDING_LEFT;}else{var lastMenuItem=this.menuItems[this.menuItems.length-1];x=lastMenuItem.getAttribute("x");x+=lastMenuItem.getAttribute("width");x+=MenuItem.PADDING_RIGHT;}mi.setAttribute("x",x);this.menuItems.push(mi);mi.realize(this.svgNodes.root);mi.svgNodes.root.setAttributeNS(null,"display","inline");this._updateHeight();if(items!=null){for(var i=0;i<items.length;i++){mi.addMenuItem(items[i],callback);}}};
MenuBar.prototype.selectItem=function(menuItem){if(this.currentMenuItem!=null)this.currentMenuItem.select(false);if(this.currentMenuItem==menuItem){menuItem.select(false);this.currentMenuItem=null;}else{this.currentMenuItem=menuItem;this.currentMenuItem.select(true);}};
MenuBar.prototype.mousedown=function(e){if(this.currentMenuItem!=null){this.currentMenuItem.select(false);this.currentMenuItem=null;}};
MenuBar.prototype.SVGResize=function(e){var rect=this.svgNodes.background;var parentSize={width:innerWidth,height:innerHeight};rect.setAttributeNS(null,"width",parentSize.width);};
MenuItem.prototype=new Widget();
MenuItem.prototype.constructor=MenuItem;
MenuItem.superclass=Widget.prototype;
MenuItem.VERSION=1.0;
MenuItem.PADDING_LEFT=5;
MenuItem.PADDING_RIGHT=5;
function MenuItem(name,callback,parent,owner){if(arguments.length>0)this.init(name,callback,parent,owner);}
MenuItem.prototype.init=function(name,callback,parent,owner){MenuItem.superclass.init.call(this,name,owner);this.callback=callback;this.parent=parent;this.menuItems=[];this.currentMenuItem=null;};
MenuItem.prototype._createSVG=function(parentNode){MenuItem.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;root.setAttributeNS(null,"display","none");this.svgNodes.label=createElement("text",{x:MenuItem.PADDING_LEFT,y:"1em","class":"menuitem-label"},this.name);var bbox=this.svgNodes.label.getBBox();this.width=bbox.width+MenuItem.PADDING_LEFT+MenuItem.PADDING_RIGHT;this.svgNodes.background=createElement("rect",{width:this.width,height:"1.4em","class":"menuitem"});root.appendChild(this.svgNodes.background);root.appendChild(this.svgNodes.label);this.svgNodes.mouseRegion=createElement("rect",{width:this.width,height:"1.4em","class":"mouseRegion"});root.appendChild(this.svgNodes.mouseRegion);for(var i=0;i<this.menuItems.length;i++){this.menuItems[i].realize(root);}this._adjustWidths();this.update();};
MenuItem.prototype._createEventListeners=function(){var node=this.svgNodes.mouseRegion;node.addEventListener("mousedown",this,false);};
MenuItem.prototype._getHeight=function(){var result=0;if(this.svgNodes.root!=null){result=this.svgNodes.background.getBBox().height;}return result;};
MenuItem.prototype._adjustWidths=function(){var maxWidth=0;for(var i=0;i<this.menuItems.length;i++){var width=this.menuItems[i].getAttribute("width");if(width>maxWidth)maxWidth=width;}for(var i=0;i<this.menuItems.length;i++){this.menuItems[i].setAttribute("width",maxWidth);}};
MenuItem.prototype.addMenuItem=function(name,callback){var mi=new MenuItem(name,callback,this,this.owner);var height;if(this.menuItems.length==0){height=this._getHeight();}else{var lastMenuItem=this.menuItems[this.menuItems.length-1];height=lastMenuItem.getAttribute("y");height+=lastMenuItem._getHeight();}mi.setAttribute("x",0);mi.setAttribute("y",height);this.menuItems.push(mi);if(this.svgNodes.root!=null){mi.realize(this.svgNodes.root);this._adjustWidths();}};
MenuItem.prototype.selectItem=function(menuItem){if(this.currentMenuItem!=null)this.currentMenuItem.select(false);if(menuItem.callback){menuItem.callback.handleEvent({type:"menuselect",target:menuItem});this.parent.selectItem(this);}else{menuItem.select(true);this.currentMenuItem=menuItem;}};
MenuItem.prototype.mousedown=function(e){this.parent.selectItem(this);e.stopPropagation();};
MenuItem.prototype.select=function(value){if(this.selected!=value){var node=this.svgNodes.background;if(value){node.setAttributeNS(null,"class","menuitem-selected");}else{node.setAttributeNS(null,"class","menuitem");}this.selected=value;if(this.currentMenuItem!=null)this.currentMenuItem.select(false);var display=(value)?"inline":"none";for(var i=0;i<this.menuItems.length;i++){this.menuItems[i].svgNodes.root.setAttributeNS(null,"display",display);}}};
MenuItem.prototype._set_width=function(value){if(this.svgNodes.root!=null){this.svgNodes.background.setAttribute("width",value);this.svgNodes.mouseRegion.setAttribute("width",value);}};
MouseRegion.prototype=new Widget();
MouseRegion.prototype.constructor=MouseRegion;
MouseRegion.superclass=Widget.prototype;
MouseRegion.VERSION=1.0;
MouseRegion.TOP=0;
MouseRegion.BOTTOM=1;
function MouseRegion(position,owner){if(arguments.length>0)this.init("#mouseRegion",position,owner);}
MouseRegion.prototype.init=function(name,position,owner){MouseRegion.superclass.init.call(this,name,owner);this.position=position;};
MouseRegion.prototype._createSVG=function(parentNode){var rect=createElement("rect",{width:"100%",height:"100%","class":"mouseRegion"});this.svgNodes.root=rect;if(this.position==MouseRegion.TOP){parentNode.appendChild(rect);}else if(this.position==MouseRegion.BOTTOM){if(parentNode.hasChildNodes()){parentNode.insertBefore(rect,parentNode.firstChild);}else{parentNode.appendChild(rect);}}else{throw"Unrecognized MouseRegion position: "+this.layer;}};
Port.prototype=new Widget();
Port.prototype.constructor=Port;
Port.superclass=Widget.prototype;
Port.VERSION=1.0;
Port.RADIUS=2;
Port.INPUT=0;
Port.OUTPUT=1;
function Port(inOrOut,name,type,parent,owner){if(arguments.length>0)this.init(inOrOut,name,type,parent,owner);}
Port.prototype.init=function(inOrOut,name,type,parent,owner){Port.superclass.init.call(this,name,owner);this.inOrOut=inOrOut;this.type=type;this.cx=0;this.cy=0;this.parent=parent;this.edges=[];this.genId=null;};
Port.prototype.dispose=function(){for(var i=0;i<this.edges.length;i++){this.edges[i].dispose(this);}Port.superclass.dispose.call(this);};
Port.prototype._createSVG=function(parentNode){var circle=createElement("circle",{cx:this.cx,cy:this.cy,r:Port.RADIUS,"class":"port"});parentNode.appendChild(circle);this.svgNodes.root=circle;};
Port.prototype._createEventListeners=function(){var mouseRegion=this.svgNodes.root;mouseRegion.addEventListener("mousedown",this,false);mouseRegion.addEventListener("mouseover",this,false);};
Port.prototype.getValue=function(){return this.parent.getValue();};
Port.prototype.getNode=function(filterNode){return this.parent.toXML(filterNode);};
Port.prototype.removeEdge=function(edge){for(var i=0;i<this.edges.length;i++){if(edge===this.edges[i]){this.edges.splice(i,1);break;}}};
Port.prototype.toXML=function(filterNode,node){if(this.edges.length>0){this.type.applyToSVGNode(filterNode,node,this);}};
Port.prototype.hasEdges=function(){return this.edges.length>0;};
Port.prototype.getFirstEdge=function(){return this.edges[0];};
Port.prototype.getUserCoordinate=function(){var root=this.svgNodes.root;var nodes=this.owner.svgNodes.nodes;var trans=getTransformToElement(root,nodes);var point=svgDocument.rootElement.createSVGPoint();var p1;point.x=root.getAttributeNS(null,"cx");point.y=root.getAttributeNS(null,"cy");return point.matrixTransform(trans);};
Port.prototype.select=function(value){if(this.selected!=value){var node=this.svgNodes.root;if(value){node.setAttributeNS(null,"class","port-selected");}else{node.setAttributeNS(null,"class","port");}this.selected=value;}};
Port.prototype.mousedown=function(e){if(e.detail==1){if(e.ctrlKey){if(this.inOrOut==Port.INPUT&&this.edges.length==0){var position=this.getUserCoordinate();var literal=this.owner.createLiteralWithDefaults("?");literal.setAttribute("x",position.x-10);literal.setAttribute("y",position.y-40);this.owner.appendChild(literal);this.owner.connectToInput(literal.output,this);}else{for(var i=0;i<this.edges.length;i++){this.edges[i].dispose(this);}this.edges=[];}}else{if(this.selected==false){if(this.owner.port!=null){if(this.owner.port.inOrOut!=this.inOrOut){var inPort,outPort;if(this.inOrOut==Port.INPUT){inPort=this;outPort=this.owner.port;}else{inPort=this.owner.port;outPort=this;}this.owner.connectToInput(outPort,inPort);this.owner.port.select(false);this.owner.port=null}else{}}else{this.owner.port=this;this.select(true);}}}}else if(e.detail==2){var newName=prompt("Output Port Name",this.name);if(newName!=null&&newName!=""){this.name=newName;this.setAttribute("id",newName);}}};
Port.prototype.mouseover=function(e){this.owner.infobar.setLabel(this.name);};
Port.prototype._set_cx=function(){var root=this.svgNodes.root;if(root!=null)root.setAttributeNS(null,"cx",this.cx);};
Port.prototype._set_cy=function(){var root=this.svgNodes.root;if(root!=null)root.setAttributeNS(null,"cy",this.cy);};
Element.prototype=new DAGNode();
Element.prototype.constructor=Element;
Element.superclass=DAGNode.prototype;
Element.VERSION=1.0;
Element.PADDING_TOP=4;
Element.PADDING_BOTTOM=4;
Element.PADDING_LEFT=15;
Element.PADDING_RIGHT=15;
function Element(interface,owner){if(arguments.length>0)this.init(interface,owner);}
Element.prototype._createSVG=function(parentNode){Element.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;var labelBBox;var tx,ty;this.svgNodes.label=createElement("text",{"class":"element-label"},this.name);labelBBox=this.svgNodes.label.getBBox();this.width=labelBBox.width+Element.PADDING_LEFT+Element.PADDING_RIGHT;this.height=labelBBox.height+Element.PADDING_TOP+Element.PADDING_BOTTOM;this.svgNodes.background=createElement("rect",{x:labelBBox.x-Element.PADDING_LEFT,y:labelBBox.y-Element.PADDING_TOP,rx:3,ry:3,width:this.width,height:this.height,"class":"element"});root.appendChild(this.svgNodes.background);root.appendChild(createElement("rect",{x:labelBBox.x-2,y:labelBBox.y-2,rx:3,ry:3,width:labelBBox.width+4,height:labelBBox.height+4,"class":"knockout"}));root.appendChild(this.svgNodes.label);this.svgNodes.mouseRegion=createElement("rect",{x:labelBBox.x-Element.PADDING_LEFT,y:labelBBox.y-Element.PADDING_TOP,rx:3,ry:3,width:this.width,height:this.height,"class":"mouseRegion"});root.appendChild(this.svgNodes.mouseRegion);this.update();};
Element.prototype.update=function(){var root=this.svgNodes.root;var bbox=this.svgNodes.label.getBBox();var tx=this.x-bbox.x+Element.PADDING_LEFT;var ty=this.y-bbox.y+Element.PADDING_TOP;root.setAttributeNS(null,"transform","translate("+tx+","+ty+")");Element.superclass.update.call(this);};
Element.prototype.toXML=function(filterNode){var node=svgDocument.createElementNS(svgNS,this.interface.name);if(filterNode==null)filterNode=node;for(var j=0;j<this.inputs.getLength();j++){this.inputs.getItem(j).toXML(filterNode,node);}return node;};
Element.prototype._toXML=function(parent){var node=Element.superclass._toXML.call(this,parent);node.setAttributeNS(null,"type",this.interface.name);if(this.output){var outputNode=svgDocument.createElementNS(null,"output");outputNode.setAttributeNS(null,"name",this.output.name);node.appendChild(outputNode);}return node;};
Element.prototype._createXMLNode=function(){return svgDocument.createElementNS(null,"element");};
Element.prototype.select=function(value){if(this.selected!=value){var node=this.svgNodes.background;if(value){node.setAttributeNS(null,"class","element-selected");}else{node.setAttributeNS(null,"class","element");}this.selected=value;}};
Literal.prototype=new DAGNode();
Literal.prototype.constructor=Literal;
Literal.superclass=DAGNode.prototype;
Literal.VERSION=1.0;
Literal.PADDING_TOP=4;
Literal.PADDING_BOTTOM=4;
Literal.PADDING_LEFT=8;
Literal.PADDING_RIGHT=8;
function Literal(interface,owner){if(arguments.length>0)this.init(interface,owner);}
Literal.prototype._createSVG=function(parentNode){Literal.superclass._createSVG.call(this,parentNode);var root=this.svgNodes.root;this.svgNodes.background=createElement("rect",{"class":"literal"});root.appendChild(this.svgNodes.background);this.svgNodes.bar=createElement("line",{"class":"literal-bar"});root.appendChild(this.svgNodes.bar);this.svgNodes.knockout=createElement("rect",{"class":"knockout"});root.appendChild(this.svgNodes.knockout);this.svgNodes.label=this._makeLabel();root.appendChild(this.svgNodes.label);this.svgNodes.mouseRegion=createElement("rect",{"class":"mouseRegion"});root.appendChild(this.svgNodes.mouseRegion);this.updateSize();this.update();};
Literal.prototype._createEventListeners=function(){var mouseRegion=this.svgNodes.mouseRegion;mouseRegion.addEventListener("mousedown",this,false);};
Literal.prototype._makeLabel=function(){var label=createElement("text",{"class":"literal-label","xml:space":"preserve"});var lines=this.name.split(/[\r\n]/);this.svgNodes.label=label;for(var i=0;i<lines.length;i++){this.addTspan(lines[i]);}return label;};
Literal.prototype.getValue=function(){var result="";var lines=[];var node=this.svgNodes.label.firstChild;while(node){lines.push(node.firstChild.data);node=node.nextSibling;}return lines.join("\n");};
Literal.prototype._toXML=function(parent){var node=Element.superclass._toXML.call(this,parent);node.appendChild(svgDocument.createTextNode(this.getValue()));return node;};
Literal.prototype._createXMLNode=function(){return svgDocument.createElementNS(null,"literal");};
Literal.prototype.update=function(){var root=this.svgNodes.root;var bbox=this.svgNodes.label.getBBox();var tx=this.x-bbox.x+Literal.PADDING_LEFT;var ty=this.y-bbox.y+Literal.PADDING_TOP;root.setAttributeNS(null,"transform","translate("+tx+","+ty+")");Literal.superclass.update.call(this);};
Literal.prototype.updateSize=function(){var background=this.svgNodes.background;var bar=this.svgNodes.bar;var knockout=this.svgNodes.knockout;var mouseRegion=this.svgNodes.mouseRegion;var labelBBox=this.svgNodes.label.getBBox();if(labelBBox.width<1||labelBBox.height<1){}else{this.width=labelBBox.width+Literal.PADDING_LEFT+Literal.PADDING_RIGHT;this.height=labelBBox.height+Literal.PADDING_TOP+Literal.PADDING_BOTTOM;background.setAttributeNS(null,"x",labelBBox.x-Literal.PADDING_LEFT);background.setAttributeNS(null,"y",labelBBox.y-Literal.PADDING_TOP);background.setAttributeNS(null,"width",this.width);background.setAttributeNS(null,"height",this.height);var x1=labelBBox.x-Literal.PADDING_LEFT;var y=labelBBox.y+labelBBox.height+Literal.PADDING_BOTTOM;var x2=x1+Literal.PADDING_LEFT+labelBBox.width+Literal.PADDING_RIGHT;bar.setAttributeNS(null,"x1",x1);bar.setAttributeNS(null,"y1",y);bar.setAttributeNS(null,"x2",x2);bar.setAttributeNS(null,"y2",y);knockout.setAttributeNS(null,"x",labelBBox.x-2);knockout.setAttributeNS(null,"y",labelBBox.y-2);knockout.setAttributeNS(null,"width",labelBBox.width+4);knockout.setAttributeNS(null,"height",labelBBox.height+4);mouseRegion.setAttributeNS(null,"x",labelBBox.x-Literal.PADDING_LEFT);mouseRegion.setAttributeNS(null,"y",labelBBox.y-Literal.PADDING_TOP);mouseRegion.setAttributeNS(null,"width",this.width);mouseRegion.setAttributeNS(null,"height",this.height);if(this.output!=null){this.centerOutput();if(this.output.hasEdges()){var edges=this.output.edges;for(var i=0;i<edges.length;i++){edges[i].updateInput();}}}}};
Literal.prototype.select=function(value){if(this.selected!=value){var node=this.svgNodes.background;if(value){node.setAttributeNS(null,"class","literal-selected");}else{node.setAttributeNS(null,"class","literal");}this.selected=value;}};
Literal.prototype.mousedown=function(e){if(e.detail==2){this.owner.textbox=this;this.svgNodes.background.setAttributeNS(null,"class","literal-editable");}else{Literal.superclass.mousedown.call(this,e);}};
Literal.prototype.keypress=function(e){var key=e.charCode;if(key>=32&&key<=127){this.addChar(String.fromCharCode(key));}else if(key==8){this.deleteChar();}else if(key==13){this.addTspan("");}else{}e.stopPropagation();};
Literal.prototype.addChar=function(char){var textbox=this.svgNodes.label;if(!textbox.hasChildNodes())this.addTspan("",0);var tspan=textbox.lastChild;var data=tspan.firstChild;data.appendData(char);this.updateSize();};
Literal.prototype.deleteChar=function(){var textbox=this.svgNodes.label;if(textbox.hasChildNodes()){var tspan=textbox.lastChild;var data=tspan.firstChild;var length=data.length;if(length>1){data.deleteData(length-1,1);}else{textbox.removeChild(tspan);}this.updateSize();}};
Literal.prototype.addTspan=function(char){var textbox=this.svgNodes.label;var offset="1em";if(!textbox.hasChildNodes())offset="0";var tspan=createElement("tspan",{x:0,dy:offset},char);textbox.appendChild(tspan);};
Background.prototype=new MouseRegion();
Background.prototype.constructor=Background;
Background.superclass=MouseRegion.prototype;
Background.VERSION=1.0;
function Background(owner){if(arguments.length>0)this.init("#background",MouseRegion.BOTTOM,owner);}
Background.prototype.init=function(name,layer,owner){Background.superclass.init.call(this,name,layer,owner);this.status="untitled-1";};
Background.prototype._createEventListeners=function(){this.addEventListener("mouseover",this,false);this.addEventListener("mousedown",this,false);};
Background.prototype.setStatus=function(text){this.status=text;this.owner.infobar.setLabel(this.status);};
Background.prototype.mouseover=function(e){this.owner.infobar.setLabel(this.status);};
Background.prototype.mousedown=function(e){if(e.ctrlKey){}else if(e.altKey){}else{this.owner.deselectAll();if(this.owner.port){this.owner.port.select(false);this.owner.port=null;}if(this.owner.textbox){this.owner.textbox.select(false);this.owner.textbox=null;}this.owner.dragMarquee(e);}};
DragRegion.prototype=new MouseRegion();
DragRegion.prototype.constructor=DragRegion;
DragRegion.superclass=MouseRegion.prototype;
DragRegion.VERSION=1.0;
function DragRegion(position,owner){if(arguments.length>0)this.init("#dragRegion",position,owner);}
DragRegion.prototype.init=function(name,position,owner){DragRegion.superclass.init.call(this,name,position,owner);this.handlers={};this.startX=null;this.startY=null;this.lastX=null;this.lastY=null;};
DragRegion.prototype.addEventListener=function(type,handler,captures){if(this.handlers[type]==null)this.handlers[type]=[];this.handlers[type].push(handler);};
DragRegion.prototype.removeEventListener=function(type,handler,captures){var handlers=this.handlers[type];if(handlers==null)throw"No events of this type or registered with this dragger: "+type;for(var i=0;i<handlers.length;i++){if(handlers[i]===handler){handlers.splice(i,1);break;}}};
DragRegion.prototype.beginDrag=function(e){this.startX=e.clientX;this.startY=e.clientY;this.lastX=e.clientX;this.lastY=e.clientY;DragRegion.superclass.addEventListener.call(this,"mousemove",this,false);DragRegion.superclass.addEventListener.call(this,"mouseup",this,false);this.bringToFront();this.show();this.sendEvent(e,"dragbegin");};
DragRegion.prototype.mousemove=function(e){this.sendEvent(e,"drag");};
DragRegion.prototype.mouseup=function(e){this.sendEvent(e,"dragend");DragRegion.superclass.removeEventListener.call(this,"mousemove",this,false);DragRegion.superclass.removeEventListener.call(this,"mouseup",this,false);this.hide();};
DragRegion.prototype.sendEvent=function(e,type){var handlers=this.handlers[type];if(handlers!=null){var event=new DragEvent(e,type);event.startX=this.startX;event.startY=this.startY;event.lastX=this.lastX;event.lastY=this.lastY;for(var i=0;i<handlers.length;i++){handlers[i].handleEvent(event);}this.lastX=e.clientX;this.lastY=e.clientY;}};
DAGFilterApp.VERSION=1.0;
DAGFilterApp.NOTLOADED=0;
DAGFilterApp.LOADING=1;
DAGFilterApp.LOADED=2;
function DAGFilterApp(parent){if(arguments.length>0)this.init(parent);}
DAGFilterApp.prototype.init=function(parent){var root;this.types={};this.types.attribute=new AttributeType();this.types.ctFunction=new CTFunctionType();this.types.feMergeNode=new FEMergeNodeType();this.types.node=new NodeType();this.types['stdin-or-reference']=new StdInOrReferenceType();this.selections={};this.selections.nodes=new Selection(this);this.port=null;this.textbox=null;root=createElement("g",{id:"world",transform:"translate(130,0)"});this.svgNodes={};this.svgNodes.root=root;this.svgNodes.edges=createElement("g",{id:"edges"});this.svgNodes.nodes=createElement("g",{id:"nodes"});this.svgNodes.samples=createElement("g",{id:"samples","enable-background":"new"});this.svgNodes.buttons=createElement("g",{id:"buttons"});root.appendChild(this.svgNodes.edges);root.appendChild(this.svgNodes.nodes);root.appendChild(this.svgNodes.samples);parent.appendChild(root);parent.appendChild(this.svgNodes.buttons);this.literalId=1;this.interfaces={};this.nodes=[];this.xOffset=5;this.dragMode="";this.genId=0;this.id={};this.loadState=DAGFilterApp.NOTLOADED;this.loadSetup();this.menubar=new MenuBar("#menubar1",this);this.menubar.realize(parent);this.menubar.addMenuItem("File",this,["Open","New","Close","Save","Save As...","Export Filters"]);this.menubar.addMenuItem("Edit",this,["Cut","Copy","Paste","Delete","Select All"]);this.menubar.addMenuItem("View",this,["SVG","Clear"]);this.menubar.addMenuItem("Debug",this,["Dump All"]);this.menubar.addMenuItem("Help",this,[]);this.infobar=new InfoBar("OK",this);this.infobar.realize(parent);this.background=new Background(this);this.background.realize(root);this.foreground=new DragRegion(MouseRegion.TOP,this);this.foreground.realize(root);this.foreground.hide();this.marquee=createElement("rect",{"class":"marquee",display:"none"});root.appendChild(this.marquee);this.console=new Console(this);this.console.setAttribute("x",300);this.console.setAttribute("y",20);this.console.realize(root);};
DAGFilterApp.prototype.makeButtons=function(){var buttonWidth=120;var buttonHeight=15;var buttonPad=3;var buttonIndex=0;var keys=[];var interfaces=this.interfaces;for(var p in interfaces)keys.push(p);keys=keys.sort(function(a,b){labelA=interfaces[a].label;labelB=interfaces[b].label;if(labelA<labelB)return-1;if(labelA==labelB)return 0;if(labelA>labelB)return 1;});for(var i=0;i<keys.length;i++){var interface=this.interfaces[keys[i]];var button=new Button(interface.name,interface.label,this);button.setAttribute("x","4");button.setAttribute("y",buttonIndex*(buttonHeight+buttonPad)+4+15);button.setAttribute("width",buttonWidth);button.setAttribute("height",buttonHeight);button.realize(this.svgNodes.buttons);buttonIndex++;}};
DAGFilterApp.prototype.loadSetup=function(){getURL("DAGFilterEditor.xml",this);this.loadState=DAGFilterApp.LOADING;};
DAGFilterApp.prototype.operationComplete=function(status){if(status.success){var setup=parseXML(status.content);var interfaces=setup.getElementsByTagNameNS(null,"interface");for(var i=0;i<interfaces.length;i++){var interface=Interface.FromNode(interfaces.item(i));this.interfaces[interface.name]=interface;}this.loadState=DAGFilterApp.LOADED;}else{throw"Unable to load DAGFilterEditor.xml";}};
DAGFilterApp.prototype.createGraph=function(doc){var elements=doc.getElementsByTagNameNS(null,"element");var literals=doc.getElementsByTagNameNS(null,"literal");var edges=doc.getElementsByTagNameNS(null,"edge");var names={};this.clearDocument();this.clearScreen();for(var i=0;i<this.interfaces.length;i++)this.interfaces[i].resetCounter();this.literalId=1;for(var i=0;i<elements.length;i++){var element=elements.item(i);var DAGNode=this.createElement(element.getAttribute("type"));var id=element.getAttribute("id");DAGNode.setAttribute("x",+element.getAttribute("x"));DAGNode.setAttribute("y",+element.getAttribute("y"));DAGNode.setAttribute("id",id);names[id]=DAGNode;this.appendChild(DAGNode);var inputs=element.getElementsByTagNameNS(null,"input");for(var j=0;j<inputs.length;j++){DAGNode.addInput(inputs.item(j).getAttribute("name"));}var outputs=element.getElementsByTagNameNS(null,"output");if(outputs.length>0){var output=outputs.item(0);DAGNode.output.name=output.getAttribute("name");}}for(var i=0;i<literals.length;i++){var literal=literals.item(i);var DAGNode=this.createLiteral(literal.firstChild.data);var id=literal.getAttribute("id");DAGNode.setAttribute("x",+literal.getAttribute("x"));DAGNode.setAttribute("y",+literal.getAttribute("y"));DAGNode.setAttribute("id",id);names[id]=DAGNode;this.appendChild(DAGNode);}for(var i=0;i<edges.length;i++){var edge=edges.item(i);var inNode=names[edge.getAttribute("input")];var inPortName=edge.getAttribute("name");var inPort=inNode.inputs.getNamedItem(inPortName);this.connectToInput(names[edge.getAttribute("output")].output,inPort);}};
DAGFilterApp.prototype.clearDocument=function(){this.selectAll();this.deleteSelection("nodes");};
DAGFilterApp.prototype.clearScreen=function(){var filters=svgDocument.getElementsByTagNameNS(svgNS,"filter");while(filters.length>0){var node=filters.item(0);node.parentNode.removeChild(node);}var samples=this.svgNodes.samples;while(samples.firstChild)samples.removeChild(samples.firstChild);this.console.clear();};
DAGFilterApp.prototype.createXML=function(){var filterGraph=svgDocument.createElementNS(null,"filter-graph");var nodes=svgDocument.createElementNS(null,"nodes");var edges=svgDocument.createElementNS(null,"edges");filterGraph.appendChild(nodes);filterGraph.appendChild(edges);for(var i=0;i<this.nodes.length;i++){nodes.appendChild(this.nodes[i]._toXML(edges));}return formatTree(filterGraph);};
DAGFilterApp.prototype.graphToSVG=function(){this.clearScreen();var trees=this.toXML();this.xOffset=5;for(var i=0;i<trees.length;i++){var tree=formatTree(trees[i]);var xml=printNode(tree);var lines=xml.split(/\n/);for(var j=0;j<lines.length;j++){this.console.addLine(lines[j]);}this.showFilter(tree);}};
DAGFilterApp.prototype.showFilter=function(filter){var r=25;var pad=5;var id=filter.getAttributeNS(null,"id");var circle=createElement("circle",{cx:this.xOffset+r,cy:innerHeight-r-2*pad-25,r:r,fill:"red",filter:"url(#"+id+")"});var defss=svgDocument.getElementsByTagNameNS(svgNS,"defs");var defs;if(defss.length>0){defs=defss.item(0);}else{var svgRoot=svgDocument.rootElement;defs=createElement("defs");if(svgRoot.hasChildNodes()){svgRoot.insertBefore(defs,svgRoot.firstChild);}else{svgRoot.appendChild(defs);}}defs.appendChild(filter);this.svgNodes.samples.appendChild(circle);this.xOffset+=2*r+pad;};
DAGFilterApp.prototype.createElement=function(name){var interface=this.interfaces[name];if(interface==null)throw"Unrecognized filter name: "+name;return new Element(interface,this);};
DAGFilterApp.prototype.createElementWithDefaults=function(name){var elem=this.createElement(name);var inputs=elem.interface.getInputsByGroupName("default");var id=elem.interface.getNextId();while(this.id[id]!=null){id=elem.interface.getNextId();}elem.setAttribute("id",id);for(var i=0;i<inputs.length;i++){elem.addInput(inputs[i]);}return elem;};
DAGFilterApp.prototype.createLiteral=function(text){var interface=new Interface("string",text);return new Literal(interface,this);};
DAGFilterApp.prototype.createLiteralWithDefaults=function(text){var literal=this.createLiteral(text);var id="literal"+this.literalId++;while(this.id[id]!=null){id="literal"+this.literalId++;}literal.setAttribute("id",id);return literal;};
DAGFilterApp.prototype.appendChild=function(elem){elem.realize(this.svgNodes.nodes);this.nodes.push(elem);this.id[elem.getAttribute("id")]=elem;};
DAGFilterApp.prototype.removeChild=function(elem){for(var i=0;i<this.nodes.length;i++){if(this.nodes[i]===elem){delete this.id[elem.getAttribute("id")];this.nodes.splice(i,1);break;}}};
DAGFilterApp.prototype.selectChild=function(name,widget){var selection=this.selections[name];if(selection==null)throw"Selection name does not exist: "+name;selection.selectChild(widget);};
DAGFilterApp.prototype.deselectChild=function(name,widget){var selection=this.selections[name];if(selection==null)throw"Selection name does not exist: "+name;selection.deselectChild(widget);};
DAGFilterApp.prototype.selectAll=function(){for(var i=0;i<this.nodes.length;i++){var node=this.nodes[i];if(!node.selected){this.selections.nodes.selectChild(node);}}};
DAGFilterApp.prototype.deselectAll=function(name){if(name!=null){var selection=this.selections[name];if(selection==null)throw"Selection name does not exist: "+name;selection.deselectAll();}else{for(var key in this.selections){this.selections[key].deselectAll();}}};
DAGFilterApp.prototype.dragSelection=function(e){this.dragMode="nodes";this.foreground.addEventListener("drag",this,false);this.foreground.addEventListener("dragend",this,false);this.foreground.beginDrag(e);};
DAGFilterApp.prototype.duplicateSelection=function(){};
DAGFilterApp.prototype.deleteSelection=function(name){var selection=this.selections[name];if(selection==null)throw"Selection name does not exist: "+name;selection.foreachChild(function(node){node.owner.removeChild(node);node.dispose();});selection.clearSelection();};
DAGFilterApp.prototype.dragMarquee=function(e){this.dragMode="marquee";this.foreground.addEventListener("dragbegin",this,false);this.foreground.addEventListener("drag",this,false);this.foreground.addEventListener("dragend",this,false);this.foreground.beginDrag(e);};
DAGFilterApp.prototype.connectToInput=function(outPort,inPort){var edge=new Edge(outPort,inPort,this);edge.realize(this.svgNodes.edges);};
DAGFilterApp.prototype.toXML=function(){var trees=[];for(var i=0;i<this.nodes.length;i++){var node=this.nodes[i];if(node.constructor===Element){if(node.name=="FILTER"){this.genId++;trees.push(node.toXML());}}}return trees;};
DAGFilterApp.prototype.handleEvent=function(e){if(this[e.type]==null)throw"Unsuppoted event: "+e.type;this[e.type](e);};
DAGFilterApp.prototype.keydown=function(e){if(this.textbox==null){switch(e.keyCode){case 127:var cmd=new DeleteCommand(this);break;case 32:if(this.port!=null&&this.port.hasEdges()){if(e.shiftKey&&this.port.inOrOut==Port.INPUT){var edge=this.port.getFirstEdge();var other=edge.inPort;var parent=other.parent;var p1=this.port.getUserCoordinate();var p2=edge.inPort.getUserCoordinate();var diffX=p1.x-p2.x;parent.rmoveto(diffX,0);this.selections.nodes.foreachChild(function(node){if(node!==parent)node.rmoveto(diffX,0);});}else{var p1=this.port.getUserCoordinate();var count=this.port.edges.length;var parent=this.port.parent;var sumX=0;var diffX;for(var i=0;i<count;i++){var edge=this.port.edges[i];if(this.port.inOrOut==Port.INPUT){sumX+=edge.inPort.getUserCoordinate().x;}else{sumX+=edge.outPort.getUserCoordinate().x;}}diffX=(sumX/count)-p1.x;parent.rmoveto(diffX,0);this.selections.nodes.foreachChild(function(node){if(node!==parent)node.rmoveto(diffX,0);});}this.port.select(false);this.port=null;}break;case 37:case 100:var cmd=new MoveSelectionCommand(this,"nodes",-1,0);break;case 37:case 104:var cmd=new MoveSelectionCommand(this,"nodes",0,-1);break;case 39:case 102:var cmd=new MoveSelectionCommand(this,"nodes",1,0);break;case 40:case 98:var cmd=new MoveSelectionCommand(this,"nodes",0,1);break;case 49:if(e.ctrlKey){var cmd=new ViewSVGCommand(this);}break;case 65:if(e.ctrlKey){var cmd=new SelectAllCommand(this);}break;case 68:break;case 78:if(e.ctrlKey){var cmd=new NewCommand(this);}break;case 79:if(e.ctrlKey){var cmd=new OpenCommand(this);}break;case 83:if(e.ctrlKey){var cmd;if(e.shiftKey||currentFile==""){cmd=new SaveAsCommand(this);}else{cmd=new SaveCommand(this);}}break;}}};
DAGFilterApp.prototype.keypress=function(e){if(this.textbox!=null)this.textbox.keypress(e);};
DAGFilterApp.prototype.dragbegin=function(e){if(this.dragMode=="marquee"){var node=this.svgNodes.nodes;var curr=getUserCoordinate(node,e.clientX,e.clientY);this.marquee.setAttributeNS(null,"x",curr.x);this.marquee.setAttributeNS(null,"y",curr.y);this.marquee.setAttributeNS(null,"width","0");this.marquee.setAttributeNS(null,"height","0");this.marquee.setAttributeNS(null,"display","inline");}};
DAGFilterApp.prototype.drag=function(e){if(this.dragMode=="nodes"){var node=this.svgNodes.nodes;var curr=getUserCoordinate(node,e.clientX,e.clientY);var last=getUserCoordinate(node,e.lastX,e.lastY);var diffX=curr.x-last.x;var diffY=curr.y-last.y;if(diffX!=0||diffY!=0)this.rmovetoSelection("nodes",diffX,diffY);}else{var node=this.svgNodes.nodes;var first=getUserCoordinate(node,e.startX,e.startY);var curr=getUserCoordinate(node,e.clientX,e.clientY);var x=Math.min(first.x,curr.x);var y=Math.min(first.y,curr.y);var width=Math.abs(first.x-curr.x);var height=Math.abs(first.y-curr.y);this.marquee.setAttributeNS(null,"x",x);this.marquee.setAttributeNS(null,"y",y);this.marquee.setAttributeNS(null,"width",width);this.marquee.setAttributeNS(null,"height",height);var rect={x:x,y:y,width:width,height:height};for(var i=0;i<this.nodes.length;i++){var node=this.nodes[i];var select=node.inRect(rect);if(node.selected!=select){if(select){this.selections.nodes.selectChild(node);}else{this.selections.nodes.deselectChild(node);}}}}};
DAGFilterApp.prototype.rmovetoSelection=function(name,dx,dy){this.selections[name].foreachChild(function(node){node.rmoveto(dx,dy)});};
DAGFilterApp.prototype.dragend=function(e){if(this.dragMode=="marquee"){this.marquee.setAttributeNS(null,"display","none");this.foreground.removeEventListener("dragbegin",this,false);}this.foreground.removeEventListener("drag",this,false);this.foreground.removeEventListener("dragend",this,false);this.dragMode="";};
DAGFilterApp.prototype.menuselect=function(e){switch(e.target.name){case"Clear":var cmd=new ClearCommand(this);break;case"Delete":var cmd=new DeleteCommand(this);break;case"Dump All":var cmd=new DumpAllCommand(this);break;case"Export Filters":var cmd=new ExportFiltersCommand(this);break;case"New":var cmd=new NewCommand(this);break;case"Open":var cmd=new OpenCommand(this);break;case"Save":var cmd;if(currentFile!=null&&currentFile!=""){cmd=new SaveCommand(this);}else{cmd=new SaveAsCommand(this);}break;case"Save As...":var cmd=new SaveAsCommand(this);break;case"Select All":var cmd=new SelectAllCommand(this);break;case"SVG":var cmd=new ViewSVGCommand(this);break;default:alert(e.target.name);}};