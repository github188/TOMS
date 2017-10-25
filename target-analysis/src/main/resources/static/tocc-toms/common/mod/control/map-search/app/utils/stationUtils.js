define(['tocc-toms/common/mod/control/map-search/app/utils/searchUtils',
    'tocc-toms/common/mod/control/map-search/app/utils/mapSearchUtils',
    'tocc-toms/common/mod/css!control/map-search/resource/css/mapSearch.css'
],function(SearchUtil,MapSearchUtils) {
    var searchResultStation={};
    var ctx=window.AppConfig.RemoteApiUrl;
    var map=parent.window.map;
    /**声明参数*/
    searchResultStation.parame={
        "pageSize":10,
        "pageNum":1
    };
    /**注册点击事件*/
    searchResultStation.event=function(){
        $(".buses-items-tag").on("click",function(e){
            var routesName= $.trim($(this).html());
            if(routesName.indexOf("...")>=0){
                routesName=$.trim($(this).attr("startStation"));
            }
            var andDown=$.trim($(this).parent().attr("fx"));
            var parame={
                "routesName": routesName,
                "andDown":andDown
            };
            searchResultStation.listBusRotesAndStation(parame,$(this));
        });
        $(".buses-title-text").on("click",function(){
            var point=$(this).parent().parent().attr("point");
            var name=$.trim($(this).html());
            /* var andDown=$.trim($(this).next().html())==="上行"?0:1;
             var where="stationCode="+$(this).attr("code")+"&andDown="+andDown;
             parent.mapcomn.queryDetail(parent.app.cmap,"SP_GJZD",null,where,searchResultBusRoutes.popupClick,null,searchResultBusRoutes.layername);*/
            var array=new Array();
            $(this).parent().next().find(".buses-items-tag").each(function(){
                array.push($(this).html());
            });
            var data={
                point:point,
                stationName:name,
                site:array
            };
            searchResultStation.addPopup(data);
            data.routesName=data.stationName;
            var p=point.split(" ");
            var node={
                x:p[0],
                y:p[1],
                stationName:name,
                site:array
            };
            searchResultStation.addMark(node);
        });
    };

    /**根据路线名称及上下行获取数据*/
    searchResultStation.listBusRotesAndStation=function(parame,target,flag){
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                if(!flag){
                    searchResultStation.addNode(result,target);
                }
                var data=result.getData().list[0];
                //var obj=parent.mapcomn.getLineRGB();
                var parame={
                    line:data.geometryStr,
                    pointArray:data.busStations,
                    andDown:data.andDown,
                    routesCode:data.routesCode,
                    routesName:data.routesName
                }
                //searchResultBusRoutes.routes(parame);
                var layerName=encodeURIComponent(encodeURIComponent(data.routesName));
                MapSearchUtils.queryDetail(map,"SL_GJLX",null,null,parame,layerName);

                //searchResultStation.addRoutes(result,target);
            },parame);
        });
    };

    /**点击途经车次添加节点*/
    searchResultStation.addNode=function(result,target){
        var data=result.getData().list[0];
        var node=$("#result-bus-station-details-template").html()
            .replace("{{startStation}}",data.startStation)
            .replace("{{endStation}}",data.endStation)
            .replace("{{startTime}}",data.andDown ===0?data.upDepartureTime:data.downDepartureTime)
            .replace("{{endTime}}",data.andDown ===0?data.upCollectTime:data.downCollectTime)
            .replace("{{qcpj}}",data.qcpj?data.qcpj+'元':'暂无')
            .replace("{{jcpj}}",data.jcpj?data.jcpj+'元':'暂无');
        var _target=target.parent().parent().find(".tag-details");
        if(!_target.html()){
            var height=$(".ui-scroll-container").height();
            height+=79;
            /*$(".ui-scroll-container").css("height",height+"px");*/
        }
        if(_target.html()){
            _target.remove();
        }
        target.parent().parent().append(node);
        $(".tag-details-close").on("click",function(){
            searchResultStation.deleteNode($(this));
        });
    };

    /**点击途经车次显示的详细关闭按钮修改iframe高度*/
    searchResultStation.deleteNode=function(target){
        target.parent().remove()
        var height=$(".ui-scroll-container").height();
        height-=79;
        /*$(".ui-scroll-container").css("height",height+"px");*/
    };

    /**查询数据*/
    searchResultStation.listBusRotesByStation=function(){
        var stationName=SearchUtil.request("key");
        searchResultStation.layername=SearchUtil.request("layerName");
        if(stationName){
            searchResultStation.parame.stationName=stationName;
        }
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function(result){
                searchResultStation.fillNode(result);
            },searchResultStation.parame);
        });
    };


    var stationTemplate=' <div class="buses-items-tag" startStation="{{startStation}}">{{routes}}</div>';


    var stationNodeTemplate='<div class="buses-items" fx="{{fx}}">'+
        '<label class="buses-items-label">途径公交路线：</label>'+
    '{{byway}}'+
    '</div>';

    var stationParentTemplate='<div class="result-buses" point="{{point}}">'+
        '{{title}}'+
    '{{byway}}'+
    '</div>';


    /**填充模版内容*/
    searchResultStation.fillNode=function(result){
        if(result.getReturnFlag()=== '1'){
            var data=result.getData();
            $("#pageInfo").wyPaginator({
                pageSize: data.pageSize,
                nowPage: data.pageNo,
                recordTotal: data.totalCount
            });
            $(".ui-scroll-container").html("");
            var height=10;
            for (i=0;i<data.list.length;i++){
                if(i===0){
                    height=data.list.length*94;
                }
                var node=data.list[i];
                var title='<div class="buses-title">'+
                '<span>{{NO}}.</span>'+
                    '<span class="buses-title-text">{{stationName}}</span>'+
                '<span class="buses-title-char">{{upDown}}</span>'+
                '</div>';
                 title=title
                    .replace("{{NO}}",i+1)
                    .replace("{{stationName}}",node.routesName)
                    .replace("{{upDown}}",node.andDown===0?"上行":"下行");
                var byway='';
                if(node.stationName){
                    var array=node.stationName.split(",");
                    if(array&&array.length>0){
                        if(array.length>4){
                            var nl=array.length-4;
                            var bei=((nl-(nl%5))/5)+1;
                            height+=bei*35;
                        }
                        for(var j=0;j<array.length;j++){
                            if(array[j].length>4){
                                var item=array[j].substring(0,2)+"...";
                                byway+=$("#result-bus-station-byway-template").html()
                                    .replace("{{routes}}",item)
                                    .replace("{{startStation}}",array[j]);
                            }else{
                                byway+=stationTemplate
                                    .replace("{{routes}}",array[j]);
                            }
                        }
                    }
                    byway=stationNodeTemplate
                        .replace("{{byway}}",byway)
                        .replace("{{fx}}",node.andDown);
                }
                var buses=stationParentTemplate
                    .replace("{{title}}",title)
                    .replace("{{byway}}",byway)
                    .replace("{{point}}",node.x+" "+node.y);
                /*  $(".ui-scroll-container").css("height",height+"px");*/
                $(".ui-scroll-container").append(buses);
                node.stationName=node.routesName;
                searchResultStation.addMark(node);
            }
            /**定位第一个图标并显示提示信息框*/
            if(data.list&&data.list.length>0){
                var item=data.list[0];
                var items=item.stationName.split(",");
                var data={
                    point:item.x+" "+item.y,
                    stationName:item.routesName,
                    site:items
                };
                /*searchResultStation.addPopup(data);*/
            }
            searchResultStation.event();
        }
    };
    /**新增mark图标*/
    searchResultStation.addMark=function(data){
        var parame={
            point:data.x+" "+data.y,
            stationName:data.routesName||data.stationName,
            site:data.stationName.split(",")
        };
        var marker = new parent.beyond.maps.Marker({
            position:new parent.beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: ctx+ "/control/map-search/resource/images/GJZ_1.png",//图标
            offsetX:0,
            offsetY:0,
            data:parame
        });
        marker.setDraggable(false);
        map.addOverlay(marker, searchResultStation.layername);
        /**新增点击事件*/
        marker.addEventListener("click", function (marker) {
            searchResultStation.addPopup(marker.getData());
        });
    };
    /**指定数据信息图片提示框*/
    searchResultStation.addPopup=function(data){
        var point=data.point.split(" ");
        var stationName=data.stationName;
        var array=data.site;
        var items="";
        if(array){
            for(var i=0;i<array.length;i++){
                if(array[i].length>4&&array[i].length<25){
                    var px=array[i].length;
                    var bei=((px-(px%4))/4)+1;
                    var np=bei*50;
                    var style="style='width:"+np+"px;'";
                    items+="<div class='inf-con-tag'"+style+">"+array[i]+"</div>";
                }else if(array[i].length>25){
                    var item=array[i].substring(0,20)+"...";
                    var style="style='width:280px;'";
                    items+="<div class='inf-con-tag'"+style+">"+item+"</div>";
                }else{
                    items+=$("#result-bus-station-infowindow-content-item").html()
                        .replace("{{stationName}}",array[i]);
                }
            }
        }
        var content=$("#result-bus-station-infowindow-content").html()
            .replace("{{content}}",items);
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title:stationName+"公交站",
            content: content,
            offsetY: 0,
            offsetX: 0
        });
        var height = map.getExtent().getHeight();
        var y = parseFloat(point[1]) + height*0.2;
        var x = parseFloat(point[0]);
        map.setCenter(new parent.beyond.geometry.MapPoint(x, y));
        infoWindow.open(map, new parent.beyond.geometry.MapPoint(parseFloat(point[0]), parseFloat(point[1])));
        parent.$(".beyond-info").find(".inf-con-tag").on("click",function(){
            var parame={
                "routesName": $.trim($(this).html()),
                "andDown":0
            };
            searchResultStation.listBusRotesAndStation(parame,$(this),1);
            /* searchResultStation.popupClick($(this));*/
        });
    };
    /**Popup提示框点击事件*/
    searchResultStation.popupClick=function(target){
        /*  parent.app.cmap.removeOverlay(searchResultStation.layername);
         parent.app.cmap.clearInfoWindow();*/
        var parame={
            routesName:target.html(),
            andDown:0
        };
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                searchResultStation.addRoutes(result);
            },parame);
        });
    }
    /**新增线路mark*/
    searchResultStation.addRoutesMark=function(data,andDown){
        for(var i=0;i<data.length;i++){
            var parame={
                stationCode:data[i].stationCode,
                andDown:andDown
            };
            var marker = new parent.beyond.maps.Marker({
                position:new parent.beyond.geometry.MapPoint(data[i].x, data[i].y),//位置
                icon: ctx+ "/control/map-search/resource/images/GJZ_1.png",//图标
                offsetX:0,
                offsetY:0,
                data:parame
            });
            marker.setDraggable(false);
            map.addOverlay(marker,searchResultStation.layername);
            marker.addEventListener("click", function (marker) {
                searchResultStation.listPopup2(marker.getData());
            });
        }
    };
    /**根据站点名称及上下行查询数据*/
    searchResultStation.listPopup2=function(data){
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function(result){
                if(result.getReturnFlag()==='1'){
                    var rdata=result.getData().list[0];
                    var array=rdata.stationName.split(",");
                    var data={
                        point:rdata.x+" "+rdata.y,
                        stationName:rdata.routesName,
                        site:array
                    };
                    searchResultStation.addPopup(data);
                }
            },data);
        });
    };
    /**分页切换*/
    searchResultStation.page=function(data){
        map.clearInfoWindow();
        map.removeOverlay(searchResultStation.layername);
        searchResultStation.parame.pageSize=data.pageSize;
        searchResultStation.parame.pageNum=data.nowPage;
        searchResultStation.listBusRotesByStation();
    };
    /**添加公交路线*/
    searchResultStation.addRoutes=function(result,target){
        var geometryStr=result.getData().list[0].geometryStr;
        var andDown=result.getData().list[0].andDown;
        var polylineArray = new Array();
        var polyline=null;
        var arr = geometryStr.split(" ");
        var a;
        for (var i = 0; i < arr.length; i++) {
            a = arr[i].split(",");
            polylineArray.push(new parent.beyond.geometry.MapPoint(a[0], a[1]));
        }
        polyline = new parent.beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: "#4169E1", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: false   //居中放大
        });
        map.addOverlay(polyline,searchResultStation.layername);
        searchResultStation.addRoutesMark(result.getData().list[0].busStations,andDown);
        map.setExtent(polyline.getExtent());
        polyline.addEventListener("click", function (obj, event) {
            alert("点击");
        });
    };
    /**根据数据展示站点详细*/
    searchResultStation.showInfo=function(data){
        var point=data.point.split(" ");
        var stationName=data.stationName;
        var array=data.site;
        var items="";
        if(array){
            for(var i=0;i<array.length;i++){
                items+=$("#result-bus-station-infowindow-content-item").html()
                    .replace("{{stationName}}",array[i]);
            }
        }
        var content=$("#result-bus-station-infowindow-content").html()
            .replace("{{content}}",items);
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title:stationName+"公交站",
            content: content,
            offsetY: 0,
            offsetX: 0
        });
        var marker = new parent.beyond.maps.Marker({
            position:new parent.beyond.geometry.MapPoint(parseFloat(point[0]), parseFloat(point[1])),//位置
            icon: ctx+ "/control/map-search/resource/images/GJZ_1.png",//图标
            offsetX:0,
            offsetY:0
        });
        map.addOverlay(marker, "fullScreen");
        var height = map.getExtent().getHeight();
        var y = marker.getPosition().y + height*0.2;
        var x = marker.getPosition().x;
        map.setCenter(new parent.beyond.geometry.MapPoint(x, y));
        infoWindow.open(map, marker.getPosition());
    };




    return {
        event:searchResultStation.event,
        addPopup:searchResultStation.addPopup,
        popupClick:searchResultStation.popupClick,
        addRoutesMark:searchResultStation.addRoutesMark,
        listPopup2:searchResultStation.listPopup2,
        page:searchResultStation.page,
        addRoutes:searchResultStation.addRoutes,
        showInfo:searchResultStation.showInfo,
        listBusRotesAndStation:searchResultStation.listBusRotesAndStation,
        listBusRotesByStation:searchResultStation.listBusRotesByStation,
        addNode:searchResultStation.addNode,
        deleteNode:searchResultStation.deleteNode,
        addMark:searchResultStation.addMark,
        fillNode:searchResultStation.fillNode
    };
});