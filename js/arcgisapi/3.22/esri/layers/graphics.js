// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/graphic", "dojo/_base/declare dojo/_base/lang dojo/has ./kernel ./domUtils ./lang ./InfoTemplate ./geometry/jsonUtils ./symbols/jsonUtils".split(" "), function(f, h, r, t, l, q, u, v, w) {
    f = f(null, {
        declaredClass: "esri.Graphic",
        constructor: function(a, b, c, d) {
            a && !a.declaredClass ? (this.geometry = a.geometry ? v.fromJson(a.geometry) : null, this.symbol = a.symbol ? w.fromJson(a.symbol) : null, this.attributes = a.attributes || null, this.infoTemplate = a.infoTemplate ? new u(a.infoTemplate) : null) : (this.geometry = a, this.symbol =
                b, this.attributes = c, this.infoTemplate = d)
        },
        _shape: null,
        _graphicsLayer: null,
        _suspended: !1,
        size: null,
        _visible: !0,
        visible: !0,
        _aggregationSourceLayer: null,
        _aggregationInfo: null,
        setSize: function(a) { this.size = a },
        getAggregationSourceLayer: function() { return this._aggregationSourceLayer },
        setAggregationSourceLayer: function(a) { this._aggregationSourceLayer = a },
        isAggregate: function() { return !!this._aggregationInfo },
        getAggregationInfo: function() { return this._aggregationInfo },
        setAggregationInfo: function(a) {
            this._aggregationInfo =
                a
        },
        getChildGraphics: function() { var a = this.getAggregationSourceLayer(); return a ? a.getChildGraphics(this) : [] },
        getDojoShape: function() { return this._shape },
        getShapes: function() {
            var a = [];
            this._shape && a.push(this._shape);
            this._bgShape && a.push(this._bgShape);
            return a
        },
        getNode: function() { var a = this._shape && this._shape.getNode(); return a && a.nodeType ? a : null },
        getNodes: function() {
            var a = this.getShapes(),
                b, c, d = a.length,
                g = [];
            for (c = 0; c < d; c++)(b = a[c] && a[c].getNode()) && b.nodeType && g.push(b);
            return g
        },
        getLayer: function() { return this._layer },
        getSourceLayer: function() { return this._sourceLayer || this._layer },
        clone: function() {
            var a = new this.constructor(this.toJson());
            a.visible = this.visible;
            a._visible = this._visible;
            a._layer = this._layer;
            a._sourceLayer = this._sourceLayer;
            a._aggregationSourceLayer = this._aggregationSourceLayer;
            a._aggregationInfo = this._aggregationInfo;
            return a
        },
        draw: function() {
            var a = this._graphicsLayer;
            a && a._draw(this, !0);
            return this
        },
        setGeometry: function(a) {
            this.geometry = a;
            var b = this._graphicsLayer;
            b && (b._updateExtent(this), b._draw(this, !0), a && "polyline" === a.type && b._updateSVGMarkers());
            return this
        },
        setSymbol: function(a, b) {
            var c = this._graphicsLayer,
                d = this._shape;
            this.symbol = a;
            c && (b && d && c._removeShape(this), c._draw(this, !0));
            return this
        },
        setAttributes: function(a) {
            this.attributes = a;
            this._clearCache();
            return this
        },
        setInfoTemplate: function(a) { this.infoTemplate = a; return this },
        getInfoTemplate: function() { return this._getEffInfoTemplate() },
        _getEffInfoTemplate: function() { var a = this.getLayer(); return this.infoTemplate || a && a.infoTemplate },
        getTitle: function() {
            var a = this.getInfoTemplate(),
                b = a && a.title;
            if (h.isFunction(b)) b = b.call(a, this);
            else if (h.isString(b)) var c = (a = this.getLayer()) && a._getDateOpts,
                b = q.substitute(this.attributes, b, { first: !0, dateFormat: c && c.call(a) });
            return b
        },
        getContent: function() {
            var a = this.getInfoTemplate(),
                b = a && a.content;
            if (h.isFunction(b)) b = b.call(a, this);
            else if (h.isString(b)) var c = (a = this.getLayer()) && a._getDateOpts,
                b = q.substitute(this.attributes, b, { dateFormat: c && c.call(a) });
            return b
        },
        attr: function(a, b) {
            var c =
                this.getNodes(),
                d, g = c.length;
            for (d = 0; d < g; d++) null == b ? c[d].removeAttribute(a) : c[d].setAttribute(a, b);
            return this
        },
        show: function() {
            this.visible = this._visible = !0;
            var a, b, c;
            if (this.getShapes().length)
                for (a = this.getNodes(), c = a.length, this.attr("data-hidden"), b = 0; b < c; b++) l.show(a[b]);
            else this._graphicsLayer && this._graphicsLayer._draw(this, !0);
            return this
        },
        hide: function() {
            this.visible = this._visible = !1;
            var a = this._graphicsLayer,
                b, c;
            if (a)
                if ("canvas-2d" === a.surfaceType) a._removeShape(this);
                else if (a = this.getNodes(),
                c = a.length)
                for (this.attr("data-hidden", ""), b = 0; b < c; b++) l.hide(a[b]);
            return this
        },
        toJson: function() {
            var a = {};
            this.geometry && (a.geometry = this.geometry.toJson());
            this.attributes && (a.attributes = h.mixin({}, this.attributes));
            this.symbol && (a.symbol = this.symbol.toJson());
            this.infoTemplate && (a.infoTemplate = this.infoTemplate.toJson());
            return a
        },
        _getViewInfo: function(a) { return (a = (a = a || this.getLayer()) && a.getMap()) && a._getViewInfo() },
        _getDataValue: function(a, b, c, d) {
            var g = b.id,
                f = this.attributes,
                k = a.field,
                h = b.isNumeric,
                e = null;
            if (g) {
                var m = this._computedAttributes,
                    n = this._computedVersion;
                d = this._getViewInfo(d);
                var p = b.dependsOnView || b.isJSFunc;
                m || (m = this._computedAttributes = {}, p && (n = this._computedVersion = {}));
                var l = p && n[g] !== d._version,
                    e = m[g];
                if (void 0 === e || l) e = null, b.hasExpr ? e = c.executeFunction(b.compiledFunc, c.createExecContext(this, d)) : b.isJSFunc ? e = k(this, a) : f && (e = f[k], h && this._isValidNumber(e) && (b = a.normalizationType || "field", c = e, e = null, k = a.normalizationTotal, a = f[a.normalizationField], "log" === b && 0 !== c ? e = Math.log(c) *
                    Math.LOG10E : "percent-of-total" === b && this._isValidNumber(k) && 0 !== k ? e = c / k * 100 : "field" === b && this._isValidNumber(a) && 0 !== a && (e = c / a))), e = m[g] = this._sanitizeValue(e, h), p && (n[g] = d._version)
            } else f && (e = this._sanitizeValue(f[k], h));
            return e
        },
        _sanitizeValue: function(a, b) { b && !this._isValidNumber(a) && (a = null); return a },
        _isValidNumber: function(a) { return "number" === typeof a && !isNaN(a) && Infinity !== a && -Infinity !== a },
        _clearCache: function() { this._computedAttributes = this._computedVersion = null }
    });
    f.prototype.getShape =
        f.prototype.getDojoShape;
    r("extend-esri") && (t.Graphic = f);
    return f
});