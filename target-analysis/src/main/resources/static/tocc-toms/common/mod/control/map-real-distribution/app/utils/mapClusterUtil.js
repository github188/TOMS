define(function (require, exports, module) {
    require('bmap');
    var $ = require('jquery');

    var _basePath = "../resource/image/taxiCluster/";
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
    function cluster(industry, cmap,areaName,callback){
        if (markerClustererLkyw) {
            cmap.removeOverlay(markerClustererLkyw);
        }
        cmap.clear();
        cmap.plugin("beyond.maps.BCarClusterMarker", function () {
            var options = {};

            //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
            options.industry = industry;
            options.scode = null;
            options.xcode = null;
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
                    width: 18,//宽度
                    height: 17,//高度
                    angle: angle,
                    editEnable: true,
                    offsetX: 0,
                    offsetY: 0,
                    btext: text,
                    data:{
                        plateNumber:car["plateNo"],
                        color:car["plateColor"],
                        longitude:car["X"],
                        latitude:car["Y"],
                        industry:car["industry"]
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
                //markerClustererLkyw.setScode(areaName);//设定行政区划
                markerClustererLkyw.setIndustry(industry);//行业
            }
        });
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
        removeCluster:removeCluster
    };
});