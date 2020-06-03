var allMap; //全局map变量
var layerswitchertoolbar;
var baselayer; //地图底图
var infoTemplate;
// 临时图层
var graphicsLayer;
var picGraphic;
var picSymbol;
dojo.addOnLoad(function () {
  //初始化地图加载部分
  load2DMap();
  // 查询对应的煤矿位置
  showCoalLocation();
});
(function () {
  dojo.require("esri.geometry.Extent");
  dojo.require("esri.symbols.PictureMarkerSymbol");
  dojo.require("esri.graphic");
  dojo.require("esri.map");
  dojo.require("esri.geojsonlayer");
  dojo.require("esri.geometry.Point");
  dojo.require("esri.InfoTemplate");
  dojo.require("esri.symbols.TextSymbol");
})();
/**
 * 初始化地图加载
 */
function load2DMap() {
  /**  加载底图切换工具
   *  //创建一个map对象，然后地图填充在div容器，通过div的ID（map）来关联;
   *  {}里面是构造地图的可选参数设置，logo设置图标是否显示，
   * lods是设置瓦片地图的显示级别level有哪些，从配置文件config获取
   **/
  var map = new esri.Map("map", { logo: false, slider: false });
  allMap = map;
  //infoTemplate = new esri.infoTemplate("${name}", "${url}");
  //type为地图类型，0为wmts，1为mapserver切片,2为高德地图矢量，3为高德卫星,4为天地图矢量,5为天地图卫星
  var mapLabelArray = [
    {
      label: MapConfig.arcvecMap.labelUrl,
      type: MapConfig.arcvecMap.type,
      url: { map: MapConfig.arcvecMap.Url, anno: "" },
      className: "vecType",
    },
  ];
  //默认加载第一个图层,参数说明:map为地图对象;mapLabelArray图层数组配置;false或者true,说明是否重新创建map对象,假如map的瓦片级别以及分辨率和坐标系不一致的话,设置true,反之设置false
  layerswitchertoolbar = new LayerSwitcherToolbar(map, mapLabelArray, false);
  //设置地图初始范围
  var initExtent = new esri.geometry.Extent({
    xmin: MapConfig.mapInitParams.extent.xmin,
    ymin: MapConfig.mapInitParams.extent.ymin,
    xmax: MapConfig.mapInitParams.extent.xmax,
    ymax: MapConfig.mapInitParams.extent.ymax,
    spatialReference: MapConfig.mapInitParams.spatialReference,
  });
  map.setExtent(initExtent);
  // showCoalLocation("http://localhost:8080/BaseMap/js/data/point.json")
  showCoalLocation(MapConfig.frontbasePath + "/BaseMap/js/data/point.json");
}
/**
 * 地图加载之后显示对应的煤矿位置
 */
function showCoalLocation(url) {
  var geoJsonLayer = new esri.geojsonlayer({
    baseMap: allMap,
    url: url,
    onLayerLoaded: function (layer) {
      //showAllPopup(layer);
      if (layer.graphics[0].geometry.type == "point") {
        layer.graphics.forEach(function (item) {
          var loc = allMap.toScreen(item.geometry);
          allMap.infoWindow.setFeatures([item]);
          allMap.infoWindow.show(loc);
        });
      }
    },
  });
  // Add to map
  geoJsonLayer.dataType = "geojson";
  allMap.addLayer(geoJsonLayer);
}
