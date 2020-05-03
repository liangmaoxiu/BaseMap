// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/tasks/FindTask","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/has ../kernel ../request ../deferredUtils ./Task ./FindResult".split(" "),function(b,c,h,k,l,m,n,p,q,r){b=b(q,{declaredClass:"esri.tasks.FindTask",constructor:function(a,e){this._url.path+="/find";this._handler=c.hitch(this,this._handler);this.gdbVersion=e&&e.gdbVersion},_handler:function(a,e,b,c,f){try{var d=[];h.forEach(a.results,function(a,b){d[b]=new r(a)});this._successHandler([d],"onComplete",
b,f)}catch(t){this._errorHandler(t,c,f)}},execute:function(a,b,g){a=this._encode(c.mixin({},this._url.query,{f:"json"},a.toJson()));var e=this._handler,f=this._errorHandler;this.gdbVersion&&(a.gdbVersion=this.gdbVersion);var d=new k(p._dfdCanceller);d._pendingDfd=n({url:this._url.path,content:a,callbackParamName:"callback",load:function(a,c){e(a,c,b,g,d)},error:function(a){f(a,g,d)}});return d},onComplete:function(){}});l("extend-esri")&&c.setObject("tasks.FindTask",b,m);return b});