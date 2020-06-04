if(typeof DCI=="undefined"){
    var DCI={};
}
DCI.warnArea={
    /**
     * 全局变量
     */
    map: null, //地图对象
    /*
     *初始化加载函数
     */
    Init: function (map) {
        DCI.warnArea.map = map;
    },
    //加载矿图危险区
    loadArea:function(){
         //创建客户端图层
         var graphicslayer = new esri.layers.GraphicsLayer();
         
         var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,new dojo.Color([255,0,0]),2),new dojo.Color([255,255,0,0.25]));
         DCI.warnArea.map.addLayer(graphicslayer);
         var ring=[];
         ring[0]=[[37620964.576293945,4176981.2725219727],[37620662.3560791,4176107.7700805664],[37620737.61431885, 4175510.0123291016]];

       var geometry=new esri.geometry.Polygon({
         "rings":ring,
         "spatialReference":DCI.warnArea.map.spatialReference
        });
         var graphic=new esri.Graphic(geometry,symbol);
         graphicslayer.add(graphic);
    },
    //加载集团层禁采区

    //加载集团层矿区范围
}