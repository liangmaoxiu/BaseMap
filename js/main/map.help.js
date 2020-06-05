if (typeof DCI == "undefined") { var DCI = {}; }
DCI.Help = {
    map: null,//地图对象
    graphicslayer: null,//显示图层
    locator: null,//地理编码服务对象
    drawtool: null,
    flag: null,
    routeTask: null,
    routeParams: null,
    lastStop: null,
    routeSymbol: null,
    curGraphic: null,
    pointlayer:null,
    html: "<div class='route_serch_left'>" +
         "<input type='button' class='route_star' id='route1'>" +
         "<input type='text' id='helpRouteStar' class='route_txt'>" +
         "<input type='button' class='route_point' id='point1'>" +
         "</div>"+
         "<div class='route_serch_left'>" +
         "<input type='button' class='route_end' id='route2'>" +
         "<input type='text' id='helpRouteEnd' class='route_txt'>" +
         "<input type='button' class='route_point' id='point2'>" +
         "</div>"+
         "<div id='routhelpQuery' class='routenav_watchQuery'></div>" +
         "<!-- 路径导航查询获取结果显示 -->" +
           "<div>" +
              "<div id='helpRouteshowList_scroll' class='route-content'>" +
                 "<div id='helpRouteshowList' style='width:100%;height:100%;margin-left:2px;'></div>" +
              "</div>" +
           "</div>",
    /*
    *初始化加载函数
    */
    Init: function (map) {
        //动态设置高度
        $("#helpRouteshowList_scroll").height($(".nav_Item_Content").height() - $(".route_serch_left").height() - $(".route_serch_left").height() - $("#routhelpQuery").height());
        //dojo.require("esri.tasks.RouteTask");
        //dojo.require("esri.tasks.RouteParameters");
        //dojo.require("esri.tasks.locator");
        DCI.Help.map = map;
        DCI.Help.pointlayer = new esri.layers.GraphicsLayer();
        DCI.Help.map.addLayer(DCI.Help.pointlayer);//将图层赋给地图
        DCI.Help.graphicslayer = new esri.layers.GraphicsLayer();
        DCI.Help.graphicslayer.id = "helproute";
        DCI.Help.map.addLayer(DCI.Help.graphicslayer);//将图层赋给地图
        //DCI.Help.locator = new esri.tasks.Locator("http://localhost:6080/arcgis/rest/services/POIguangzhou_Locator/GeocodeServer");
        DCI.Help.locator = new esri.tasks.Locator(MapConfig.locatorUrl);
        DCI.Help.drawtool = new esri.toolbars.Draw(map, { showTooltips: true });
        DCI.Help.drawtool.on("draw-end", DCI.Help.addToMap);
        //路网初始化设置
        // DCI.Help.routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([0, 0, 255, 0.5])).setWidth(5);
        DCI.Help.routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(new dojo.Color([0, 0, 255, 0.5])).setWidth(5);
        
        //DCI.Help.routeTask = new esri.tasks.RouteTask("http://localhost:6080/arcgis/rest/services/road/NAServer/Route");
        DCI.Help.routeTask = new esri.tasks.RouteTask(MapConfig.routetaskUrl);
        DCI.Help.routeParams = new esri.tasks.RouteParameters();
        DCI.Help.routeParams.stops = new esri.tasks.FeatureSet();
        DCI.Help.routeParams.returnDirections = true;
        DCI.Help.routeParams.returnRoutes = true;
        DCI.Help.routeParams.returnStops = true;
        DCI.Help.routeParams.outSpatialReference = DCI.Help.map.spatialReference;
        DCI.Help.routeTask.on("solve-complete", DCI.Help.showRoute);
        DCI.Help.routeTask.on("error", DCI.Help.errorRoute);
        //事件监控部分
        function InitEvent() {
            //查询按钮触发事件
            $("#routhelpQuery").bind("click", function (event) {
                //DCI.Help.map.graphics.clear();
                DCI.Help.pointlayer.clear();
                //清空数组
                var keyword1 = $("#helpRouteStar").val();
                var keyword2 = $("#helpRouteEnd").val();
                if (keyword1 == "" || keyword1 == undefined) {
                    promptdialog("提示信息", "起点不能为空!");
                    return;
                }
                else{
                    DCI.Help.DoAddressToLocations(keyword1,0);
                }
                if (keyword2 == "" || keyword2 == undefined) {
                    promptdialog("提示信息", "终点不能为空!");
                    return;
                }
                else {
                    DCI.Help.DoAddressToLocations(keyword2,1);
                }
            })
            //起点位置添加事件
            $("#point1").bind("click", function (event) {
                DCI.Help.pointlayer.clear();
                DCI.Help.map.graphics.clear();
                DCI.Help.routeParams.stops.features = [];
                DCI.Help.flag = true;

                DCI.Help.map.setMapCursor('crosshair');
                DCI.Help.drawtool.activate(esri.toolbars.Draw.POINT);
            })
            //终点位置添加事件
            $("#point2").bind("click", function (event) {
                DCI.Help.flag = false;
                DCI.Help.map.setMapCursor('crosshair');
                DCI.Help.drawtool.activate(esri.toolbars.Draw.POINT);
            })
            dojo.connect(DCI.Help.pointlayer, "onGraphicAdd", function (graphic) {
                DCI.Help.curGraphic = graphic;
            });


        }
        InitEvent();//私有方法可以在函数作用域范围内使用

         //设置自动补全
        DCI.Help.autoComple("helpRouteStar");

        DCI.Help.autoComple("helpRouteEnd");
    },
    //========自动补全的实现 为有个input 设置自动补全功能方法================
    autoComple: function (elementID) {
        //elementID ：为其设置自动补全的元素
        $("#" + elementID).autocomplete({
            source: function (request, response) {
                var data = [];//初始化结果数组
                var queryTask = "";
                var query = new esri.tasks.Query();
                query.returnGeometry = true;
                query.outFields = ["BlockName"];
                //query.outSpatialReference = { "wkid": 4326 };
                query.where = "BlockName like '%" + request.term + "%'";
                queryTask = new esri.tasks.QueryTask(MapConfig.poiURL);
                queryTask.execute(query, navInfoatuo);
                function navInfoatuo(result) {
                    for (var i = 0; i < 10; i++) {
                        if (result.features[i] == undefined) //不够十条
                            break;
                        data.push(result.features[i].attributes.BlockName);
                    }                
                    response(data);
                }

                //response(dataArray);
                // 将数组数据交给Autocomplete显示为菜单
                // 如果情况特殊，你也可以不调用，从而不显示菜单
            },
            response: function (event, ui) {
                // event 是当前事件对象
                // ui对象仅有一个content属性，它表示当前用于显示菜单的数组数据
                // 每个元素都是具有label和value属性的对象
                // 你可以对属性进行更改，从而改变显示的菜单内容
                var sourceData = [];
            
                for (var i = 0; i < ui.content.length; i++) {
                    var text = ui.content[i].label;                 
                    if ($(this).context.value) {
                        var tempObj = {
                            label: text.replace(
                        new RegExp("(?![^&;]+;)(?!<[^<>]*)([" + $(this).context.value + "])(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong style=\"color\:#3385ff\"'>$1</strong>"),
                            value: text
                        };
                        ui.content[i] = tempObj;
                    }
                }
            },
            focus: function (event, ui) {
                $(this).val(ui.item.value);
                return false;
            },
            select: function (event, ui) {


            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
            .append("<a style='font-size:12px;'>" + item.label + "</a>")
            .appendTo(ul);
        };

    },
    showRoute: function (evt) {
        $("#helpRouteshowList").empty();
        DCI.Help.map.graphics.add(evt.result.routeResults[0].route.setSymbol(DCI.Help.routeSymbol));//展示路径线路
        var directionsFS = evt.result.routeResults[0].directions;
        var i = 1;
        for(var feature in directionsFS.features)
        {
            var text = "";
            if (i == 1) {
                text += "从起点开始";
            }
            else if (i == directionsFS.features.length) {
                text += "终点结束";
            }
            else {
                text += i + "." + directionsFS.features[feature].attributes.text;
            }
           
            //判断路径段类型
            var maneuverType = directionsFS.features[feature].attributes.maneuverType;
            var fileName = DCI.Help.getImgFileName(maneuverType);
            var imgpath = getRootPath() + "Content/images/route/" + fileName;

            if (i > 1 && i < directionsFS.features.length)
            {               
                text += " (" + DCI.Help.formatDistance(directionsFS.features[feature].attributes.length, "米");
                var time = DCI.Help.formatTime(directionsFS.features[feature].attributes.time);
                if (time != "")
                {
                    text += ", " + time;
                }
                text += ")";
            }
            $('#helpRouteshowList').append('<img src="' + imgpath + '" alt="" class="route_img" />');
            $('#helpRouteshowList').append('<div class="route_list">' + text + '</div>');
            i++;
        }

    },
    errorRoute: function (err) {
        //alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));
        promptdialog("提示信息", "An error occured\n" + err.message);
        DCI.Help.routeParams.stops.features.splice(0, 0, DCI.Help.lastStop);
        DCI.Help.map.graphics.remove(DCI.Help.routeParams.stops.features.splice(1, 1)[0]);
    },
    /*
     *获取路线提示的图片文件名
     */
    getImgFileName: function (maneuverType) {
        var fileName="";
        switch (maneuverType) { 
            case "esriDMTStop":							 
                fileName = "NAEndLocx.png";
                break;
            case "esriDMTStraight":
                fileName="straight.png";
                break;
            case "esriDMTBearLeft":
                fileName = "bear-left.png";
                break;
            case "esriDMTBearRight":
                fileName = "bear-right.png";
                break;
            case "esriDMTTurnLeft":
                fileName = "left.png";
                break;
            case "esriDMTTurnRight":
                fileName = "right.png";
                break;
            case "esriDMTSharpLeft":
                fileName = "sharp-left.png";
                break;
            case "esriDMTSharpRight":
                fileName = "sharp-right.png";
                break;
            case "esriDMTUTurn":
                fileName = "uturn.png";
                break;
            case "esriDMTFerry":
                fileName = "ferry.png";
                break;
            case "esriDMTRoundabout":
                fileName = "round-about.png";
                break;
            case "esriDMTHighwayMerge":
                fileName = "highway-merge.png";
                break;
            case "esriDMTHighwayExit":
                fileName = "highway-exit.png";
                break;
            case "esriDMTHighwayChange":
                fileName = "highway-change.png";
                break;
            case "esriDMTForkCenter":
                fileName = "fork-center.png";
                break;
            case "esriDMTForkLeft":
                fileName = "fork-left.png";
                break;
            case "esriDMTForkRight":
                fileName = "fork-right.png";
                break;
            case "esriDMTDepart":
                fileName = "NAStartLocx.png";
                break;
            case "esriDMTTripItem":
                fileName = "trip-item.png";
                break;
            case "esriDMTEndOfFerry":
                fileName = "end-of-ferry.png";
                break;
            case "esriDMTTurnLeftRight":
                fileName = "left-right.png";
                break;
            case "esriDMTTurnLeftLeft":
                fileName = "left-left.png";
                break;
            case "esriDMTTurnRightLeft":
                fileName = "right-left.png";
                break;
            case "esriDMTTurnRightRight":
                fileName = "right-right.png";
                break;
					
        }
        return fileName;
    },
    /*
     *距离单位换算
     */
    formatDistance:function(dist,units){
        var result= "";				
        var d = Math.round(dist * 100) / 100;				
        if (d != 0)
        {
            result = d + " " + units;
        }				
        return result;
    },
    /*
     *时间单位换算
     */
    formatTime:function(time){
        var result="";				
        var hr = Math.floor(time / 60);
        var min = Math.round(time % 60);				
        if (hr < 1 && min < 1)
        {
            result = "";
        }
        else if (hr < 1 && min < 2)
        {
            result = min + " 分钟";
        }
        else if (hr < 1)
        {
            result = min + " 分钟";
        }
        else
        {
            result = hr + " 小时 " + min + " 分钟";
        }
				
        return result;
    },
    /*
     *根据坐标点获取地名
     */
    addToMap: function (evt) {
        if (DCI.Help.flag)   
            var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/route/NAStartLocx.png", 29, 30);
        else
            var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/route/NAEndLocx.png", 29, 30);
        var graphic = new esri.Graphic(evt.geometry, stopSymbol);
        //DCI.Help.map.graphics.add(graphic);
        DCI.Help.pointlayer.add(graphic);
        DCI.Help.drawtool.deactivate();
        DCI.Help.map.setMapCursor('auto');
        DCI.Help.locator.locationToAddress(evt.geometry, 500, DCI.Help.GetAddress, DCI.Help.GetAddresserror);
    },
    /*
     *获取地名
     */
    GetAddress: function (evt) {
        if (DCI.Help.flag)
            $("#helpRouteStar").val(evt.address.SingleKey);
        else
            $("#helpRouteEnd").val(evt.address.SingleKey);
    },
    /*
    *获取地名失败
    */
    GetAddresserror: function (evt) {
        if (DCI.Help.curGraphic)
            DCI.Help.pointlayer.remove(DCI.Help.curGraphic);
        promptdialog("提示信息","该点附近搜索不到相关信息");
    },
    /*
     *根据地名获取坐标点
     */
    DoAddressToLocations: function (keyword,type) {
        var address = { "Single Line Input": keyword };
        var params = {address: address, searchExtent: DCI.Help.map.extent};
        DCI.Help.locator.outSpatialReference = DCI.Help.map.spatialReference;
        if(type == 0)
            DCI.Help.locator.addressToLocations(params, DCI.Help.GetlocationsStart, DCI.Help.GetlocationsFault);
        else
            DCI.Help.locator.addressToLocations(params, DCI.Help.GetlocationsEnd, DCI.Help.GetlocationsFault);
    },
    /*
     *根据地名获取坐标点信息失败
    */
    GetlocationsFault: function (evt) {
        promptdialog("提示信息", "该地名获取不到相关的地理位置!");
    },
    /*
     *获取起点名称坐标点
     */
    GetlocationsStart: function (evt) {
        var point = new esri.geometry.Point(evt[0].location.x, evt[0].location.y, evt[0].location.spatialReference);
        var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/route/NAStartLocx.png", 29, 30);
        var stop = DCI.Help.map.graphics.add(new esri.Graphic(point, stopSymbol));
        DCI.Help.routeParams.stops.features.push(stop);
        if (DCI.Help.routeParams.stops.features.length >= 2) {
            DCI.Help.routeTask.solve(DCI.Help.routeParams);
            DCI.Help.lastStop = DCI.Help.routeParams.stops.features.splice(0, 1)[0];
        }
    },
    /*
     *获取终点名称坐标点
     */
    GetlocationsEnd: function (evt) {
        var point = new esri.geometry.Point(evt[0].location.x, evt[0].location.y, evt[0].location.spatialReference);
        var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/route/NAEndLocx.png", 29, 30);
        var stop = DCI.Help.map.graphics.add(new esri.Graphic(point, stopSymbol));
        DCI.Help.routeParams.stops.features.push(stop);
        if (DCI.Help.routeParams.stops.features.length >= 2) {
            DCI.Help.routeTask.solve(DCI.Help.routeParams);
            DCI.Help.lastStop = DCI.Help.routeParams.stops.features.splice(0, 1)[0];
        }
    },
    /**
     * 切换到其他模块再回来--默认初始化状态
    */
    InitState: function () {
        //控制显示或隐藏
        $("#helpRouteStar").val("");
        $("#helpRouteEnd").val("");
        $("#helphelpRouteshowList").empty();
    },



}