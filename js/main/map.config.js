﻿/* --------------------------------地图初始信息配置-------------------------------- */
function MapConfig() {}
MapConfig.mapInitParams = {
    // 初始化的位置就是发布成功之后服务上面的数值
    fullExtent: { //全图范围
        xmin: 123.27419620829298,
        ymin: 42.37369755341954,
        xmax: 123.66276219054507,
        ymax: 42.5340732252125
    },
    extent: { //初始化范围12491733.419,2579457.273,12724713.481,2700839.274
        xmin: 123.27419620829298,
        ymin: 42.37369755341954,
        xmax: 123.66276219054507,
        ymax: 42.5340732252125
    },
    spatialReference: {
        wkid: 4326
    },
    arcgis_lods: [ //ArcGIS的lods
        { "level": 0, "resolution": 132291.9312505292, "scale": 500000000 },
        { "level": 1, "resolution": 66145.9656252646, "scale": 250000000 },
        { "level": 2, "resolution": 33072.9828126323, "scale": 125000000 },
        { "level": 3, "resolution": 16933.367200067736, "scale": 64000000 },
        { "level": 4, "resolution": 8466.683600033868, "scale": 32000000 }
    ],

}
MapConfig.daLongInitParams = {
        // 初始化的位置就是发布成功之后服务上面的数值
        fullExtent: { //全图范围
            xmin: 3.761616822088623E7,
            ymin: 4170982.7700805664,
            xmax: 3.762342962689209E7,
            ymax: 4178474.875305176
        },
        extent: { //初始化范围12491733.419,2579457.273,12724713.481,2700839.274
            xmin: 3.761090575265927E7,
            ymin: 4175326.3568854555,
            xmax: 3.762869209511905E7,
            ymax: 4178849.4805664057
        },
        spatialReference: {
            wkid: 4548
        },
        arcgis_lods: [ //ArcGIS的lods
            { "level": 0, "resolution": 132291.9312505292, "scale": 500000000 },
            { "level": 1, "resolution": 66145.9656252646, "scale": 250000000 },
            { "level": 2, "resolution": 33072.9828126323, "scale": 125000000 },
            { "level": 3, "resolution": 16933.367200067736, "scale": 64000000 },
            { "level": 4, "resolution": 8466.683600033868, "scale": 32000000 }
        ],

    }
    /*导航条配置参数*/
MapConfig.sliderConfig = {
    targetId: "mapDiv",
    minValue: 0,
    maxValue: 9,
    startValue: 2,
    toolbarCss: ["toolBar", "toolBar_button", "toolBar_slider", "toolBar_mark"],
    marksShow: {
        countryLevel: null,
        provinceLevel: null,
        cityLevel: null,
        streetLevel: null
    }
};
/*地图调用*/

MapConfig.searchMapUrl = "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer"; //搜索查询地图服务
MapConfig.locatorUrl = "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer"; //地理编码服务
MapConfig.routetaskUrl = "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer"; //路网服务
MapConfig.routeUrl = "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer"; //Closest Facility服务
/*地图配置服务信息说明
 *type为地图类型，0为wmts，1为mapserver切片,2为高德地图矢量，3为高德卫星,4为天地图矢量,5为天地图卫星,6为百度地图矢量,7为百度卫星,8动态服务
 */
MapConfig.arcvecMap = { Url: "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer", labelUrl: "矢量", type: 8 }; //大连矢量底图服务-ArcGIS切片格式
MapConfig.arcimgMap = { Url: "http://192.168.31.41:6080/arcgis/rest/services/tfmine/tfmine14dy/MapServer", labelUrl: "影像", type: 1 }; //大连影像底图服务-ArcGIS切片格式
MapConfig.leaderMap = { Url: "http://192.168.31.41:6080/arcgis/rest/services/XHG/813Dy/MapServer", labelUrl: "矢量", type: 8 }; //大连数据服务
WEBPATH = "http://localhost:8080/BaseMap/";
backbasePath = "http://192.168.31.18:9010/";
MapConfig.frontbasePath = "http://127.0.0.1:8080/";
/*图层目录构造*/
MapConfig.zNodes = [
    { id: 1, pId: 0, name: "图层目录", checked: false, iconOpen: "" + WEBPATH + "Content/images/legend/1_open.png", iconClose: "" + WEBPATH + "Content/images/legend/1_close.png" },
    { id: 2, pId: 1, name: "监控分站", layerurl: MapConfig.searchMapUrl, layerid: "layer0", checked: false, icon: "" + WEBPATH + "Content/images/legend/see.png" },
    { id: 3, pId: 1, name: "传感器", layerurl: MapConfig.searchMapUrl, layerid: "layer1", checked: false, icon: "" + WEBPATH + "Content/images/legend/sensors.png" }
];