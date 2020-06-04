if (typeof DCI == "undefined") { var DCI = {}; }
DCI.Route = {
    map: null, //地图对象
    graphicslayer: null, //显示图层
    locator: null, //地理编码服务对象
    drawtool: null,
    flag: null,
    routeTask: null,
    routeParams: null,
    lastStop: null,
    routeSymbol: null,
    curGraphic: null,
    html: "<div class='route_serch_left'>" +
        "<input type='button' class='route_star' id='route1'>" +
        "<input type='datetime-local' id='routeStar' class='route_txt'>" +
        "</div>" +
        "<div class='route_serch_left'>" +
        "<input type='button' class='route_end' id='route2'>" +
        "<input type='datetime-local' id='routeEnd' class='route_txt'>" +
        "</div>" +
        "<div id='routenavwatchQuery' class='routenav_watchQuery'></div>" +
        "<!-- 历史轨迹获取结果显示 -->" +
        "<div>" +
        "<div id='routeShowList_scroll' class='route-content'>" +
        "<div id='routeshowList' style='width:100%;height:100%;margin-left: 5px;margin-top:20px;'></div>" +
        "</div>" +
        "</div>",
    /*
     *初始化加载函数
     */
    Init: function(map) {
        //动态设置高度
        $("#routeShowList_scroll").height($(".nav_Item_Content").height() - $(".route_serch_left").height() - $(".route_serch_left").height() - $("#routenavwatchQuery").height());
        DCI.Route.map = map;
        //事件监控部分
        function InitEvent() {
            //查询按钮触发事件
            $("#routenavwatchQuery").bind("click", function(event) {
                //清空数组
                var start = $("#routeStar").val().replace(/[-T:]/g, "");
                var end = $("#routeEnd").val().replace(/[-T:]/g, "");
                if (start == "" || start == undefined) {
                    promptdialog("提示信息", "起点时间不能为空!");
                    return;
                }
                if (end == "" || end == undefined) {
                    promptdialog("提示信息", "终点时间不能为空!");
                    return;
                }
                if (start > end) {
                    promptdialog("提示信息", "起点时间不能大于终点时间!");
                    return;
                }
                // 根据时间查询出员工以及坐标信息
                DCI.Route.GetInfoByDate(start, end);
            })
            dojo.connect("onGraphicAdd", function(graphic) {
                DCI.Route.curGraphic = graphic;
            });
        }
        InitEvent(); //私有方法可以在函数作用域范围内使用
    },
    // 根据起始时间查询矿工信息
    GetInfoByDate: function(start, end) {
        $.ajax({
            cache: false,
            type: "POST",
            url: backbasePath + '/apia/v1/arcgis/getInfoByDate',
            dataType: 'json',
            data: {
                startTime: start,
                endTime: end
            },
            async: true,
            success: function(data) {
                // 将返回的responseText 解析出来
                if (data.code == "000000") {
                    $("#locationList").hide();
                    // 后台返回的结果
                    var list = data.data;
                    var divHtml = "<div id='workerList'></div>";
                    $('#routeshowList').append(divHtml);
                    //动态创建表格
                    var tableWebsiteList = document.createElement('table');
                    var trObject = document.createElement('tr');
                    var th1 = document.createElement('th');
                    th1.innerHTML = "姓名";
                    th1.style.width = "60px";
                    var th2 = document.createElement('th');
                    th2.innerHTML = "工种";
                    th2.style.width = "60px";
                    var th3 = document.createElement('th');
                    th3.innerHTML = "区队";
                    th3.style.width = "100px";
                    trObject.appendChild(th1);
                    trObject.appendChild(th2);
                    trObject.appendChild(th3);
                    tableWebsiteList.appendChild(trObject);
                    // 遍历数据动态建行
                    for (var key in list) {
                        var trObject = document.createElement('tr');
                        var td1 = document.createElement('td');
                        td1.innerHTML = '<a href="javascript:void(0);" onclick= DCI.Route.getInfoById("' + list[key].worker_id + '","' + list[key].name + '")>' + list[key].name + '</a>';
                        var td2 = document.createElement('td');
                        td2.innerHTML = list[key].worktype;
                        var td3 = document.createElement('td');
                        td3.innerHTML = list[key].sysdepartmentname;
                        trObject.appendChild(td1);
                        trObject.appendChild(td2);
                        trObject.appendChild(td3);
                        tableWebsiteList.appendChild(trObject);
                    }
                    $('#workerList').append(tableWebsiteList);
                }
            },
            error: function(data) {
                var result = "";
                if (data.msg == '' || data.msg == null) {
                    result = "查询数据报错";
                } else {
                    result = data.msg;
                }
                toastr.error(result);
            }
        });
    },
    // 根据员工id进行坐标信息的查询
    getInfoById: function(id, name) {
        $.ajax({
            cache: false,
            type: "POST",
            url: backbasePath + '/apia/v1/arcgis/getInfoById',
            dataType: 'json',
            data: {
                id: id,
            },
            async: true,
            success: function(data) {
                // 创建线数组
                var lines = new Array();
                // 将返回的responseText 解析出来
                if (data.code == "000000") {
                    // 清空数据remove
                    $('#locationList').remove();
                    // 隐藏员工div
                    $("#workerList").hide();
                    // 显示坐标div
                    $("#locationList").show();
                    var divHtml = "<div id='locationList'></div>";
                    $('#routeshowList').append(divHtml);
                    // 后台返回的结果
                    var list = data.data;
                    //动态创建表格
                    var info = "<div class='work-style'>员工：" + name + "&nbsp; 共有：" + data.count + "条记录 <span class='work-close' onclick=DCI.Route.close()>关闭</span></div>";
                    $('#locationList').append(info);
                    var tableWebsiteList = document.createElement('table');
                    var trObject = document.createElement('tr');
                    var th2 = document.createElement('th');
                    th2.innerHTML = "时间";
                    th2.style.width = "100px";
                    var th3 = document.createElement('th');
                    th3.innerHTML = "X坐标";
                    th3.style.width = "120px";
                    var th4 = document.createElement('th');
                    th4.innerHTML = "Y坐标";
                    th4.style.width = "120px";
                    // trObject.appendChild(th1);
                    trObject.appendChild(th2);
                    trObject.appendChild(th3);
                    trObject.appendChild(th4);
                    tableWebsiteList.appendChild(trObject);
                    // 遍历数据动态建行
                    for (var key in list) {
                        var tr = document.createElement('tr');
                        var td2 = document.createElement('td');
                        var point = list[key].time_point;
                        if (point != "" && point != null) {
                            var minutes = point.substring(8, 10);
                            var seconds = point.substring(point.length - 2);
                            //添加链接只在中间位置添加
                            if (key == "0" || key == (list.length - 1)) {
                                td2.innerHTML = minutes + ":" + seconds;
                            } else {
                                td2.innerHTML = '<a href="javascript:void(0);" onclick= DCI.Route.showRoute("' + list[key].x_axis + '","' + list[key].y_axis + '","' + id + '",1)>' + minutes + ':' + seconds + '</a>';
                            }
                        }
                        var td3 = document.createElement('td');
                        td3.innerHTML = list[key].x_axis;
                        var td4 = document.createElement('td');
                        td4.innerHTML = list[key].y_axis;
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        tr.appendChild(td4);
                        tableWebsiteList.appendChild(tr);
                        // 将点加在线里面
                        lines.push([list[key].x_axis, list[key].y_axis]);
                    }
                    $('#locationList').append(tableWebsiteList);
                    // 根据点形成线，显示在地图上
                    DCI.Route.showLine(lines, id);
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
    // 关闭按钮
    close: function() {
        // 坐标信息页面隐藏 显示员工页面
        $("#workerList").show();
        $("#locationList").hide();
        // 需要将地图上的小人和路径图层去掉
        DCI.Route.clearAndhide();
    },
    // 根据坐标在地图上显示
    showRoute: function(x, y, id, style) {
        // 根据坐标形成一个点
        var newPoint = new esri.geometry.Point({
            "x": x,
            "y": y,
            "spatialReference": DCI.Route.map.spatialReference
        }); 
        // 图片路径
        var imgpath = "";
        var width_height = "";
        if (style == "1") {
            imgpath = getRootPath() + "Content/images/route/redCircle.png"; 
            width_height=10;    
        } else {
            imgpath = getRootPath() + "Content/images/route/worker.png";     
            width_height=20;    
        }
        // 根据图片形成一个点
        var picSymbol = new esri.symbols.PictureMarkerSymbol(imgpath, width_height, width_height);  
        // 根据坐标形成一个图形
        var picGraphic = new esri.graphic(newPoint, picSymbol);   
        // 将图形添加在地图上   
        DCI.Route.map.graphics.add(picGraphic);
        //点击弹出气泡窗口的详情
        DCI.Route.map.graphics.on("click", function(evt) {
            // 显示详情信息
            DCI.Route.showDetail(evt, id);
        });
    },
    // 选择人员显示详情信息
    showDetail: function(evt, id) {
        $.ajax({
            cache: false,
            type: "POST",
            url: backbasePath + '/apia/v1/arcgis/getWorkerInfo',
            dataType: 'json',
            data: {
                id: id
            },
            async: false,
            success: function(data) {
                if (data.code == "000000") {
                    // 获得结果信息
                    var list = data.data;
                    var grap = evt.graphic;
                    var zoompoint = null;
                    zoompoint = grap.geometry;
                    DCI.Route.map.centerAt(zoompoint);
                    DCI.Route.map.infoWindow.resize(240, 210);
                    var content = '<div class="waitpanel" style="position:relative;top:-30px;"><ul style="text-align:left;">' +
                        '<li>姓名:' + list.name + '<li>' +
                        '<li>年龄:' + list.age + '<li>' +
                        '<li>工种:' + list.worktype + '<li>' +
                        '<li>电话:' + list.mobile + '<li>' +
                        '<li>住址:' + list.address + '<li>' +
                        '<li>身份证:' + list.identity_num + '<li>' +
                        '</ul></div>';
                    // 标题显示部门名称
                    DCI.Route.map.infoWindow.setTitle(list.sysdepartmentname);
                    DCI.Route.map.infoWindow.setContent(content);
                    setTimeout(function() {
                        DCI.Route.map.infoWindow.show(zoompoint);
                    }, 500);
                }
            },
            error: function(data) {
                var result = "";
                if (data.msg == '' || data.msg == null) {
                    result = "查询数据报错";
                } else {
                    result = data.msg;
                }
                toastr.error(result);
            }
        });
    },
    // 根据坐标位置形成路线
    showLine: function(lines, id) {
        // x 坐标 y坐标
        var x_axis;
        var y_axis;
        // 循环坐标信息获取第一个和最后一个坐标显示图片
        for (var key in lines) {
            if (key == "0" || key == (lines.length - 1)) {
                x_axis = lines[key][0];
                y_axis = lines[key][1];
                DCI.Route.showRoute(x_axis, y_axis, id, "2");
            }
        }
        //创建客户端图层
        var graphicsLayer = new esri.layers.GraphicsLayer();
        //定义线符号
        var lineSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_DASH, new esri.Color([255, 0, 0]), 2)
        var geometry = new esri.geometry.Polyline({
            "paths": [lines],
            "spatialReference": DCI.Route.map.spatialReference
        })
        var graphic = new esri.graphic(geometry, lineSymbol); 
        graphicsLayer.add(graphic);
        DCI.Route.map.graphics.add(graphic);
        DCI.Route.map.addLayer(graphicsLayer);
    },
    //清空和隐藏气泡窗口函数
    clearAndhide: function() {
        DCI.Route.map.graphics.clear();
        for (var i = 0; i < DCI.Route.map.graphicsLayerIds.length; i++) {
            var layer = DCI.Route.map.getLayer(DCI.Route.map.graphicsLayerIds[i]);
            layer.clear();
        }
        DCI.Route.map.infoWindow.hide();
    },
    /**
     * 切换到其他模块再回来--默认初始化状态
     */
    InitState: function() {
        //控制显示或隐藏
        $("#routeStar").val("");
        $("#routeEnd").val("");
        $("#routeshowList").empty();
    }
}