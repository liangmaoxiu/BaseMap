// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.22/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/dataProviders/commands/supportClasses/HeaderFooterRenderer",["dojo/_base/lang","dojo/dom-class","dojo/dom-construct","dojo/dom-style","esri/dijit/geoenrichment/utils/ColorUtil"],function(l,r,d,e,f){var m={fixStyles:function(a,b){function c(a){return"string"!==typeof a||f.isTransparent(a)||"#ffffff"===a.toLowerCase()}if(!b)return a;a=l.mixin({},a);var d=b.backgroundColor?f.toCSSColor(b.backgroundColor):null,h=a.backgroundColor?f.toCSSColor(a.backgroundColor):
null,e=a.color?f.toCSSColor(a.color):null;c(d)&&c(h)&&c(e)&&(a.color="#000000");return a}},k={applyStyleToNode:function(a,b,c){b&&(b=m.fixStyles(b,c),b.backgroundColor&&e.set(a,"backgroundColor",b.backgroundColor),b.color&&e.set(a,"color",b.color),b.fontSize&&e.set(a,"fontSize",b.fontSize+"px"),b.fontFamily&&e.set(a,"fontFamily",b.fontFamily))}},n={buildHeader:function(a){var b=a.headerFooterParams.header,c=a.documentOptions,g=a.headerFooterParams.documentStyle;if(b&&b.show){var h=b.style;a=d.create("div",
{"class":"printNode_reportHeader"},a.pageNode,"first");k.applyStyleToNode(a,h.headerStyle,g);e.set(a,{paddingLeft:c.left+"px",paddingRight:c.right+"px"});c=d.create("div",{"class":""},a);c=d.create("div",{"class":"printNode_titleLabel",innerHTML:b.title},c);k.applyStyleToNode(c,h.titleStyle,g);c=d.create("div",{"class":"printNode_reportHeaderRow"},a);d.create("div",{"class":"printNode_subtitleLabel",innerHTML:b.subtitle},c);d.create("div",{"class":"printNode_siteNameLabel",innerHTML:b.siteName},c);
c=b.siteAddr||b.siteDesc;if(b.latitude||c){var f=d.create("div",{"class":"printNode_reportHeaderRow"},a);b.latitude&&k.applyStyleToNode(d.create("div",{"class":"printNode_siteLatLabel",innerHTML:"Latitude: "+b.latitude},f),h.latLongStyle,g);c&&d.create("div",{"class":"printNode_siteAddrLabel",innerHTML:c},f)}c=c&&c!=b.siteDesc&&b.siteDesc;if(b.longitude||c)a=d.create("div",{"class":"printNode_reportHeaderRow"},a),b.longitude&&k.applyStyleToNode(d.create("div",{"class":"printNode_siteLongLabel",innerHTML:"Longitude: "+
b.longitude},a),h.latLongStyle,g),c&&d.create("div",{"class":"printNode_siteDescLabel",innerHTML:c},a)}}},p={buildDataSource:function(a){var b=a.headerFooterParams.dataSource,c=a.documentOptions,g=a.headerFooterParams.documentStyle;b&&b.show&&(a=d.create("div",{"class":"printNode_reportDataSource"},a.pageNode),k.applyStyleToNode(a,b.style.dataSourceStyle,g),e.set(a,{paddingLeft:c.left+"px",paddingRight:c.right+"px"}),c=d.create("div",{"class":"printNode_reportDataSourceRow"},a),d.create("div",{"class":"printNode_dataSourceLabel",
innerHTML:b.sourceText},c))}},q={buildFooter:function(a){var b=a.headerFooterParams.footer,c=a.documentOptions,g=a.headerFooterParams.documentStyle,h=a.pageIndex,f=a.numPages;if(b&&b.show){var l=b.style;a=d.create("div",{"class":"printNode_reportFooter"},a.pageNode);k.applyStyleToNode(a,l.footerStyle,g);e.set(a,{paddingLeft:c.left+"px",paddingRight:c.right+"px"});c=d.create("div",{"class":"printNode_reportFooterRow"},a);d.create("div",{"class":"printNode_dateLabel",innerHTML:b.formattedDate},c);d.create("div",
{"class":"printNode_copyrightLabel",innerHTML:b.copyrightText},c);d.create("div",{"class":"printNode_pageLabel",innerHTML:"Page "+(h+1)+" of "+f},c)}}};return{addHeaderAndFooterToPage:function(a){a.headerFooterParams&&(a.headerFooterParams.documentStyle&&k.applyStyleToNode(a.pageNode,a.headerFooterParams.documentStyle,a.headerFooterParams.documentStyle),n.buildHeader(a),p.buildDataSource(a),q.buildFooter(a))}}});