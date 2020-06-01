// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/geoenrichment/ReportPlayer/core/templates/InfographicContainer.html":'\x3cdiv class\x3d"esriGEReportPlayer_infographicContainer esriGEAbsoluteStretched"\x3e\r\n    \x3cdiv class\x3d"infographicContainer_viewDiv" data-dojo-attach-point\x3d"viewDiv"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"infographicContainer_previewOverlay esriGEAbsoluteStretched" data-dojo-attach-point\x3d"previewOverlay"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/geoenrichment/ReportPlayer/core/infographics/InfographicContainer","dojo/_base/declare dojo/_base/lang dijit/_WidgetBase dijit/_TemplatedMixin ./SimpleInfographic ./DynamicInfographic ./AttachmentsInfographic ./AreaDetailsInfographic ./InterestingFactsInfographic esri/dijit/geoenrichment/ReportPlayer/core/infographics/InfographicTypes dojo/text!../templates/InfographicContainer.html".split(" "),function(e,f,g,h,k,l,m,n,p,d,q){return e([g,h],{templateString:q,viewModel:null,themeContext:null,
theme:null,_currentInfographic:null,_prepareCreationParameters:function(a){return null},_getSimpleInfographicClass:function(){return k},_getDynamicInfographicClass:function(){return l},_getAttachmentsInfographicClass:function(){return m},_getAreaDetailsInfographicClass:function(){return n},_getInterestingFactsInfographicClass:function(){return p},updateInfographic:function(a){function b(b){return f.mixin({viewModel:c.viewModel,themeContext:c.themeContext,theme:c.theme,width:c.width,height:c.height},
c._prepareCreationParameters(a),b)}if(this.viewDiv&&(this._currentInfographic&&this._currentInfographic.destroy(),this._currentInfographic=null,a&&d.isSupported(a.type))){var c=this;a.type==d.STATIC?this._currentInfographic=(new this._getSimpleInfographicClass)(b()):a.type==d.ATTACHMENTS?this._currentInfographic=(new this._getAttachmentsInfographicClass)(b()):a.type==d.AREA_DETAILS?this._currentInfographic=(new this._getAreaDetailsInfographicClass)(b()):a.type==d.INTERESTING_FACTS?this._currentInfographic=
(new this._getInterestingFactsInfographicClass)(b()):d.isDynamic(a.type)&&(this._currentInfographic=(new this._getDynamicInfographicClass)(b({onContentLoadingStart:function(){c.onContentLoadingStart()},onContentLoadingEnd:function(){c.onContentLoadingEnd()}})));this._currentInfographic.placeAt(this.viewDiv);this._currentInfographic.updateInfographic(a)}},width:null,height:null,resize:function(a,b){this.width=a;this.height=b;this._currentInfographic&&this._currentInfographic.resize(a,b)},getPreferredHeight:function(){return this._currentInfographic.getPreferredHeight&&
this._currentInfographic.getPreferredHeight()},collapseContent:function(){this._currentInfographic.collapseContent&&this._currentInfographic.collapseContent()},toJson:function(){return this._currentInfographic&&this._currentInfographic.toJson()},getVisualState:function(){return this._currentInfographic&&this._currentInfographic.getVisualState&&this._currentInfographic.getVisualState()},setVisualState:function(a){return this._currentInfographic&&this._currentInfographic.setVisualState&&this._currentInfographic.setVisualState(a)},
notifyShown:function(){this._currentInfographic&&this._currentInfographic.notifyShown&&this._currentInfographic.notifyShown()},onContentLoadingStart:function(){},onContentLoadingEnd:function(){},destroy:function(){this._currentInfographic&&this._currentInfographic.destroy();this.inherited(arguments)}})});