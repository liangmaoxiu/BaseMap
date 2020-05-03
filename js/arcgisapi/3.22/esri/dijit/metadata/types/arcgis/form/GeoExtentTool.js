// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/form/GeoExtentTool","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/query dijit/registry dojo/dom-construct dojo/has ../../../../../kernel ../../../form/tools/ClickableTool ../../../form/tools/GeoExtentDialog ../../../form/tools/GeoExtentView ../../../form/tools/geoExtentUtil".split(" "),function(c,m,x,n,p,q,r,t,u,v,w,g){c=c([u],{postCreate:function(){this.inherited(arguments)},startup:function(){if(!this._started){var a=this.findInputWidget();a&&
a.parentXNode&&a.parentXNode.gxeDocument&&a.parentXNode.gxeDocument.isViewOnly&&setTimeout(m.hitch(this,function(){this._handleRequest(a,!1)}),2E3)}},whenToolClicked:function(a,e){this._handleRequest(e,!0)},_findInputWgt:function(a,e){var b;return(b=n("[data-gxe-path\x3d'"+a+"']",e))&&1===b.length&&(b=p.byNode(b[0]))?b.inputWidget:null},_findViewSection:function(a){return(a=n(".gxeGeoExtentSection .gxeGeoExtentViewSection",a))&&1===a.length?a[0]:null},_handleRequest:function(a,e){if(a&&a.parentXNode){var b=
a.parentXNode.getParentElement();if(b){var d=b.gxePath+"/",f=b.domNode,c=this._findInputWgt(d+"westBL",f),h=this._findInputWgt(d+"eastBL",f),k=this._findInputWgt(d+"northBL",f),l=this._findInputWgt(d+"southBL",f);c&&h&&k&&l&&(d=null,b.gxeDocument&&b.gxeDocument.isViewOnly?e||(d=this._findViewSection(f))&&new w({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue()},q.create("div",{},d)):e&&(b=new v({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),
ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue(),onChange:m.hitch(this,function(a){c.setInputValue(g.formatCoordinate(a.xmin));h.setInputValue(g.formatCoordinate(a.xmax));k.setInputValue(g.formatCoordinate(a.ymax));l.setInputValue(g.formatCoordinate(a.ymin))})}),b.show()))}}}});r("extend-esri")&&m.setObject("dijit.metadata.types.arcgis.form.GeoExtentTool",c,t);return c});