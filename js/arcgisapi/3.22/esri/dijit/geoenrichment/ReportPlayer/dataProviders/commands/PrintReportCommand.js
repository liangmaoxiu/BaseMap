// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/dataProviders/commands/PrintReportCommand","dojo/_base/declare dojo/Deferred dojo/when dojo/dom-construct ./CreateHTMLCommand esri/dijit/geoenrichment/utils/DomUtil esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/DocumentOptions ./supportClasses/PlayerCommands dojo/i18n!../../../../../nls/jsapi".split(" "),function(e,k,l,g,m,h,q,n,d){d=d.geoenrichment.dijit.ReportPlayer.ReportPlayer;var p=e(null,{_layoutNode:null,_originalChildren:null,_printNode:null,
_html:null,_propMemo:null,setUpDocument:function(b,d){var a=document.body,f=a.children,c;for(c in f)h.hide(f[c]);c=document.getElementsByTagName("html")[0];var e=[c.style.overflow,a.style.overflow,a.style.margin];c.style.overflow="visible";a.style.overflow="visible";a.style.margin="0px";this._propMemo=e;this._html=c;this._layoutNode=a;this._originalChildren=f;this._printNode=g.create("div",{style:"display: inline-block;",innerHTML:b},a);this._setUpPageSize(d)},_setUpPageSize:function(b){},unSetDocument:function(){g.destroy(this._printNode);
this._html.style.overflow=this._propMemo[0];this._layoutNode.style.overflow=this._propMemo[1];this._layoutNode.style.margin=this._propMemo[2];for(var b in this._originalChildren)h.show(this._originalChildren[b])}});return e(m,{id:n.PRINT,_saveFiles:!1,_mode:"svg",errorMessage:d.printError,execute:function(b,d){return l(this.inherited(arguments),function(a){if(a.svgStrings){var b=new p;b.setUpDocument(a.svgStrings.join(""),a.documentOptions);var c=new k;setTimeout(function(){window.print();b.unSetDocument();
c.resolve()});return c.promise}})},_handleError:function(b){console.log(b);alert("Can't print the report. Please try again later.")}})});