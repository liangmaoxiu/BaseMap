if (typeof DCI == "undefined") { var DCI = {}; }
/**
 * 在地图上添加地图点
 */ 
DCI.add = {
		map:null,
		graphicslayer:null,
		incidentsGraphicsLayer:null,
		closestFacilityTask:null,
		params:null,
		closestFacilityTask:null,
		intervalId:null,
        drawtool: null,
        pageIndex: 0,
        pageSize: 10,
        sgeometry:null,
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
		   '<button type="button" class="btn btn-white" style="margin:10px 30px;" id="cancelBtn">取消</button>'+
		   "</div>",
		//模块初始化函数
		Init:function(map){
			DCI.add.map = map;
			DCI.add.pointlayer = new esri.layers.GraphicsLayer();
			DCI.add.map.addLayer(DCI.add.pointlayer);//将图层赋给地图
			DCI.add.drawtool = new esri.toolbars.Draw(map, { showTooltips: true });
			DCI.add.drawtool.on("draw-end", DCI.add.addToMap);
		    //箭头点添加点击事件
			$("#pointArrow").bind("click", function (event) {
				// 点击之前先把地图上的图层清理干净
				DCI.add.clearAndhide();
			    $("#pointLocation").val("");
			    DCI.add.map.setMapCursor('crosshair');
			    DCI.add.drawtool.activate(esri.toolbars.Draw.POINT);
			})
			//确定添加点击事件
			$("#addBtn").bind("click", function () {
				DCI.add.submit();
			})                                                
			//取消
			$("#cancelBtn").bind("click", function () {
				DCI.add.InitState();
			})
		},
		submit:function(){
			var x_ais;
			var y_ais;
			// 坐标
			var location=$('#pointLocation').val();
			// 风险编号
			var code=$('#code').val();
			// 风险名称
			var name=$('#name').val();
			// 风险种类
			var kind=$('#kind').val();
			// 风险等级
			var level=$('#level').val();
			if(location == "" || location == null){
				toastr.error('风险点的位置不能为空');
				$('#pointLocation').focus();
				return false;
			}else{
				var arr= location.split(",");
				if(arr.length > 0){
					x_ais=arr[0];
					y_ais=arr[1];
				}
			}
			if(code == "" || code == null){
				toastr.error('风险编号不能为空');
				$('#code').focus();
				return false;
			}
			if(name == "" || name == null){
				toastr.error('风险名称不能为空');
				$('#name').focus();
				return false;
			}
			if(kind == "" || kind == null){
				toastr.error('风险种类不能为空');
				return false;
			}
			if(level == "" || level == null){
				toastr.error('风险等级不能为空');
				return false;
			}
			// 创建form对象
			var param = new FormData();
			param.append('code', code);
			param.append('name',name);
			param.append('kind', kind);
			param.append('level', level);
			param.append('x_ais', x_ais);
			param.append('y_ais', y_ais);
			param.append('insertOrUpdate', "3");
			param.append('token', $('#token').val());
			//添加
			$.ajax({
				cache: false,
				type: "POST",
				url:backbasePath+'/apia/v1/riskManager/addOrEdit',
				data:param,
				async: true,
				contentType: false,
				processData: false,
				success: function(data) {
					data = eval("("+data+")");
					if('000000'==data.code){
						toastr.success(data.msg);
						DCI.add.InitState();
					}else{
						toastr.error(data.msg);
					}
				},
				error:function(){
					toastr.error('添加失败！');
				}
			});
		},
       /*
        *根据坐标点获取地名
        */
		addToMap: function (evt) {
		    var stopSymbol = new esri.symbol.PictureMarkerSymbol(getRootPath() + "Content/images/poi/poiLocation.png", 30, 30);
		    var graphic = new esri.Graphic(evt.geometry, stopSymbol);
			DCI.add.pointlayer.add(graphic);
		    DCI.add.drawtool.deactivate();
		    DCI.add.map.setMapCursor('auto');
		    $("#pointLocation").val(evt.geometry.x.toFixed(3) + "," + evt.geometry.y.toFixed(3));
		},

		/**
		 * 恢复原始状态
		 */ 
		clearAndhide:function(){
			DCI.add.map.graphics.clear();
			for (var i = 0; i < DCI.add.map.graphicsLayerIds.length; i++) {
				var layer = DCI.add.map.getLayer(DCI.add.map.graphicsLayerIds[i]);
				layer.clear();
			}
		},
        /**
         * 切换到其他模块再回来--默认初始化状态
         */
	    InitState: function () {
			// 将地图图标清除掉
			DCI.add.pointlayer.clear();
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