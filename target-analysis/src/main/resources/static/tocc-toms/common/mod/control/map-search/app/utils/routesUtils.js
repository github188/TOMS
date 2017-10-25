define(['tocc-toms/common/mod/control/map-search/app/utils/searchUtils',
    'tocc-toms/common/mod/control/map-search/app/utils/mapSearchUtils',
    'tocc-toms/common/mod/control/map-search/app/utils/commonUtils',
    'text!tocc-toms/common/mod/control/map-search/template/mapRoutesTemplate.html',
    'text!tocc-toms/common/mod/control/map-search/template/mapCarTemplate.html',
    'text!tocc-toms/common/mod/control/map-search/template/mapStationTemplate.html'
],function(SearchUtil,MapSearchUtils,CommonUtils,MapRoutesTemplate,MapCarTemplate,MapStationTemplate) {

    var that=this;
    var searchResultBusRoutes={};
    var map=parent.window.map;
    var ctx=window.AppConfig.RemoteApiUrl;
    var searchkey;
    var carLayerName="";
    searchResultBusRoutes.carInfowindowFlag=false;
    searchResultBusRoutes.layername="";
    searchResultBusRoutes.parame={};
    searchResultBusRoutes.pageSize=10;


    CommonUtils._templateFn(MapRoutesTemplate,that);
    CommonUtils._templateFn(MapCarTemplate,that);
    CommonUtils._templateFn(MapStationTemplate,that);


    //公交路线列表时间注册
    function routesListEvent(){
        //途径站点内容折叠与展开
        $(".items-station-title").on('click', '.title-icon', function(event) {
            var haspanel = $(this).parents(".result-items-has"),
                status = haspanel.attr("active");
            if(status == "0"){
                haspanel.addClass('items-unfold');
                haspanel.attr('active', '1');
            }else{
                haspanel.removeClass('items-unfold');
                haspanel.attr('active', '0');
                map.clearInfoWindow();
                map.removeOverlay(searchResultBusRoutes.layername);
            }
        });

        //线上车辆内容折叠与展开
        $(".items-online-title>.title-icon").on("click",function(e){
            var haspanel = $(this).parents(".result-items-has"),
                status = haspanel.attr("active");
            $(this).parent().next().html("");
            var andDown=$(this).attr("andDown");
            var busRoutesCode=$(this).attr("routesCode");
            if(status == "0"){
                var parame={
                    "busRoutesCode": busRoutesCode,
                    "andDown": andDown,
                    "pageSize":100,
                    "node":$(this).parent().next()
                };
                viewLineCar(parame);
                haspanel.addClass('items-unfold');
                haspanel.attr('active', '1');
            }else{
                map.clearInfoWindow();
                map.removeOverlay(searchResultBusRoutes.layername+"_"+busRoutesCode+"_"+andDown+"_car");
                haspanel.removeClass('items-unfold');
                haspanel.attr('active', '0');
            }
        });
        /**公交路线选择*/
        $(".result-items-card").on("click",function(){
            map.removeOverlay(searchResultBusRoutes.layername);
            map.clearInfoWindow();
            var title=$(this).find(".items-card-title");
            var bc=title.css("background-color");
            var routesCode=$(this).attr("routesCode");
            var andDown=$(this).next().attr("andDown");
            if(!bc||bc==="#C0C0C0"||bc==="rgb(192, 192, 192)"){
                var line=$(this).attr("line");
                if(!line){
                    alert("此公交路线暂无路线数据！");
                }
                var array=new Array();

                $(this).next().find(".items-station-list").each(function(){
                    var point=new Object();
                    var p=$(this).attr("point").split(" ");
                    var code=$(this).attr("code");
                    point.x=p[0];
                    point.y=p[1];
                    point.code=code;
                    array.push(point);
                });
                var layer1=map.getOverlays(searchResultBusRoutes.layername+"_"+routesCode+"_"+andDown+"_line");
                if(layer1&&layer1.length>0){
                    return;
                }
                var obj=MapSearchUtils.getLineRGB();
                var parame={
                    line:line,
                    pointArray:array,
                    andDown:andDown,
                    routesCode:routesCode,
                    rgb:obj.rgb,
                    png:obj.png
                }
                routes(parame);
                MapSearchUtils.queryDetail(map,"SL_GJLX",null,null,parame,searchResultBusRoutes.layername);
                title.css("background-color",obj.rgb);
            }else{
                var haspanel = $(this).parent().parent().find(".items-online-title>.title-icon").parents(".result-items-has");
                haspanel.removeClass('items-unfold');
                haspanel.attr('active', '0');
                title.css("background-color","#C0C0C0");
                map.removeOverlayByRegexp("^"+searchResultBusRoutes.layername+"_"+routesCode+"_"+andDown);
            }
        });

        /**途经站点点击事件*/
        $(".result-bus-station-item-site-list>.items-station-list").on("click",function(){
            var where="stationCode="+$(this).attr("code")+"&andDown="+$(this).parent().parent().attr("anddown");
            MapSearchUtils.queryDetail(map,"SP_GJZD",null,where,searchResultBusRoutes.popupClick,null,searchResultBusRoutes.layername);
        });

    }
    //查看线上车辆
    function viewLineCar(parame){
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRoutesVehicles(function (result) {
                if(result.getData().list&&result.getData().list.length>0){
                    var array=result.getData().list;
                    var target=parame.node;
                    var number=1;
                    for(var i=0;i<array.length;i++){
                        if(!array[i].licensePlateNumber){
                            continue;
                        }
                        var node=that.mapLineCarItemTemplate()
                            .replace("{{number}}",number)
                            .replace("{{name}}",array[i].licensePlateNumber)
                            .replace("{{mc}}",array[i].mc)
                            .replace("{{speed}}",array[i].speed)
                            .replace("{{point}}",array[i].x+" "+array[i].y);
                        number+=1;
                        target.append(node);
                        var data={};
                        data.name=array[i].licensePlateNumber;
                        data.x=array[i].x;
                        data.y=array[i].y;
                        data.angel=array[i].angel;
                        data.speed=array[i].speed;
                        data.mc=array[i].mc;
                        data.busRoutesCode=parame.busRoutesCode;
                        data.andDown=parame.andDown;
                        data.layer=searchResultBusRoutes.layername||"SL_GJLX";
                        addTextMark(data);
                    }
                    /**线上车辆打开车辆提示信息*/
                    $(".items-online-list>.online-lic").on("click",function(){
                        var data=new Array();
                        var point=$(this).attr("point").split(" ");
                        data.name=$(this).html();
                        data.mc=$(this).attr("mc");
                        data.speed=$(this).attr("speed");
                        data.x=point[0];
                        data.y=point[1];
                        openCarInfowindow(data);
                    });
                }else{
                    alert("此公交路线暂无车辆信息！");
                }
            },parame);
        });
    }

    /**Popup提示框点击事件*/
    function popupClick(target){
        map.removeOverlay(searchkey);
        map.clearInfoWindow();
        var parame = {
            routesName: target.html(),
            andDown: 0
        };
        var obj = MapSearchUtils.getLineRGB();
        var title = target.find(".items-card-title");
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                if (result.getData().list && result.getData().list.length > 0) {
                    var item = result.getData().list[0];
                    var parame = {
                        line: item.geometryStr,
                        pointArray: item.busStations,
                        andDown: 0,
                        routesCode: item.routesCode,
                        rgb: obj.rgb
                    }
                    searchResultBusRoutes.routes(parame);
                    title.css("background-color", obj.rgb);
                }
            }, parame);
        });
    }

    /**查询公交路线主函数mian*/
    function listBusRotesAndStation(){
        var routesName=SearchUtil.request("key");
        searchResultBusRoutes.layername=SearchUtil.request("layerName");
        if(routesName){
            searchResultBusRoutes.parame.routesName=routesName;
        }
        var show=SearchUtil.request("show");
        if(show){
            searchResultBusRoutes.parame.show=show;
        }
        var rgb=SearchUtil.request("rgb");
        if(rgb){
            searchResultBusRoutes.parame.rgb=rgb;
        }
        if(routesName){
            searchResultBusRoutes.parame.rname=decodeURIComponent(decodeURIComponent(routesName));
        }
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                viewList(result,searchResultBusRoutes.parame);
            },searchResultBusRoutes.parame);
        });
    }

    /**分页查询*/
    function page(data){
        map.clearInfoWindow();
        map.removeOverlay(searchResultBusRoutes.layername);
        searchResultBusRoutes.parame.pageSize=data.pageSize;
        searchResultBusRoutes.parame.pageNum=data.nowPage;
        listBusRotesAndStation(that);
    }

    //展示列表数据
    function viewList(result,parame){
        var data=result.getData().list||result.list;
        if(data&&data.length>0){
            $("#pageInfo").wyPaginator({
                pageSize: result.getData().pageSize,
                nowPage: result.getData().pageNo,
                recordTotal: result.getData().totalCount
            });
            $(".ui-scroll-container").html("");
            var height=10;
            var count=0;
            var style="";
            for(var i=0;i<data.length;i++){
                if(i===0){
                    height=data.length*150;
                }
                var onlineList="";
                var item=data[i];
                var byway="";
                var array=item.busStations;
                for(var j=0;array&&j<array.length;j++){
                    byway+=that.mapRoutesWayStationLiTemplate()
                        .replace("{{item}}",j+1+"."+array[j].stationName)
                        .replace("{{point}}",array[j].x+" "+array[j].y)
                        .replace("{{code}}",!array[j].stationCode?array[j].routesCode:array[j].stationCode);
                }
                if(parame&&parame.show==="0"&&parame.rname===data[i].routesName&&count===0){
                    count++;
                    style="style='background-color:"+parame.rgb+";'";
                }else{
                    style="";
                }
                var node=that.mapRoutesItemTemplate()
                    .replace("{{style}}",style)
                    .replace("{{line}}",item.geometryStr)
                    .replace("{{routesCode}}",item.routesCode)
                    .replace("{{routesName}}",item.routesName)
                    .replace("{{stationBeginTime}}",item.andDown ===0?item.upDepartureTime:item.downDepartureTime)
                    .replace("{{stationEndTime}}",item.andDown ===0?item.upCollectTime:item.downCollectTime)
                    .replace("{{startStation}}",item.startStation?item.startStation:'暂无')
                    .replace("{{endStation}}",item.endStation?item.endStation:'暂无')
                    .replace("{{qcpj}}",item.qcpj?item.qcpj+'元':'暂无')
                    .replace("{{jcpj}}",item.jcpj?item.jcpj+'元':'暂无')
                    .replace("{{stationList}}",that.mapRoutesWayStationTemplate().replace("{{andDown}}",item.andDown))
                    .replace("{{stationList}}",byway)
                    .replace("{{onlineList}}",that.mapLineCarTemplate().replace("{{andDown}}",item.andDown).replace("{{routesCode}}",item.routesCode));
                if(height<320){
                    height=400;
                }
                $(".ui-scroll-container").append(node);
            }
            routesListEvent();
        }
    }

    /*添加出租车图标*/
    function addTextMark(data){
        if (!data) {
            return;
        }
        var html = '<div class="chepai">' + data.name + '</div>';

        var text = new parent.beyond.maps.BComplexText({
            "text": data.name,
            "verticalAlign": "middle",
            "textAlign": "center",
            "width": 70,
            "height": 16,
            "offsetX": -34,
            "offsetY": -14,
            "fontSize": 12,
            "backgroundColor": "#CDD28C",
            "fontColor": "#ffffff"
        });
        var angle = data.angle;
        var marker = new parent.beyond.maps.Marker({
            position: new parent.beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: ctx + "/control/map-search/resource/images/bus.png",//图标
            angle: angle,
            offsetX: 0,
            offsetY: 0,
            btext: text,
            data: data
        });
        marker.addEventListener("click", function (m) {
            var data = m.getData();
            var html = '<div class="detailInfo">';
            html += "<div class='row'><span class='' style='display: inline-block;width: 60px;font-weight:bold;text-align: right'>";
            html += "车牌号：" + " </span><span style='margin-left: 10px;'>";
            html += data.name;
            html += "</span></div>";

            html += "<div class='row'><span class='' style='display: inline-block;width: 60px;font-weight:bold;text-align: right'>";
            html += "公交路线：" + " </span><span style='margin-left: 10px;'>";
            html += data.mc;
            html += "</span></div>";

            html += "<div class='row'><span class='' style='display: inline-block;width: 60px;font-weight:bold;text-align: right'>";
            html += "速度：" + " </span><span style='margin-left: 10px;'>";
            html += data.speed + "公里/小时";
            html += "</span></div>";
            /* if (data["posTime"] != null && data["posTime"].date != null) {
             html += "<div class='row'><span class='' style='display: inline-block;width: 60px;font-weight:bold;text-align: right'>";
             html += "时间：" + " </span><span style='margin-left: 10px;'>";
             html += parent.getFormatDate(data["posTime"]);
             html += "</span></div>";
             }*/

            html += "</div>";

            var infoWindow = new parent.beyond.maps.BInfoWindow({
                title: data.name,
                content: html,
                offsetY: 0,
                offsetX: 0
            });
            infoWindow.open(map, new parent.beyond.geometry.MapPoint(data.x, data.y));
        });
        var lname = searchkey||data.layer + "_" + data.busRoutesCode + "_" + data.andDown + "_car";
        map.addOverlay(marker, lname);
        map.setCenter(marker.getPosition());
    }
    /*打开车辆信息*/
    function openCarInfoWindow(data){
        var html = '<div class="detailInfo" style="width:150px">';
        html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
        html += "车牌号：" + " </span><span style='margin-left: 10px;'>";
        html += data.name;
        html += "</span></div>";

        html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
        html += "公交路线：" + " </span><span style='margin-left: 10px;'>";
        html += data.mc;
        html += "</span></div>";

        html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
        html += "速度：" + " </span><span style='margin-left: 10px;'>";
        html += data.speed + "公里/小时";
        html += "</span></div>";
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title: data.name,
            content: html,
            offsetY: 0,
            offsetX: 0
        });
        map.setCenter(new parent.beyond.geometry.MapPoint(data.x, data.y));
        infoWindow.open(map, new parent.beyond.geometry.MapPoint(data.x, data.y));
    }

    function routes(parame){
        map.clearInfoWindow();
        map.removeOverlay(searchkey);
        var geometryStr = parame.line;
        if (geometryStr === 'null') {
            alert("此公交路线暂无路线数据！");
        }
        var polylineArray = new Array();
        var polyline = null;
        var arr = geometryStr.split(" ");
        var a;
        for (var i = 0; i < arr.length; i++) {
            a = arr[i].split(",");
            polylineArray.push(new parent.beyond.geometry.MapPoint(a[0], a[1]));
        }
        polyline = new parent.beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: parame.rgb, //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: false   //居中放大
        });
        map.addOverlay(polyline, searchkey + "_" + parame.routesCode + "_" + parame.andDown + "_line");
        if (parame.pointArray && parame.pointArray.length > 0) {
            for (var j = 0; j < parame.pointArray.length; j++) {
                var item = parame.pointArray[j];
                var data = {
                    stationCode: item.stationCode,
                    andDown: parame.andDown
                };
                var marker = new parent.beyond.maps.Marker({
                    position: new parent.beyond.geometry.MapPoint(parame.pointArray[j].x, parame.pointArray[j].y),//位置
                    icon: ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    data: data
                });
                map.addOverlay(marker, searchkey);
                /**新增点击事件*/
                marker.addEventListener("click", function (marker) {
                    searchResultBusRoutes.listPopup(marker.getData());
                });
            }
            //居中显示
            map.setCenter(new parent.beyond.geometry.MapPoint(parame.pointArray[0].x, parame.pointArray[0].y));
        }
        polyline.addEventListener("click", function (obj, event) {
            alert("点击");
        });
    }

    return {
        onlineNode:viewLineCar,
        listBusRotesAndStation:listBusRotesAndStation,
        page:page,
        fillNode:viewList,
        event:routesListEvent
    };
});