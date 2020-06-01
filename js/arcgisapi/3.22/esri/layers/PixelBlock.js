// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/layers/PixelBlock",["dojo/_base/declare","dojo/_base/lang","dojo/has","../kernel"],function(k,l,m,n){k=k([],{declaredClass:"esri.layers.PixelBlock",planes:null,width:null,height:null,pixelType:null,pixels:[],statistics:[],constructor:function(a){if(a){if(!a.width||Math.floor(a.width)!==a.width)throw"PixelBlock: incorrect width";if(!a.height||Math.floor(a.height)!==a.height)throw"PixelBlock: incorrect height";if(!a.pixels||!a.statistics)throw"PixelBlock: pixel data or statistics not present";
this.width=a.width;this.height=a.height;this.pixels=a.pixels;this.pixelType=a.pixelType||null;this.statistics=a.statistics;this.mask=a.mask||null}},getPlaneCount:function(){return this.pixels.length!==this.statistics.length?console.error("Inconsistent pixel data and statistics"):this.statistics.length},addData:function(a){if(!a.pixels||!a.statistics)throw"Pixel data or statistics are not present";if(a.pixels.length!==this.width*this.height)throw"Inconsistent pixel data size";this.statistics.push(a.statistics);
this.pixels.push(a.pixels)},getAsRGBA:function(){var a=new ArrayBuffer(this.width*this.height*4);switch(this.pixelType){case "S8":case "S16":case "U16":case "S32":case "U32":case "F32":case "F64":this._fillFromNon8Bit(a);break;default:this._fillFrom8Bit(a)}return new Uint8ClampedArray(a)},getAsRGBAFloat:function(){var a=new Float32Array(this.width*this.height*4);this._fillFrom32Bit(a);return a},clone:function(){var a=new this.constructor;a.width=this.width;a.height=this.height;a.pixelType=this.pixelType;
this.mask&&(a.mask=new Uint8Array(this.mask));var b,g;if(this.pixels)for(a.pixels=[],g=this.pixels.length,b=0;b<g;b++)a.pixels[b]=new Float32Array(this.pixels[b]);if(this.statistics)for(a.statistics=[],g=this.statistics.length,b=0;b<g;b++)a.statistics[b]=l.clone(this.statistics[b]);return a},_fillFrom8Bit:function(a){var b=this.pixels,g=this.mask;if(!a||!b||!b.length)return console.error("Unable to convert to RGBA. The input pixel block is empty.");var e,c,d;e=c=d=b[0];3<=b.length&&(c=b[1],d=b[2]);
var b=new Uint32Array(a),h=this.width*this.height;if(e.length!==h)return console.error("Unable to convert to RGBA. The pixelblock is invalid.");if(g&&g.length===h)for(a=0;a<h;a++)g[a]&&(b[a]=-16777216|d[a]<<16|c[a]<<8|e[a]);else for(a=0;a<h;a++)b[a]=-16777216|d[a]<<16|c[a]<<8|e[a]},_fillFromNon8Bit:function(a){var b=this.pixels,g=this.mask,e=this.statistics;if(!a||!b||!b.length)return console.error("Unable to convert to RGBA. The input pixel block is empty.");var c=1,d=0;e&&0<e.length?(d=e[0].minValue,
c=255/(e[0].maxValue-e[0].minValue)):(c=255,"S8"===this.pixelType?(d=-128,c=127):"U16"===this.pixelType?c=65535:"S16"===this.pixelType?(d=-32768,c=32767):"U32"===this.pixelType?c=4294967295:"S32"===this.pixelType?(d=-2147483648,c=2147483647):"F32"===this.pixelType?(d=-3.4*1E39,c=3.4*1E39):"F64"===this.pixelType&&(d=-Number.MAX_VALUE,c=Number.MAX_VALUE),c=255/(c-d));a=new Uint32Array(a);var e=this.width*this.height,h,f,k;h=b[0];if(h.length!==e)return console.error("Unable to convert to RGBA. The pixelblock is invalid.");
if(3<=b.length)if(f=b[1],k=b[2],g&&g.length===e)for(b=0;b<e;b++)g[b]&&(a[b]=-16777216|(k[b]-d)*c<<16|(f[b]-d)*c<<8|(h[b]-d)*c);else for(b=0;b<e;b++)a[b]=-16777216|(k[b]-d)*c<<16|(f[b]-d)*c<<8|(h[b]-d)*c;else if(g&&g.length===e)for(b=0;b<e;b++)f=(h[b]-d)*c,g[b]&&(a[b]=-16777216|f<<16|f<<8|f);else for(b=0;b<e;b++)f=(h[b]-d)*c,a[b]=-16777216|f<<16|f<<8|f},_fillFrom32Bit:function(a){var b=this.pixels,g=this.mask;if(!a||!b||!b.length)return console.error("Unable to convert to RGBA. The input pixel block is empty.");
var e,c,d;e=c=d=b[0];3<=b.length&&(c=b[1],d=b[2]);var h=this.width*this.height;if(e.length!==h)return console.error("Unable to convert to RGBA. The pixelblock is invalid.");var f=0;if(g&&g.length===h)for(b=0;b<h;b++)a[f++]=e[b],a[f++]=c[b],a[f++]=d[b],a[f++]=g[b];else for(b=0;b<h;b++)a[f++]=e[b],a[f++]=c[b],a[f++]=d[b],a[f++]=255}});m("extend-esri")&&l.setObject("layers.PixelBlock",k,n);return k});