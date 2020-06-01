// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/editor/util/templates/SaveDocumentPane.html":'\x3cdiv class\x3d"gxePrimaryPane gxeSaveDocumentPane"\x3e\r\n\r\n  \x3cdiv class\x3d"gxeDialogActionBar" data-dojo-attach-point\x3d"bottomNode"\x3e\r\n    \x3cdiv class\x3d"gxeRight gxeFloatRight gxeButtons"\x3e\r\n      \x3cbutton class\x3d"gxeButton prominent" data-dojo-attach-point\x3d"saveButton"\r\n        data-dojo-attach-event\x3d"onclick: _onSaveClick"\x3e${i18nBase.editor.save.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton" data-dojo-attach-point\x3d"saveAndCloseButton"\r\n        data-dojo-attach-event\x3d"onclick: _onSaveAndCloseClick"\x3e${i18nBase.editor.saveAndClose.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton" data-dojo-attach-point\x3d"cancelButton"\r\n        data-dojo-attach-event\x3d"onclick: _onCancelClick"\x3e${i18nBase.general.cancel}\x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"gxeClear"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/editor/util/SaveDocumentPane","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class dojo/dom-style dojo/has ../../base/Templated dojo/text!./templates/SaveDocumentPane.html dojo/i18n!../../nls/i18nBase ../../../../kernel".split(" "),function(a,b,h,k,c,d,e,f,l,g){a=a([e],{_disabled:!1,dialogBroker:null,editor:null,gxeDocument:null,templateString:f,postCreate:function(){this.inherited(arguments);this._initialize()},_getPushToItem:function(){return!0},_initialize:function(){this.editor&&
this.editor.dialogBroker||c.set(this.saveAndCloseButton,"display","none")},onCancel:function(){},onSave:function(a,b){},_onCancelClick:function(){if(!this._disabled)this.onCancel()},_onSaveClick:function(){if(!this._disabled)this.onSave(!1,this._getPushToItem())},_onSaveAndCloseClick:function(){if(!this._disabled)this.onSave(!0,this._getPushToItem())}});d("extend-esri")&&b.setObject("dijit.metadata.editor.util.SaveDocumentPane",a,g);return a});