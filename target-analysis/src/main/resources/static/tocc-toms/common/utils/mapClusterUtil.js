define(function (require, exports, module) {
    require('bmap');
    var $ = require('jquery');

    var _basePath = window.AppConfig.RemoteApiUrl+"/resource/image/cluster/";
    var markerClustererLkyw;

    /**
     * 清除聚合图层
     */
    function removeCluster(cmap){
        if (markerClustererLkyw) {
            cmap.removeOverlay(markerClustererLkyw);
            cmap.clear();
            markerClustererLkyw=null;
        }
    }

    /**
     * 车辆聚合调用
     industry:行业
     cmap:地图对象
     areaName:行政区划
     onLineTime:在线时长
     service:营运状态
     vehicleSpeed:车速
     */
    function cluster(industry, cmap,areaCode,callback){
        if (markerClustererLkyw) {
            cmap.removeOverlay(markerClustererLkyw);
        }
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};

            //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
            options.industry = industry;
            //设置 刷新时间  单位 s
            options.freshTime = 300;
            //当GPS数据量小于指定数量时不聚合
            options.minGpsSize = -1;
            //当前地图级别大于此指定的级别时不聚合
            options.maxLevel = 1;
            //取消地图缩放
            options.isZoomTo = false;
            options.scode = null;
            options.xcode = null;
            //像素网格
            options.pixelsInGrid = 50;
            markerClustererLkyw = new beyond.maps.BCarClusterMarker(options);
            markerClustererLkyw.getSingleMarker = function (car) {
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
                    "backgroundColor": getCarColor(car["plateColor"]),
                    "fontColor": "#ffffff"
                });
                var angle = car["direction"];
                var vehicleIcon=car["industry"];
                if(!vehicleIcon){
                    return;
                }
                vehicleIcon=_basePath+vehicleIcon+".png";
                var marker = new beyond.maps.Marker({
                    position: new beyond.geometry.MapPoint(car["X"], car["Y"]),//位置
                    icon:vehicleIcon,//图标
                    //width: 18,//宽度
                    //height: 17,//高度
                    angle: angle,
                    editEnable: true,
                    offsetX: 0,
                    offsetY: 0,
                    //btext: text,
                    data:{
                        plateNumber:car["plateNo"],
                        plateColor:car["plateColor"],
                        speed:car["gpsSpeed"],
                        longitude:car["X"],
                        latitude:car["Y"],
                        industyType:car["industry"],
                        angle:car["direction"],
                        gpsTime:car["posTime"]
                    }
                });
                if(callback){
                    marker.addEventListener("click", function (m) {
                        callback(m.getData());
                    });
                }

                marker.setDraggable(false);
                return marker;
            };

            cmap.addOverlay(markerClustererLkyw);
            if (markerClustererLkyw != null) {
                areaCode = setAreaCode(areaCode);
                if(areaCode.length == 2){
                    markerClustererLkyw.setPcode(areaCode+'0000');//设定行政区划
                }else if(areaCode.length == 4){
                    markerClustererLkyw.setScode(areaCode+'00');//设定行政区划
                }else{
                    markerClustererLkyw.setXcode(areaCode);//设定行政区划
                }
                markerClustererLkyw.setIndustry(industry);//行业
            }
        });
    }

    /*
     出租车使用(专题使用)
     */
    function clusterTaxi(industry,cmap,areaCode,callback) {
        if (markerClustererLkyw) {
            cmap.removeOverlay(markerClustererLkyw);
        }
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};
            //参数为行业类型  090
            options.industry = industry;
            //当GPS数据量小于指定数量时不聚合
            options.minGpsSize = -1;
            //当前地图级别大于此指定的级别时不聚合
            options.maxLevel = 1;
            //设置 刷新时间  单位 s
            options.freshTime = 300;
            //地图缩放
            options.isZoomTo = true;
            options.scode = null;
            options.xcode = null;
            markerClustererLkyw = new beyond.maps.BCarClusterMarker(options);
            markerClustererLkyw.getSingleMarker = function (car) {

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
                // 根据 vehicleState 判断 车辆的运行状态 （0:空车（红色）;1:重车（蓝色）;2:掉线（灰色））
                if (status == 2) {
                    icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficTaxi/res/img/taxi_gray.png";
                }
                if (status == 1) {
                    icon = window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficTaxi/res/img/taxi_red.png";
                }
                if (status == 0) {
                    icon =window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficTaxi/res/img/taxi_green.png";
                }

                options2.icon = icon || window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficTaxi/res/img/taxi_gray.png";
                options2.editEnable = false;
                //options2.btext = text;
                var pt = new beyond.geometry.MapPoint(car["X"], car["Y"]);
                options2.position = pt;
                options2.data={
                    plateNumber:car["plateNo"],
                    plateColor:car["plateColor"],
                    vehicleState:car["vehicleState"],
                    gpsSpeed:car["gpsSpeed"],
                    longitude:car["X"],
                    latitude:car["Y"],
                    gpsTime:car["posTime"],
                    angle:car["direction"]
                }
                var marker = new beyond.maps.Marker(options2);
                if(callback){
                    marker.addEventListener("click", function (m) {
                        var data=m.getData();
                        callback(data);
                    });
                }
                marker.setDraggable(false);
                return marker;

            };

            cmap.addOverlay(markerClustererLkyw);

            if (markerClustererLkyw != null) {
                areaCode = setAreaCode(areaCode);
                if(areaCode.length == 2){
                    markerClustererLkyw.setPcode(areaCode+'0000');//设定行政区划
                }else if(areaCode.length == 4){
                    markerClustererLkyw.setScode(areaCode+'00');//设定行政区划
                }else{
                    markerClustererLkyw.setXcode(areaCode);//设定行政区划
                }
                markerClustererLkyw.setIndustry(industry);//行业
            }
        });
    }

    // 设置覆盖率  （热力图）
    function addTopicLayer(cmap,layerName){
        cmap.plugin("beyond.maps.BHeatMapLayer", function () {
            var heatMapLayer = new beyond.maps.BFeatureHeatMapLayer({
                "layerName": layerName.substring(0,layerName.indexOf('+')),
                "defaultValue":1,
                "radius":layerName.substring(layerName.indexOf('+')+1),
                "unit":Units.METERS,
                "isZoomTo": true
            });
            heatMapLayer.setMinLevel(0);
            heatMapLayer.setMaxLevel(19);
            cmap.addOverlay(heatMapLayer,layerName);
        });
    }

    function setAreaCode(areaCode){
        areaCode = areaCode+'';
        if(areaCode){
            if('0000' == areaCode.substring(2,6)){
                areaCode = areaCode.substring(0,2);
            }else if('00' == areaCode.substring(4,6)){
                areaCode = areaCode.substring(0,4);
            }else{
                areaCode = areaCode;
            }
        }else{
            areaCode = '';
        }
        return areaCode;
    }

    function returnMakerClustererLkyw(){
        return markerClustererLkyw
    }

    function getCarColor(color) {
        if(color==1){
            return '#2882d9';
        }else if(color==2){
            return '#fd9c12';
        }
        return '#0cd87b';
    }
    return {
        cluster:cluster,
        clusterTaxi:clusterTaxi,
        removeCluster:removeCluster,
        addTopicLayer:addTopicLayer,
        returnMakerClustererLkyw:returnMakerClustererLkyw
    };
});