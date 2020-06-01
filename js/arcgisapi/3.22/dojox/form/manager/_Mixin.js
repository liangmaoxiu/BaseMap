//>>built
define("dojox/form/manager/_Mixin","dojo/_base/window dojo/_base/lang dojo/_base/array dojo/on dojo/dom-attr dojo/dom-class dijit/_base/manager dijit/_Widget dijit/form/_FormWidget dijit/form/Button dijit/form/CheckBox dojo/_base/declare".split(" "),function(l,g,f,n,p,v,h,w,q,x,y,m){l=g.getObject("dojox.form.manager",!0);var z=l.actionAdapter=function(a){return function(b,d,c){g.isArray(d)?f.forEach(d,function(e){a.call(this,b,e,c)},this):a.apply(this,arguments)}};l.inspectorAdapter=function(a){return function(b,
d,c){return a.call(this,b,g.isArray(d)?d[0]:d,c)}};var A={domNode:1,containerNode:1,srcNodeRef:1,bgIframe:1},B=l._keys=function(a){var b=[],d;for(d in a)a.hasOwnProperty(d)&&b.push(d);return b},r=function(a){var b=a.get("name");if(b&&a.isInstanceOf(q))if(b in this.formWidgets){var d=this.formWidgets[b].widget;g.isArray(d)?d.push(a):this.formWidgets[b].widget=[d,a]}else this.formWidgets[b]={widget:a,connections:[]};else b=null;return b},t=function(a){var b={};z(function(a,c){var e=c.get("data-dojo-observer")||
c.get("observer");e&&"string"==typeof e&&f.forEach(e.split(","),function(a){(a=g.trim(a))&&g.isFunction(this[a])&&(b[a]=1)},this)}).call(this,null,this.formWidgets[a].widget);return B(b)},u=function(a,b){var d=this.formWidgets[a],c=d.widget,e=d.connections;e.length&&(f.forEach(e,function(a){a.remove()}),e=d.connections=[]);if(g.isArray(c))f.forEach(c,function(c){f.forEach(b,function(b){e.push(n(c,"change",g.hitch(this,function(e){if(this.watching&&p.get(c.focusNode,"checked"))this[b](c.get("value"),
a,c,e)})))},this)},this);else{var k=c.isInstanceOf(x)?"click":"change";f.forEach(b,function(b){e.push(n(c,k,g.hitch(this,function(e){if(this.watching)this[b](c.get("value"),a,c,e)})))},this)}};m=m("dojox.form.manager._Mixin",null,{watching:!0,startup:function(){this._started||(this.formWidgets={},this.formNodes={},this.registerWidgetDescendants(this),this.inherited(arguments))},destroy:function(){for(var a in this.formWidgets)f.forEach(this.formWidgets[a].connections,function(a){a.remove()});this.formWidgets=
{};this.inherited(arguments)},registerWidget:function(a){"string"==typeof a?a=h.byId(a):a.tagName&&a.cloneNode&&(a=h.byNode(a));(a=r.call(this,a))&&u.call(this,a,t.call(this,a));return this},unregisterWidget:function(a){a in this.formWidgets&&(f.forEach(this.formWidgets[a].connections,function(a){a.remove()}),delete this.formWidgets[a]);return this},registerWidgetDescendants:function(a){"string"==typeof a?a=h.byId(a):a.tagName&&a.cloneNode&&(a=h.byNode(a));var b=f.map(a.getDescendants(),r,this);f.forEach(b,
function(a){a&&u.call(this,a,t.call(this,a))},this);return this.registerNodeDescendants?this.registerNodeDescendants(a.domNode):this},unregisterWidgetDescendants:function(a){"string"==typeof a?a=h.byId(a):a.tagName&&a.cloneNode&&(a=h.byNode(a));f.forEach(f.map(a.getDescendants(),function(a){return a instanceof q&&a.get("name")||null}),function(a){a&&this.unregisterWidget(a)},this);return this.unregisterNodeDescendants?this.unregisterNodeDescendants(a.domNode):this},formWidgetValue:function(a,b){var d=
2==arguments.length&&void 0!==b,c;"string"==typeof a&&(a=this.formWidgets[a])&&(a=a.widget);if(!a)return null;if(g.isArray(a)){if(d)return f.forEach(a,function(a){a.set("checked",!1,!this.watching)},this),f.forEach(a,function(a){a.set("checked",a.value===b,!this.watching)},this),this;f.some(a,function(a){return p.get(a.focusNode,"checked")?(c=a,!0):!1});return c?c.get("value"):""}return a.isInstanceOf&&a.isInstanceOf(y)?d?(a.set("value",!!b,!this.watching),this):!!a.get("value"):d?(a.set("value",
b,!this.watching),this):a.get("value")},formPointValue:function(a,b){a&&"string"==typeof a&&(a=this[a]);return a&&a.tagName&&a.cloneNode&&v.contains(a,"dojoFormValue")?2==arguments.length&&void 0!==b?(a.innerHTML=b,this):a.innerHTML:null},inspectFormWidgets:function(a,b,d){var c,e={};if(b)if(g.isArray(b))f.forEach(b,function(b){b in this.formWidgets&&(e[b]=a.call(this,b,this.formWidgets[b].widget,d))},this);else for(c in b)c in this.formWidgets&&(e[c]=a.call(this,c,this.formWidgets[c].widget,b[c]));
else for(c in this.formWidgets)e[c]=a.call(this,c,this.formWidgets[c].widget,d);return e},inspectAttachedPoints:function(a,b,d){var c,e,k={};if(b)if(g.isArray(b))f.forEach(b,function(b){(e=this[b])&&e.tagName&&e.cloneNode&&(k[b]=a.call(this,b,e,d))},this);else for(c in b)(e=this[c])&&e.tagName&&e.cloneNode&&(k[c]=a.call(this,c,e,b[c]));else for(c in this)c in A||(e=this[c])&&e.tagName&&e.cloneNode&&(k[c]=a.call(this,c,e,d));return k},inspect:function(a,b,d){var c=this.inspectFormWidgets(function(b,
c,d){return g.isArray(c)?a.call(this,b,f.map(c,function(a){return a.domNode}),d):a.call(this,b,c.domNode,d)},b,d);this.inspectFormNodes&&g.mixin(c,this.inspectFormNodes(a,b,d));return g.mixin(c,this.inspectAttachedPoints(a,b,d))}});g.extend(w,{observer:""});return m});