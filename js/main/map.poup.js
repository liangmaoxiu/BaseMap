if (typeof DCI == "undefined") {
    var DCI = {};
}
DCI.poup = {
    /**
     * 全局变量
     */
    map: null, //地图对象
    graphicslayer: null, //显示图层
    /*
     *初始化加载函数
     */
    Init: function (map) {
        DCI.poup.map = map;
        //创建客户端图层
        DCI.poup.graphicslayer = new esri.layers.GraphicsLayer({opacity:1});
        DCI.poup.map.addLayer(DCI.poup.graphicslayer);
         //监听点图层的点击响应事件
         DCI.poup.addGraphicsLayerEvent();
    },
    showPoup:function(){
        //alert("人员冒泡显示");
        DCI.poup.queryPoints();
    },
    queryPoints: function () {
        var typeUrl = "";
        var queryTask = "";
        var query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "1=1";
        typeUrl = "http://192.168.31.41:6080/arcgis/rest/services/XHG/xhgtext/MapServer/2";
        queryTask = new esri.tasks.QueryTask(typeUrl);
        queryTask.execute(query, function (results) {
            var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/poiLocation.png", 24, 24);
            if (results.features.length > 0) {
                var rExtent = null;
                for (var i = 0; i < results.features.length; i++) {

                    var htmlstr = DCI.poup.getQueryWinContent(results.features[i].attributes, "metro");
                    var attr = {
                        "title": "",
                        "content": htmlstr
                    };
                    var baseGraphic = new esri.Graphic(results.features[i].geometry, symbol, attr);
                    //创建客户端图层
                    graphicsLayer = new esri.layers.GraphicsLayer();
                    DCI.poup.graphicslayer.add(baseGraphic);//poiBusiness
                  //  graphicsLayer =DCI.poup.graphicslayer;

                    DCI.poup.map.graphics.add(baseGraphic);
                    DCI.poup.map.addLayer(graphicsLayer);
                    //设置地图显示范围
                    if (rExtent == null)
                        rExtent = baseGraphic._extent;
                    else {
                        rExtent = rExtent.union(baseGraphic._extent);
                    }
                }

                //DCI.poup.map.esriMap.setExtent(rExtent.expand(2));
            } else {
                alert("搜索不到相关数据");
            }
        });
    },
    /**
     * 气泡窗口信息详情模板
     */
    getQueryWinContent: function (json, pointType) {
        var html = "";
        if (MapConfig.fields[pointType])
            var fields = MapConfig.fields[pointType].simple; //默认是配置文件的第一个配置字段列表
        else {
            return html;
        }
        html = "<div class='inforwin_Container' style='width:300px;border: 0px solid #ABADCE;' id='inforwin_Container'>" +
            "<div class='resource_tit' style='margin: 0;'>" +
            "<table>";
        if (fields.length > 0) {
            for (var i = 0; i < fields.length; i++) {
                html += "<tr>" +
                    "<td><label>" + fields[i].alias + ":</label></td>" +
                    "<td><input id='" + fields[i].field + "' type='text' value='" + json[fields[i].field] + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                    "</tr>";
            }
        }
        html += "</table>" +
            "</div>";
        html += "</div>";
        return html;
    },
    /**
     * 业务标注点-弹出气泡窗口显示详情
     */
    showQueryGraphicWin: function (graphic) {
        var pt = graphic.geometry;
        DCI.poup.map.centerAt(pt);
        DCI.poup.map.infoWindow.resize(320, 650);
        DCI.poup.map.infoWindow.setTitle(graphic.attributes.title);
        DCI.poup.map.infoWindow.setContent(graphic.attributes.content);
        setTimeout(function () {
            DCI.poup.map.infoWindow.show(pt);
        }, 500);
    },
    /**
     * 添加graphiclayer监听事件
     * 点击图标弹出气泡窗口显示详情
     */
    addGraphicsLayerEvent:function(){
        DCI.poup.graphicslayer.on("click", function (event) {
            DCI.poup.curGraphic = event.graphic;
            DCI.poup.showQueryGraphicWin(event.graphic);
        });
    },

}