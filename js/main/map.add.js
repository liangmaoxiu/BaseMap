if (typeof DCI == "undefined") { var DCI = {}; }
/**
 * 在地图上添加地图点
 */ 
DCI.add = {
		map:null,
		graphicslayer:null,
		incidentsGraphicsLayer:null,
		facilitiesGraphicsLayer:null,
		routeGraphicLayer:null,
		closestFacilityTask:null,
		params:null,
		closestFacilityTask:null,
		isload:false,
		intervalId:null,
        dialog:null,
        wholedialog: null,
        drawtool: null,
        pageIndex: 0,
        pageSize: 10,
        sgeometry:null,
        accidentPosition: {//默认事故对象模版
            eventName: "xx仓库气体泄漏",
            ocrTime: "2016-8-4 13:54",
            x: "",
            y: ""
        },
        html: "<div class='route_serch_left'>" +
              "<span>点击位置：</span>" +
              '<input  value="" type="text" style="width:130px;height:27px" id="pointLocation">' +
              "<input type='button' class='route_point' id='pointArrow' style='float:right;'>" +
              "</div>"+
              "<div class='route_serch_left'>" +
              "<span>风险编号：</span>" +
              '<input id="code" type="text" style="width:130px;height:27px">' +
           	  "</div>"+
			  "<div class='route_serch_left'>" +
              "<span>风险名称：</span>" +
              '<input id="name"  type="text" style="width:130px;height:27px">' +
			  "</div>"+
			  "<div class='route_serch_left'>" +
			  "<span>风险种类：</span>" +
			  '<select  id="kind" name="kind"  style="width:130px;height:27px">'+
				'<option value ="">=请选择=</option>'+
				'<option value ="1">煤尘</option>'+
				'<option value ="2">水</option>'+
				'<option value ="3">火</option>'+
				'<option value ="4">瓦斯</option>'+
				'<option value ="5">顶板</option>'+
		      '</select>' +
			  "</div>"+
			  "<div class='route_serch_left'>" +
			  "<span>风险等级：</span>" +
				'<select id="level" name="level" style="width:130px;height:27px">'+
					'<option value ="">=请选择=</option>'+
					'<option value ="1">重大</option>'+
					'<option value ="2">较大</option>'+
					'<option value ="3">一般</option>'+
					'<option value ="4">较小</option>'+
				'</select>' +
			 "</div>"+
		   "<div class='route_serch_left'>" +
		   '<button type="button" class="btn btn-primary" id="addBtn" style="margin:10px 30px;">确定</button>'+
		   '<button type="button" class="btn btn-white" style="margin:10px 30px;">取消</button>'+
		   "</div>",
		//模块初始化函数
		Init:function(map){
			DCI.add.map = map;
			DCI.add.isload = true;
			//初始化事故点以及应急资源图层
			DCI.add.params = new esri.tasks.ClosestFacilityParameters();      
			DCI.add.params.defaultCutoff= 7.0;
			DCI.add.params.defaultTargetFacilityCount = 6.0;
			DCI.add.params.returnFacilities=true;
			DCI.add.params.returnIncidents=true;
			DCI.add.params.returnRoutes=true;
			DCI.add.params.returnDirections=true;
			DCI.add.closestFacilityTask = new esri.tasks.ClosestFacilityTask(MapConfig.routeUrl);

			DCI.add.bufferLayer = new esri.layers.GraphicsLayer();
			DCI.add.map.addLayer(DCI.add.bufferLayer);//将图层赋给地图

			var routePolylineSymbol = new esri.symbols.SimpleLineSymbol(
					esri.symbols.SimpleLineSymbol.STYLE_SOLID,
			          new esri.Color([0, 255, 0]),
			          6.0
			        );
			DCI.add.routeGraphicLayer = new esri.layers.GraphicsLayer();
			DCI.add.routeGraphicLayer.id = "routeGraphicLayer";
			var routeRenderer = new esri.renderers.SimpleRenderer(routePolylineSymbol);
			DCI.add.routeGraphicLayer.setRenderer(routeRenderer);
			DCI.add.map.addLayer(DCI.add.routeGraphicLayer);  //将图层赋给地图

			//事故点图层
			var incidentPointSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
					new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,
							new esri.Color([255,0,0]), 1),
							new esri.Color([255,0,0,1]));  
			DCI.add.incidentsGraphicsLayer = new esri.layers.GraphicsLayer();
			DCI.add.incidentsGraphicsLayer.id = "incidentsGraphicsLayer";
			var incidentsRenderer = new esri.renderers.SimpleRenderer(incidentPointSymbol);
			DCI.add.incidentsGraphicsLayer.setRenderer(incidentsRenderer);
			DCI.add.map.addLayer(DCI.add.incidentsGraphicsLayer);  //将图层赋给地图
			//DCI.add.incidentsGraphicsLayer.hide();
			//应急资源图层
			var facilityPointSymbol = new esri.symbols.SimpleMarkerSymbol(esri.symbols.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
					new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID,
							new esri.Color([0,0,255]), 1),
							new esri.Color([0,0,255,1]));
			DCI.add.facilitiesGraphicsLayer = new esri.layers.GraphicsLayer();
			DCI.add.facilitiesGraphicsLayer.id = "facilitiesGraphicsLayer";
			var facilityRenderer = new esri.renderers.SimpleRenderer(facilityPointSymbol);
			DCI.add.facilitiesGraphicsLayer.setRenderer(facilityRenderer);
			DCI.add.map.addLayer(DCI.add.facilitiesGraphicsLayer);  //将图层赋给地图	
			DCI.add.facilitiesGraphicsLayer.hide();
			DCI.add.facilitiesGraphicsLayer.on("click", function(evt){
				var htmlstr = "<div class='monitorinforwin_Container' style='width: 330px;border: 0.5px solid #ABADCE;' id='inforwin_Container'>"+
				"<div class='syn_tit' style='border-bottom: 1px solid #C6CBCE;'>"+
				"<span style='margin-left: 5px;'>"+evt.graphic.attributes.Name+"</span>"+
				   "<div id='infoClose' class='closeButton' style='margin-right: 4px;'></div>"+
				"</div>"+

				"<div class='route_tit'>";
				htmlstr +="<label>数量:</label><label>" + evt.graphic.attributes.num + "</label></br>";
				htmlstr +="<label>用途:</label><label>" + evt.graphic.attributes.route + "</label></br>";
				htmlstr +="<label>类型:</label><label>" + evt.graphic.attributes.size + "</label></br>";
				//htmlstr +="<label>编号:</label><label>" + evt.graphic.attributes.ID + "</label></br>";
				htmlstr +="</div>"+	                	   
				"<div style='border-top: 1px solid #C6CBCE;height:40px;' class='route_tit'>"+
				"<button id='routeInfoButton' style='height:28px;width:90px;float:right;margin-right:5px;margin-top:5px' class='btn btn-default btn-sm' ><i style='margin-right:3px' class='glyphicon glyphicon-search'></i>路线详情</button>"+				
				"</div>"+

				"</div>";
				//var pt = new esri.geometry.Point(array [0],array [1],DCI.add.map.spatialReference);
				var pt = evt.mapPoint;
                DCI.add.map.infoWindow.resize(350, 200);
                DCI.add.map.infoWindow.setContent(htmlstr);
                setTimeout(function () {
                	DCI.add.map.infoWindow.show(pt);
                }, 500);
                $("#infoClose").click(function () {
                	DCI.add.map.infoWindow.hide();
                });
                //救援路线详情
                $("#routeInfoButton").click(function () {
                	//DCI.add.id = evt.graphic.attributes.ID;
                    //点击的资源
    				DCI.add.initState();
                	var resources = [];
                	var resource = {};
                	resource.name = evt.graphic.attributes.Name;
                	resource.num = evt.graphic.attributes.num;
                	resource.route = evt.graphic.attributes.route;
                	resource.size = evt.graphic.attributes.size;
                	resource.x = evt.graphic.geometry.x;
                	resource.y = evt.graphic.geometry.y;
                	resources.push(resource);
                	//执行一对一两点的救援路径
					DCI.add.InitRoute(ems.drill.accidentPosition,resources,1);
                });	
                
			});
			//底图图层
		    //var highlightSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0,255,255],1), 6.5);
			//var highlightSymbol = new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 255, 255]), 6.5);
			var highlightSymbol = new esri.symbols.SimpleLineSymbol(
					esri.symbols.SimpleLineSymbol.STYLE_SOLID,
			          new esri.Color([255, 255, 4]),
			          6.0
			        );
			DCI.add.graphicslayer = new esri.layers.GraphicsLayer();
			DCI.add.graphicslayer.id = "route";
			var baseRenderer = new esri.renderers.SimpleRenderer(highlightSymbol);
			DCI.add.graphicslayer.setRenderer(baseRenderer);
			DCI.add.map.addLayer(DCI.add.graphicslayer);  //将图层赋给地图
			//车辆图层
			DCI.add.carGraphicslayer = new esri.layers.GraphicsLayer();
			DCI.add.carGraphicslayer.id = "ems_car";
			DCI.add.map.addLayer(DCI.add.carGraphicslayer);  //将图层赋给地图

			DCI.add.pointlayer = new esri.layers.GraphicsLayer();
			DCI.add.map.addLayer(DCI.add.pointlayer);//将图层赋给地图
			DCI.add.drawtool = new esri.toolbars.Draw(map, { showTooltips: true });
			DCI.add.drawtool.on("draw-end", DCI.add.addToMap);
		    //箭头点添加点击事件
			$("#pointArrow").bind("click", function (event) {
			    if (DCI.add.dialog)
			        DCI.add.dialog.close();
			    if (DCI.add.wholedialog)
			        DCI.add.wholedialog.close();
			    DCI.add.incidentsGraphicsLayer.clear();
			    DCI.add.routeGraphicLayer.clear();
			    DCI.add.bufferLayer.clear();
			    DCI.add.graphicslayer.clear();
			    DCI.add.pointlayer.clear();
			    DCI.add.carGraphicslayer.clear();
			    $("#queryshowListroute").empty();
			    $("#querylistpageroute").empty();

			    $("#pointLocation").val("");
			    DCI.add.map.setMapCursor('crosshair');
			    DCI.add.drawtool.activate(esri.toolbars.Draw.POINT);
			})
		},
       /*
        *根据坐标点获取地名
        */
		addToMap: function (evt) {
		    var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/poiLocation.png", 30, 30);
		    var graphic = new esri.Graphic(evt.geometry, stopSymbol);
		    DCI.add.incidentsGraphicsLayer.add(graphic);
		    DCI.add.drawtool.deactivate();
		    DCI.add.map.setMapCursor('auto');
		    DCI.add.accidentPosition.x = evt.geometry.x;
		    DCI.add.accidentPosition.y = evt.geometry.y;
		    $("#pointLocation").val(evt.geometry.x.toFixed(3) + "," + evt.geometry.y.toFixed(3));
		},

		/**
		 * 恢复原始状态
		 */ 
		initState:function(){
			DCI.add.graphicslayer.clear();
			DCI.add.carGraphicslayer.clear();
			if(DCI.add.intervalId){
				window.clearInterval(DCI.add.intervalId);
			}			
		},
        /**
         * 切换到其他模块再回来--默认初始化状态
         */
	    InitState: function () {
	        if (DCI.add.dialog)
	            DCI.add.dialog.close();
	        if (DCI.add.wholedialog)
	            DCI.add.wholedialog.close();
	        // 坐标
			$("#pointLocation").val("");
			// 风险编号
			$('#code').val("");
			// 风险名称
			$('#name').val("");
			// 风险种类
			$('#kind').val("");
			// 风险等级
			$('#level').val("");
	    },
	    
		
}