/**
 * Created by mac-pc on 16/7/14.
 */
define([
    'jquery',
    'bmap',
    'tocc-toms/common/mod/map/poiconfig',
    'text!tocc-toms/common/res/tpl/tpl.html',
], function ($,bmap, PoiConfig,tpl) {
    require('bmap');
    var $ = require('jquery');
    var defaultImgSrc = "http://beyondmap.cn/gisapi/resources/images/gis/icon/marker_large.png";
    var _basePath = window.AppConfig.RemoteApiUrl+"/resources/css/imgs/";

    var mapObj = {};
    var _that = {};
    var undoManager;
    var mapCenter =  window.AppConfig.mapCenter;
    //定义地图对象
    var options = {
        center: new beyond.geometry.MapPoint(mapCenter.x, mapCenter.y),
        zoom: window.AppConfig.mapZoom
    }

    var markerClusterer = null;
    var markerClustererLkyw = null;

    function initMap(containerId, callback) {
        //有些地方是地图底图服务用省运管局的或交通厅的，但是lbs服务是自己本地的，所有地址需要重新设置
        //重写gis平台里的lbs地址
        if(window.AppConfig.lbsUrl!=null&&window.AppConfig.lbsUrl!=""){
            GISRequest.LBS_URL = window.AppConfig.lbsUrl;
        }

        var map = new beyond.maps.Map(containerId, options, callback);
        //取消地图导航条
        map.hideToolbar();
        //隐藏比例尺
        map.hideScale();
        //加载鹰眼控件
        //map.addControl(new beyond.maps.BOverview());
        //加载显示经纬度控件
        //map.addControl(new beyond.maps.BXYShowControl());
        ////加载显示状态栏控件
        map.addControl(new beyond.maps.BStatusWindow());
        return map;
    }

    function locationStationLine(map,geometryStr,layerid){
        var polylineArray = beyond.maps.GeometryUtil.parseGeometry(geometryStr);
        var polyline = new beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: "#298cef", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: true   //居中放大
        });
        map.addOverlay(polyline,layerid);
        map.setExtent(polyline.getExtent());
    }

    /**
     * 编辑颜色
     * @param map
     * @param geometryStr
     * @param layerid
     */
    function editStationLine(map,geometryStr,layerid){
        var polylineArray = beyond.maps.GeometryUtil.parseGeometry(geometryStr);
        var polyline = new beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: "#298cef", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: true   //居中放大
        });
        map.addOverlay(polyline,layerid);
        polyline.enableEditing();

    }

    function getRootPath(){

        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath=window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName=window.document.location.pathname;
        var pos=curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPaht=curWwwPath.substring(0,pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
        return(localhostPaht+projectName);

    }

    /**
     * 导出历史
     * @param map
     * @param carNo
     * @param color
     * @param start
     * @param end
     */
    function historyExpert(map,carNo, color, start, end) {
        map.plugin("beyond.data.CarLbsService", function() {
            car = new beyond.data.CarLbsService();
            //car.setmap(this.$map);
            car.historyExpert(carNo,color, start, end);
        });
    }


    //地图加载完后执行的方法
    function mapLoaded() {
        cmap.plugin("beyond.maps.BOperatingLineComp",init);

        beyond.maps.Map.plugin(["beyond.UndoManager"], function() {
            undoManager = new beyond.UndoManager();
            undoManager.setMap(cmap);
        });
    }
    function init() {
        operatingLineComp = new beyond.maps.BOperatingLineComp();
        operatingLineComp.setMap(cmap);


        $("#setStart").click(function(){
            cmap.setMouseTool(DrawType.MAPPOINT, function (point) {
                operatingLineComp.setStartPoint(point.toGeo());
                cmap.setMouseTool(DrawType.PAN);
            });
        });
        $("#setEnd").click(function(){
            cmap.setMouseTool(DrawType.MAPPOINT, function (point) {
                operatingLineComp.setEndPoint(point.toGeo());
                cmap.setMouseTool(DrawType.PAN);
            });
        });

        $("#calPoint").click(function(){
            var carno = document.getElementById("zoomTxt").value;
            var carcolor = document.getElementById("plateColor").value;
            operatingLineComp.setPlateNo(carno);
            operatingLineComp.setPlateColor(carcolor);

            operatingLineComp.calPoint();
        });
    }




    /**
     * 车辆聚合相关
     * Begin
     */


    function cluster(cmap) {
        var markerClusterer = null;
        var isCustomStyle = true;//使用默认样式
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};

            //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
            options.industry = 0;
            options.scode = null;
            options.xcode = null;
            markerClusterer = new beyond.maps.BCarClusterMarker(options);
                markerClusterer.getSingleMarker = function (car) {
                    var html = '<div class="chepai">' + car["plateNo"] + '</div>';
                    //var text = new beyond.maps.BText({"htmlText":html,"offsetX":-34,"offsetY":-17});
                    var text = new beyond.maps.BComplexText({
                        "text": car["plateNo"],
                        "verticalAlign": "middle",
                        "textAlign": "center",
                        "width": 70,
                        "height": 16,
                        "offsetX": -34,
                        "offsetY": -14,
                        "fontSize": 12,
                        "backgroundColor": "#379082",
                        "fontColor": "#ffffff"
                    });
                    var angle = car["direction"];
                    var marker = new beyond.maps.Marker({
                        position: new beyond.geometry.MapPoint(car["X"], car["Y"]),//位置
                        icon: "../../resources/commons/css/imgs/car_blue.png",//图标
                        width: 12,//宽度
                        height: 22,//高度
                        angle: angle,
                        editEnable: true,
                        offsetX: 0,
                        offsetY: 0,
                        btext: text
                    });
                    return marker;
                }
                ////如果需要自定义的话，就重写此方法
                //markerClusterer.addClusterMarker = function (json) {
                //    var source;
                //    var iconSizes = [35, 25, 15, 78, 90];
                //    var width = 35;
                //    var height = 25;
                //    var num = json["NUM"];
                //    if (num < 10) {
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/01.png";
                //        width = 35;
                //        height = 25;
                //    } else if (num >= 10 && num < 100) {
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/02.png";
                //        width = 35;
                //        height = 25;
                //    } else {
                //        width = 35;
                //        height = 25;
                //        source = MapConstant["rootPath"] + "/resources/images/gis/cluster/03.png";
                //    }
                //
                //    var html = '<div style="position: absolute; padding: 0px; margin: 0px; border: 0px; width: 0px; height: 0px;">';
                //    html += '<div style="z-index:10;width:35px;font-weight:bold;position: absolute;color:#FFF;text-align:center;margin-top:1px;margin-left:1px">';
                //    html += num;
                //    html += '</div>';
                //    /*                    html+='<div style="position: absolute; margin: 0px; padding: 0px; width: 34px; height: 23px; overflow: hidden;">';
                //     html+='<img src="'+source+'" style="position:absolute;"/>';
                //     html+='</div>';*/
                //    html += '</div>';
                //
                //    var marker = new beyond.maps.Marker({
                //        "position": new beyond.geometry.MapPoint(json["X"], json["Y"], new beyond.geometry.SpatialReference(4326)),//位置
                //        "icon": source,//图标
                //        "width": width,//宽度
                //        "height": height,//高度
                //        "offsetX": 0,
                //        "offsetY": height / 2,
                //        "content": html
                //    });
                //    //marker.addEventListener();
                //    this.map.addOverlay(marker, "gpsClusterLayer");
                //};
            //}
            cmap.addOverlay(markerClusterer);
        });

        return markerClusterer;
    }



    function clearMarker() {
        if (markerClusterer != null) {
            cmap.removeOverlay(markerClusterer);
        }

    }
    function setIndustry(industry,map) {
        var markerClusterer = cluster(map);
        if (markerClusterer != null) {
            markerClusterer.setIndustry(industry);
        }
    }
    function setScode() {
        var scode = document.getElementById("scode").value;
        if (markerClusterer != null) {
            markerClusterer.setScode(scode);
        }
    }
    function showHandler()
    {
        if (markerClusterer != null) {
            markerClusterer.show();
        }
    }
    function hideHandler()
    {
        if (markerClusterer != null) {
            markerClusterer.hide();
        }
    }
    /**
     * 车辆集合相关
     * End
     */


    /**
     * 车辆聚合   全部车辆
     * vehicleType :
     *      '0':全部车辆
     *      '1':危货
     *      '2':两客
     *      '3':出租
     *      '6':挂车
     *
     */
    function vehicleCluster(vehicleType, map){
        setIndustry(vehicleType,map)
    }


    /**
     * 跟踪一辆车
     * @param carNO 跟踪的车牌号
     * @param map
     * @returns {beyond.maps.CarTrackPlay}
     */
    function trackOneCar(map,carNo, callback, color,getPlay){
        var trackPlay = null;
        color = color || 2;
        map.plugin("beyond.maps.CarTrackPlay", function(){
            trackPlay = new beyond.maps.CarTrackPlay();
            trackPlay.setMap(map);
            if(trackPlay != null){
                trackPlay.oneTrack(carNo, color, callback);//开始跟踪车辆
            }
            if(getPlay) getPlay(trackPlay);
        });
       
        return trackPlay;
    }

   /**
     * 历史轨迹一辆车
     * @param carNO 跟踪的车牌号
     * @param map
     * @returns {beyond.maps.CarTrackPlay}
     */
    function tracePlay(map,carNo, start, end, callback, color){
        var trackPlay = null;
       color = color || 2;
        map.plugin("beyond.maps.CarTrackPlay", function(){
            trackPlay = new beyond.maps.CarTrackPlay();
            trackPlay.setMap(map);
            if(trackPlay != null){
                trackPlay.tracePlay(carNo, color, start, end, callback);//开始跟踪车辆
            }
        });

        return trackPlay;
    }


    /**
     *
     * 清除track中的所有跟踪
     * @param tarcks 数组类型
     * 元素类型为 beyond.maps.CarTrackPlay
     */
    function removeAllTrack(tarcks){

        if(tarcks != null){
            for(var i=0;i<tarcks.length;i++){
                tarcks[i].removeOneTrack();
            }
        }
    }


    /**
     * 向地图添加一个图标
     * @param car
     * @param map
     * @returns {beyond.maps.Marker}
     */
    function addMarker(car,map){

        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(car.x, car.y),//位置,102113
            icon: defaultImgSrc,//图标
            width: 15,//宽度
            height: 24,//高度
            editEnable: true,
            offsetX: 0,
            offsetY: 17,
            data: {"test": "选择点"}
        });
        marker.setDraggable(false);
        map.addOverlay(marker);
        map.setCenter(marker.getPosition());
        return marker;

    }

    function getCarColor(color) {
        if(color==1){
            return '#2882d9';
        }else if(color==2){
            return '#fd9c12';
        }
        return '#0cd87b';
    }

    /**
     * 打开一个车辆跟踪和轨迹的窗口
     */
    function openTrackWin(options) {
        options = options || {};
        var page = window.AppConfig.RemoteApiUrl + "tocc-toms/track-car/index.html";
        var param = "?";
        if (options.data) {
            for (var key in options.data) {
                param += key +"="+ options.data[key] + "&";
            }
        }
        options.page = options.page || page;

        var opts = {
            page: options.page + param,
            text: options.title
        }

        if (options.type == 'tabs' && parent.window.addFrameTabs) {
            parent.window.addFrameTabs(opts);
        } else {
            parent.window.open("../../"+options.page + param, "_blank");
        }
    }

    //行政区划面定位
    function regionArea(map,regionCode,callback){
        var region = new beyond.data.RegionService();
        var name = "";
        var pcode = "";
        var code = regionCode;
        region.regionArea(function(result){
            if (result.getReturnFlag() == 1) {
                var data = result.getData();
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var obj = data[i];
                        _addRegion(map,obj);
                    }
                } else {
                    alert(result.getReturnInfo());
                }
            } else {
                alert(result.getReturnInfo());
            }
        }, name, code, pcode);
    }

    function _addRegion(cmap,obj) {
        var polygon = null;
        if (obj.geometryStr) {
            var geometry = decodePoints(obj.geometryStr);
            polygon = new beyond.maps.BPolygon({
                points: geometry,//点对象数组
                strokeColor: "#F33", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                fillOpacity: 0.1,
                isZoomTo: true
                //填充透明度
            });
            if (cmap && cmap.addOverlay) {
                cmap.addOverlay(polygon);
            }

        }
    }
    function setFeatureLayerVisible(map, layername, visible,that, where, locateSymbol, isEdit) {
        if (!map || !layername) {
            return;
        }
        _that = that;
        _that._templateFn(tpl);
        var listFields = "";
        if (!locateSymbol) {
            locateSymbol = PoiConfig.poiConfigUtil.getLayerLocateSymbol(layername);
        }
        var featureLayer;
        if (beyond.maps.FeatureLayer) {
            featureLayer = map.getOverlays(layername + "_layercontrol");
        }
        if (featureLayer && featureLayer.length > 0) {
            if (visible) {
                featureLayer[0].show();
            } else {
                featureLayer[0].hide();
            }
        } else {
            var options = {
                "map": map,
                "isZoomTo":true,
                "id": layername,
                "layerName": layername,
                "locateSymbol": locateSymbol,
                "listFields": listFields,
                "where": where,
                "featureClick": function (marker) {
                    var data = marker.getData();
                    if (data && data["GID"]) {
                        var where = "GID=" + data["GID"];
                        queryDetail(map, layername, marker, where);
                    }
                }
            };
            map.plugin("beyond.maps.FeatureLayer", function () {
                featureLayer = new beyond.maps.FeatureLayer(options);
                map.addOverlay(featureLayer, layername + "_layercontrol");
            });
        }
    }

    /**
     * 根据参数查询地图详细
     * @param map 地图对象
     * @param layer 图层名称
     * @param marker marker对象
     * @param where 查询条件
     * @param callback 回调函数(用于注册事件)
     * @param data 节点展示数据
     */
    function queryDetail(map, layer, marker, where, callback, data, layerName) {
        poiDetail(map, layer, marker, where);
    }

    /*
     出租车使用(专题使用)
     */
    function clusterTaxi(industry,cmap,areaCode,type,callback) {
        if (markerClusterer) {
            cmap.removeOverlay(markerClusterer);
        }
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};
            //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
            options.industry = industry;
            options.scode = null;
            options.xcode = null;
            markerClusterer = new beyond.maps.BCarClusterMarker(options);
            markerClusterer.getSingleMarker = function (car) {

                //var list = car.plateNo.split("@");
                var vehNo = car.plateNo;
                var status = car.vehicleState;
                var runStatus = car.runStatus;
                var speed = car.gpsSpeed;
                car.NO = vehNo;
                var options2 = {};
                options2.offsetX = 0;
                options2.offsetY = 0;
                var text = new beyond.maps.BComplexText({
                    "text" : car.plateNo.split("@")[0],
                    "verticalAlign" : "middle",
                    "textAlign" : "center",
                    "width" : 70,
                    "height" : 16,
                    "offsetX" : -38,
                    "offsetY" : -12,
                    "fontSize" : 12,
                    "backgroundColor" : getCarColor(car.plateColor),
                    "fontColor" : "#ffffff"
                });

                options2.angle = car.direction;
                var icon;
                var tabStatus;
                switch (type){
                    case "status":tabStatus = 0;
                        break;
                    case "speed":tabStatus = 1;
                        break;
                    default :tabStatus = 2;
                }
                if (tabStatus == 0) {
                    if (status == 2) {
                        icon =  _basePath+"black-up.png";
                    }
                    if (status == 1) {
                        icon = _basePath+"green-up.png";
                    }
                    if (status == 0) {
                        icon =_basePath+"red-up.png";
                    }
                }
                if (tabStatus == 1) {
                    if (speed >= 0 && speed <= 19) {
                        icon = _basePath+"black-up.png";
                    }
                    if (speed >= 20 && speed <= 49) {
                        icon = _basePath+"blue-up.png";
                    }
                    if (speed >= 50 && speed <= 79) {
                        icon = _basePath+"green-up.png";
                    }
                    if (speed >= 80) {
                        icon = _basePath+"red-up.png";
                    }
                }
                if (tabStatus == 2) {
                    if (runStatus == 0) {
                        icon = _basePath+"red-up.png";
                    }
                    if (runStatus == 1) {
                        icon = _basePath+"green-up.png";
                    }
                    if (runStatus == 2) {
                        icon = _basePath+"blue-up.png";
                    }
                    if (runStatus == 3) {
                        icon = _basePath+"black-up.png";
                    }
                }

                //console.log(icon);
                options2.icon = icon||_basePath+"red-up.png";
                options2.editEnable = false;
                options2.btext = text;
                var pt = new beyond.geometry.MapPoint(car["X"], car["Y"]);
                options2.position = pt;
                options2.data={
                    plateNumber:car["plateNo"],
                    plateColor:car["plateColor"],
                    longitude:car["X"],
                    latitude:car["Y"],
                    angle:car["direction"]
                }
                var marker = new beyond.maps.Marker(options2);
                if(callback){
                    marker.addEventListener("click", function (m) {
                        var data=m.getData();
                        //window.plateNumber=data.plateNumber;
                        //window.color=data.color;
                        callback(data);
                    });
                }
                //if(window.plateNumber+window.color&&
                //    window.plateNumber+window.color==
                //    options2.data.plateNumber+
                //    options2.data.color&&callback){
                //    //callback(options2);
                //}
                marker.setDraggable(false);
                return marker;

            };

            cmap.addOverlay(markerClusterer);



            if (markerClusterer != null) {
                //markerClusterer.setScode(areaName);//设定行政区划
                markerClusterer.setIndustry(industry);//行业
            }


        });
    }

    function poiDetail(cmap,layer,m,where,ssfb){
        if(layer==""||PoiConfig.poiConfig[layer]==null){
            alert('该图层未配置')
        }
        var datail = "";
        for(var key in PoiConfig.poiConfig[layer].data){
            datail += key + ","
        }
        datail = datail.substr(0, datail.length - 1)
        if(layer==="SP_ZXCTKD"){
            datail=PoiConfig.poiConfig[layer].list;
        }
        var detailFields = datail;
        var locateSymbol = {
            /*	icon: "",//图标
             width: 20,//宽度
             height: 34,//高度*/
            offsetX: 0,
            offsetY: 0
        };
        var options = {
            "locateSymbol": locateSymbol,
            "detailFields": detailFields,
            "map": cmap,
            "layerName": layer
        };
        cmap.plugin("beyond.maps.FeatureQuery",function(){
            featureQuery = new beyond.maps.FeatureQuery(options);
            featureQuery.queryDetail(function (result) {
                if (result.getReturnFlag() == 1) {
                    var data = result.getData();
                    /*if(layer==="SP_ZXCTKD"){
                     var obj=new Object();
                     obj.id=data.list[0].ID;
                     var m = new beyond.maps.Marker({
                     position:new beyond.geometry.MapPoint(data.list[0].X, data.list[0].Y),//位置
                     /!*icon:"",//图标
                     width:20,//宽度
                     height:34,//高度
                     editEnable:true,*!/
                     offsetX:0,
                     offsetY:0
                     });
                     var where  = JSON.stringify(obj);
                     mapcomn.queryDetail(cmap,"SP_ZXCKJKH",m,where);
                     return;
                     }*/
                    var html = "";
                    var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                    if(layerConfig==null){
                        return;
                    }

                    var count = 0;
                    if (data == null || data.list.length == 0) {
                        //html += "<div class='row "+layer+"'><span class='title' style='display: inline-block;width: 75px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label + ":" + "</span><span style='margin-left: 10px;color:red' class='content'>"
                        //    + "暂无数据" + "</span></div>";
                        html += "<div class='row "+layer+"'><span class='title' style='display: inline-block;width: 75px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label + ":" + "</span><span style='margin-left: 10px;color:red' class='content'>"
                        + "暂无数据" + "</span></div>";

                    } else {
                        var obj = data.list[0];
                        if("1"==obj.JYZT){
                            obj.JYZT = "营业";
                        }else if("2"==obj.JYZT){
                            obj.JYZT = "停业";
                        }else if("3"==obj.JYZT){
                            obj.JYZT = "整改";
                        }else if("4"==obj.JYZT){
                            obj.JYZT = "停业整顿";
                        }else if("5"==obj.JYZT){
                            obj.JYZT = "歇业";
                        }else if("6"==obj.JYZT){
                            obj.JYZT = "注销";
                        }else if("9"==obj.JYZT){
                            obj.JYZT = "其他";
                        }
                        obj.layerName = layer;
                        var querydata = "";
                        var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                        var sortObj = layerConfig.sortObject;
                        var width = PoiConfig.poiConfigUtil.getShowLabelWidth(layer);
                        //如果要排序图层字段 就在poiconfig.js 里添加sortObject参数
                        if(sortObj || sortObj != undefined){
                            for(var i=0;i<sortObj.length;i++){
                                querydata = obj[sortObj[i]];

                                if(!layerConfig.data[sortObj[i]]||!layerConfig.data[sortObj[i]].label){
                                    continue;
                                }
                                count++;
                                if(querydata==null){
                                    html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[sortObj[i]].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                                }else{
                                    html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[sortObj[i]].label  + ":" + " </span><span style='margin-left: 10px;'>"
                                    + querydata + "</span></div>";
                                }
                            }
                        }else{
                            //marker 点击后执行的方法（展示点击marker的详情）
                            if(obj){

                                html = _that.staticCompanyInfoTemplate({data:obj});
                            }
                        }

                    }
                    html = '<div class="ofo">' + html;
                    html += '</div>';
                    //生成 弹框
                    var infoWindow = new beyond.maps.BInfoWindow({
                        isCustom:true,
                        content: html,
                        offsetY: 295,
                        offsetX: -167
                    });
                    //var infoWindow = new beyond.maps.BInfoWindow({
                    //    title:obj.MC,
                    //    content: html,
                    //    offsetY: 24,
                    //    offsetX: -1
                    //});
                    if(m == ""||m == null){
                        var point;
                        if(data.list[0].geometryStr&&data.list[0].geometryStr!=null){
                            point = beyond.maps.GeometryUtil.parseGeometry(data.list[0].geometryStr);
                        }else{
                            point = new beyond.geometry.MapPoint(data.list[0].X, data.list[0].Y);
                        }
                        m = new beyond.maps.Marker({
                            position:point,//位置
                            /*icon:"",//图标
                             width:20,//宽度
                             height:34,//高度
                             editEnable:true,*/
                            offsetX:0,
                            offsetY:0
                        });
                        /*cmap.addOverlay(m, );*/
                    }
                    var height = cmap.getExtent().getHeight();
                    var y = m.getPosition().y + height*0.2;
                    var x = m.getPosition().x;
                    cmap.setCenter(new beyond.geometry.MapPoint(x, y));
                    infoWindow.open(cmap, m.getPosition());

                    $('.close').on('click',function(){
                        cmap.clearInfoWindow();
                    });
                }
            }, where);
        });
    }

    return {
        initMap: initMap,
        locationStationLine: locationStationLine,
        editStationLine: editStationLine,
        rootPath: getRootPath(),
        config: options,
        vehicleCluster:vehicleCluster,
        trackOneCar:trackOneCar,
        clusterTaxi:clusterTaxi,
        tracePlay: tracePlay,
        removeAllTrack:removeAllTrack,
        addMarker:addMarker,
        openTrackWin: openTrackWin,
        region: regionArea,
        setFeatureLayerVisible: setFeatureLayerVisible,
        historyExpert:historyExpert

    }





});