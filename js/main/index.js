var allMap; //全局map变量
var layerswitchertoolbar;
var baselayer; //地图底图
var infoTemplate;
// 临时图层
var graphicsLayer;
var picGraphic;
var picSymbol;
dojo.addOnLoad(function() {
    //初始化地图加载部分
    load2DMap();
});
(function() {
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
        { label: MapConfig.arcvecMap.labelUrl, type: MapConfig.arcvecMap.type, url: { map: MapConfig.arcvecMap.Url, anno: "" }, className: "vecType" },
    ];
    //默认加载第一个图层,参数说明:map为地图对象;mapLabelArray图层数组配置;false或者true,说明是否重新创建map对象,假如map的瓦片级别以及分辨率和坐标系不一致的话,设置true,反之设置false
    layerswitchertoolbar = new LayerSwitcherToolbar(map, mapLabelArray, false);
    //设置地图初始范围
    var initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
    map.setExtent(initExtent);
    showCoalLocation("http://localhost:8080/BaseMap/js/data/point.json");
    // showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/point.json");
}
/**
 * 地图加载之后显示对应的煤矿位置
 */
function showCoalLocation(url) {
    var geoJsonLayer = new esri.geojsonlayer({
        baseMap: allMap,
        url: url,
        onLayerLoaded: function(layer) {
            if (layer.graphics[0].geometry.type == "point") {
                layer.graphics.forEach(function(item) {
                    var loc = allMap.toScreen(item.geometry);
                    allMap.infoWindow.setFeatures([item]);
                    allMap.infoWindow.show(loc);
                })
            }
        }
    });
    // Add to map
    geoJsonLayer.dataType = "geojson";
    allMap.addLayer(geoJsonLayer);
}

// 点击不同的图片显示详情信息
function showDetail(arg) {
    switch (arg) {
        // 风险分布
        case "A":
            {
                $("#risk").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/risk.json");
                break;
            }
            //隐患分布
        case "B":
            {
                $("#hide").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/hide.json");
                break;
            }
            // 领导带班
        case "C":
            {
                $("#leader").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/leader.json");
                break;
            }
            //工作面区域
        case "D":
            {
                $("#square").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/square.json");
                break;
            }
            // 职业危害分布
        case "E":
            {
                $("#danger").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/danger.json");
                break;
            }
            // 应急物资地点
        case "F":
            {
                $("#emergency").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/emergency.json");
                break;
            }
            //事故地点
        case "G":
            {
                $("#accident").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/accident.json");
                break;
            }
            // 安全培训
        case "H":
            {
                $("#safe").attr("src", "Content/images/map/index/on.png");
                showCoalLocation(MapConfig.frontbasePath + "BaseMap/js/data/safe.json");
                break;
            }

    }



}