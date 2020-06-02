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
    // 显示人员信息位置
    showPoup:function(style){
        DCI.poup.queryPoints(style);
    },
    // 查询出所有的人员位置信息
    queryPoints: function (style) {
        var url;
        // 模板类型
        var infoType;
        if(style =="P"){
            url =backbasePath + '/apia/v1/arcgis/getAllInfo';
            infoType="metro";
        }else if(style =="G"){
            url =backbasePath + '/apia/v1/arcgis/getAllGoods';
            infoType="goods"
        }else{
            url =backbasePath + '/apia/v1/arcgis/getAllWarning';
        }
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            dataType: 'json',
            data:{},
            async: true,
            success: function(data) {
                // 创建线数组
                var lines = new Array();
                // 将返回的responseText 解析出来
                if (data.code == "000000") {
                    // 后台返回的结果
                    var list = data.data;
                    var rExtent = null;
                    // 坐标符号
                    var symbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/poiLocation.png", 24, 24);
                    // 遍历数据
                    for (var key in list) {
                        var htmlstr = DCI.poup.getQueryWinContent(list[key], infoType,style);
                        var attr = {
                            "title": "",
                            "content": htmlstr
                        };
                        // 根据坐标形成一个点
                        var newPoint = new esri.geometry.Point({
                            "x": list[key].x_axis,
                            "y":list[key].y_axis,
                            "spatialReference": DCI.Route.map.spatialReference
                        }); 
                        var baseGraphic = new esri.Graphic(newPoint, symbol, attr);
                        //创建客户端图层
                        graphicsLayer = new esri.layers.GraphicsLayer();
                        DCI.poup.graphicslayer.add(baseGraphic);
                        DCI.poup.map.graphics.add(baseGraphic);
                        DCI.poup.map.addLayer(graphicsLayer);
                        //设置地图显示范围
                        if (rExtent == null)
                            rExtent = baseGraphic._extent;
                        else {
                            rExtent = rExtent.union(baseGraphic._extent);
                        }
                    }
                }
            },
            error: function(data) {
                var result = "";
                if (data.msg == '' || data.msg == null) {
                    result = "查询坐标数据报错";
                } else {
                    result = data.msg;
                }
                toastr.error(result);
            }
        });
    },
    /**
     * 气泡窗口信息详情模板
     */
    getQueryWinContent: function (json, pointType,type) {
        var html = "";
        var fields;
        if (MapConfig.fields[pointType]){
            //默认是配置文件的第一个配置字段列表
            fields = MapConfig.fields[pointType].simple; 
        }
        else {
            return html;
        }
        html = "<div class='inforwin_Container' style='width:300px;border: 0px solid #ABADCE;' id='inforwin_Container'>" +
            "<div class='resource_tit' style='margin: 0;'>" +
            "<table>";
        if (fields.length > 0) {
            for (var i = 0; i < fields.length; i++) {
                // 人员信息查询
                if(type =="P"){
                    if( fields[i].field == "Name"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.name + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Code"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.identity_num + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Phone"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.mobile + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Address"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.address + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                } 
                // 物资查询
                else if(type =="G"){
                    if( fields[i].field == "Name"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.planresources_name + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Code"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.planresources_no + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Number"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.planresources_count + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                    else if( fields[i].field == "Note"){
                        html += "<tr>" +
                        "<td><label>" + fields[i].alias + ":</label></td>" +
                        "<td><input id='" + fields[i].field + "' type='text' value='" + json.planresources_note + "' style='height:22px;width:200px;margin:1px;'></input></td>" +
                        "</tr>";
                    }
                } 
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
        DCI.poup.map.infoWindow.resize(320, 500);
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

    //清空和隐藏气泡窗口函数
    clearAndhide: function() {
        DCI.poup.map.graphics.clear();
        for (var i = 0; i < DCI.poup.map.graphicsLayerIds.length; i++) {
            var layer = DCI.poup.map.getLayer(DCI.poup.map.graphicsLayerIds[i]);
            layer.clear();
        }
        DCI.poup.map.infoWindow.hide();
    },

}