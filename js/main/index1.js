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
    // 查询对应的煤矿位置
    showCoalLocation();
});
(function() {
    dojo.require("esri.geometry.Extent");
    dojo.require("esri.symbols.PictureMarkerSymbol");
    dojo.require("esri.graphic");
    dojo.require("esri.map");
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
}
/**
 * 地图加载之后显示对应的煤矿位置
 */
function showCoalLocation() {
    $.ajax({
        cache: false,
        type: "POST",
        url: backbasePath + '/apia/v1/arcgis/getCoalLocation',
        dataType: 'json',
        data: {},
        async: false,
        success: function(data) {
            // 将返回的responseText 解析出来
            if (data.code == "000000") {
                // 后台返回的结果
                var list = data.data;
                //创建临时图层
                graphicsLayer = new esri.layers.GraphicsLayer();
                // 遍历数据动态建行
                for (var key in list) {
                    // var imgpath = getRootPath() + "Content/images/poi/dw" + (parseInt(key) + 1) + ".png";   
                    // 根据坐标形成一个图形
                    var attr = { "title": list[key].name };  
                    infoTemplate = new esri.InfoTemplate("名称");  
                    //　循环遍历坐标信息，将信息在地图上显示
                    showRoute(list[key].id, attr, list[key].longitude, list[key].latitude, infoTemplate);
                }
                allMap.addLayer(graphicsLayer);
                var graphics = allMap._layers.graphicsLayer0.graphics;
                showTitle(graphics);
            }
        },
        error: function(data) {
            var result = "";
            if (data.msg == '' || data.msg == null) {
                result = "查询煤矿位置信息报错";
            } else {
                result = data.msg;
            }
            toastr.error(result);
        }
    });
    /**
     * 根据查出来的位置信息进行信息的展示
     */

    function showRoute(id, attr, longitude, latitude, infoTemplate) {

        // 根据坐标形成一个点
        var newPoint = new esri.geometry.Point({
            "x": longitude,
            "y": latitude,
            "spatialReference": map.spatialReference
        });      
        // 图形样式
        var imgpath = getRootPath() + "Content/images/poi/dw1.png";   
        picSymbol = new esri.symbols.PictureMarkerSymbol(imgpath, 20, 20); 
        //     
        picGraphic = new esri.graphic(newPoint, picSymbol, attr, infoTemplate);   
        graphicsLayer.add(picGraphic);
        // 将图层显示在地图上

        // graphicsLayer.add(new esri.graphic(picGraphic, new esri.symbols.TextSymbol(name).setOffset(0, 8)));
        // 显示冒泡信息
        // showTitle(picGraphic, name);
    }

    function showTitle(graphics) {
        var zoompoint = null;
        for (var i = 0; i < graphics.length; i++) {
            zoompoint = graphics[i].geometry;
            allMap.centerAt(zoompoint);
            allMap.infoWindow.setTitle(graphics[i].attributes.title);
            // allMap.infoWindow.show(zoompoint);
            //setTimeout(function() {
            //  allMap.infoWindow.show(zoompoint);
            // }, 500);
            if (zoompoint.type == "point") {

                //layer.graphics.forEach(function(item){		       				
                var loc = allMap.toScreen(zoompoint);
                // allMap.infoWindow.setFeatures([i]);
                allMap.infoWindow.show(loc);
                // })
            }



        }
    }
    // // 显示详情信息
    // function showTitle(evt, name) {
    //     var zoompoint = null;
    //     zoompoint = evt.geometry;
    //     allMap.centerAt(zoompoint);
    //     allMap.infoWindow.resize(200, 100);
    //     // 标题显示名称
    //     allMap.infoWindow.setTitle(name);
    //     setTimeout(function() {
    //         allMap.infoWindow.show(zoompoint);
    //     }, 500);
    // }
}