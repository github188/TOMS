define(['../utils/mapSearchUtils'],function(MapSearchUtils) {

    var win = parent;
    var searchService;
    var NowPage = 1;
    var featureQuery;
    var searchkey;
    var cmap=parent.window.map;
    var ctx=window.AppConfig.RemoteApiUrl;

    window.onload = function () {
        //alert("正在调优中。。。");
        $("#queryPanel_1").mCustomScrollbar({
            theme: "dark"
        });
        var paraObj = request();
        spatialQuery(paraObj);
    };


    function request() {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        return paraObj;

    }

    function spatialQuery(data) {
        if(!data){
            data=request();
        }
        var errorDistance = cmap.getExtent().getWidth() / 100;
        var edis = parent.beyond.maps.GeometryUtil.convertLenToTheUnit(errorDistance, parent.Units.DECIMAL_DEGREES, parent.Units.METERS);
        var distance;
        if (data.distance > edis) {
            distance = data.distance - edis;
        } else {
            distance = edis;
        }
        var point = data.point;
        var type = data.type;
        if (distance && point) {
            //查询参数配置
            searchService = new win.beyond.data.SearchService();
            /*cmap.clear();*/
            var queryVo = new Object();
            //queryVo.key = key;
            queryVo.pageSize = 10;
            queryVo.pageNum = NowPage;
            queryVo.needGeometry = true;
            queryVo.distance = distance;
            queryVo.point = point;
            queryVo.type = type;
            searchService.bufferQuery(showResult, queryVo);
        }

    }

    function showResult(result) {
        if (result.getReturnFlag() == 1) {
            var data = result.getData();
            if (data != null && data.list != null && data.list.length > 0) {
                data = data.list;
            } else {
                return;
            }
            $("#paginator_1").wyPaginator({
                controlTemplate: "{PreviousPage}{NextPage}",
                pageSize: 10,
                nowPage: NowPage,
                pageLinksNum: 3,
                recordTotal: 1000,
                pageChange: function (event, data) {
                    cmap.clearInfoWindow()
                    NowPage = data.nowPage;
                    var paraObj = request();
                    spatialQuery(paraObj);
                    //queryLayer(showConfig, map, container)
                }
            });
            var html = "";
            var img = ""
            cmap.clearInfoWindow();
            searchkey = request().layerid;
            $("#queryPanel_1").find(".mCSB_container").html("");
            for (i = 0; i < data.length; i++) {
                var j = i + 1
                var layer = data[i].TYPE
                if (layer == "SP_GJZD") {
                    img = "";
                    searchResultStation.listBusRotesByStation(data[i]);
                } else if (layer == "SL_GJLX") {
                    img = ""
                    searchResultBusRoutes.listBusRotesAndStation2(data[i]);
                } else {
                    img = win.ctx + poiConfig[layer].config.locateIcon
                    html += '<div class="result-lists" onclick="detailClick(this)" gid="' + data[i].OID + '" layer="' + data[i].TYPE + '" style="cursor:pointer">'
                    html += '<span class="lists-title">' + j + '.' + data[i].NAME + '</span>'
                    if (data[i].ATTRIBUTE != "") {
                        var attribute = $.parseJSON(data[i].ATTRIBUTE);
                        for (var key in attribute) {
                            html += '<span class="lists-subtitle">' + attribute[key] + '</span>'
                        }
                    }

                    html += '</div>'
                    marker = new win.beyond.maps.Marker({
                        position: new win.beyond.geometry.MapPoint(data[i].X, data[i].Y),//位置
                        icon: img,//图标
                        offsetX: 0,
                        offsetY: 0,
                        data: {"layerName": data[i].TYPE, "GID": data[i].OID, "X": data[i].X, "Y": data[i].Y}
                    });
                    cmap.addOverlay(marker, searchkey);
                    cmap.setCenter(marker.getPosition());
                    marker.addEventListener("click", function (m) {
                        var data = m.getData();
                        featureLocate(m)
                    });
                    $("#queryPanel_1").find(".mCSB_container").html(html);
                }
                searchResultStation.num = 1;
                searchResultBusRoutes.num = 1;
            }

        } else {
            alert(result.getReturnInfo());
        }
    }

    function featureLocate(m) {
        var data = m.getData();
        var id = data.GID;
        var where = "GID=" + id;
        var layer = data.layerName;
        MapSearchUtils.queryDetail(cmap, layer, m, where);
    }

    function pageChange() {
        cmap.clearInfoWindow()
        var paraObj = request();
        var pageSize = 10;
        var key = decodeURIComponent(decodeURIComponent(data.key))
        var where = "MC like '%" + key + "%'"
        var pageNum = NowPage;
        var listFields = "X,Y,MC,DZ";
        var datail = ""
        for (var key in poiConfig[layername].data) {
            datail += key + ","
        }
        datail = datail.substr(0, datail.length - 1)
        var detailFields = datail;
        var locateSymbol = {
            icon: "",//图标
            width: 20,//宽度
            height: 34,//高度
            offsetX: 0,
            offsetY: 17
        };
        var options = {
            "map": cmap,
            "id": layername,
            "layerName": layername,
            "needGeometry": true,
            "pageSize": pageSize,
            "pageNum": pageNum,
            "locateSymbol": locateSymbol,
            "listFields": listFields,
            "detailFields": detailFields,
            "where": where,
            "featureClick": featureLocate
        };
        cmap.plugin("beyond.maps.FeatureQuery", function () {
            featureQuery = new win.beyond.maps.FeatureQuery(options);
            featureQuery.simpleQuery(showResult);
        });
    }

    function detailClick(t) {
        var id = $(t).attr("gid");
        var where = "GID=" + id;
        var layer = $(t).attr("layer");
        MapSearchUtils.queryDetail(cmap, layer, "", where);
    }


    /**查询数据并返回html*/
    var searchResultStation = {};
    searchResultStation.num = 1;
    /**查询数据*/
    searchResultStation.listBusRotesByStation = function (data) {
        var parame;
        if (data.OID) {
            parame = {
                stationCode: data.OID
            };
        } else {
            parame = {
                stationName: data.NAME
            };
        }
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function (result) {
                searchResultStation.fillNode(result, parame);
            }, parame);
        });
    };
    /**填充模版内容*/
    searchResultStation.fillNode = function (result, parame) {
        if (result.getReturnFlag() === '1') {
            var data = result.getData();
            $("#pageInfo").wyPaginator({
                pageSize: data.pageSize,
                nowPage: data.pageNo,
                recordTotal: data.totalCount
            });
            var template='<div class="buses-title">'+
            '<span>{{NO}}.</span>'+
            '<span class="buses-title-text">{{stationName}}</span>'+
            '<span class="buses-title-char">{{upDown}}</span>'+
            '</div>';

            var bywayTemplate='<div class="buses-items-tag" startStation="{{startStation}}">{{routes}}</div>';

            var stationTemplate='<div class="buses-items" fx="{{fx}}">'+
            '<label class="buses-items-label">途径公交路线：</label>'+
            '{{byway}}'+
            '</div>';

            var lineTemplate='<div class="result-buses" point="{{point}}">'+
            '{{title}}'+
            '{{byway}}'+
            '</div>';
            var height = 940;
            for (i = 0; i < data.list.length; i++) {
                var node = data.list[i];
                var title = template
                    .replace("{{NO}}", searchResultStation.num)
                    .replace("{{stationName}}", node.routesName)
                    .replace("{{upDown}}", node.andDown === 0 ? "上行" : "下行");
                searchResultStation.num += 1;
                var byway = '';
                if (node.stationName) {
                    var array = node.stationName.split(",");
                    if (array && array.length > 0) {
                        if (array.length > 4) {
                            var nl = array.length - 4;
                            var bei = ((nl - (nl % 5)) / 5) + 1;
                            height += bei * 35;
                        }
                        for (var j = 0; j < array.length; j++) {
                            if (array[j].length > 4) {
                                var item = array[j].substring(0, 2) + "...";
                                byway += bywayTemplate
                                    .replace("{{routes}}", item)
                                    .replace("{{startStation}}", array[j]);
                            } else {
                                byway += bywayTemplate
                                    .replace("{{routes}}", array[j]);
                            }
                        }
                    }
                    byway = stationTemplate
                        .replace("{{byway}}", byway)
                        .replace("{{fx}}", node.andDown);
                }
                var buses = lineTemplate
                    .replace("{{title}}", title)
                    .replace("{{byway}}", byway)
                    .replace("{{point}}", node.x + " " + node.y);
                $("#queryPanel").find(".mCSB_container").append(buses);
                searchResultStation.addMark(node);
            }
        }
    };
    /**新增mark图标*/
    searchResultStation.addMark = function (data) {
        var parame = {
            andDown: data.andDown,
            point: data.x + " " + data.y,
            stationName: data.routesName,
            site: data.stationName.split(",")
        };
        var marker = new parent.beyond.maps.Marker({
            position: new parent.beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: parent.ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
            offsetX: 0,
            offsetY: 0,
            data: parame
        });
        marker.setDraggable(false);
        cmap.addOverlay(marker, searchkey);
        cmap.setCenter(new parent.beyond.geometry.MapPoint(data.x, data.y));
        /**新增点击事件*/
        var where = "stationName=" + data.routesName + "&andDown=" + data.andDown;
        marker.addEventListener("click", function (marker) {
            MapSearchUtils.stationDetail(cmap, where, "marker", "", "", searchkey);
            /*searchResultStation.addPopup(marker.getData());*/
        });
    };
    /**指定数据信息图片提示框*/
    searchResultStation.addPopup = function (data) {
        var point = data.point.split(" ");
        var stationName = data.stationName;
        var array = data.site;
        var items = "";
        if (array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].length > 4 && array[i].length < 25) {
                    var px = array[i].length;
                    var bei = ((px - (px % 4)) / 4) + 1;
                    var np = bei * 50;
                    var style = "style='width:" + np + "px;'";
                    items += "<div class='inf-con-tag'" + style + ">" + array[i] + "</div>";
                } else if (array[i].length > 25) {
                    var item = array[i].substring(0, 20) + "...";
                    var style = "style='width:280px;'";
                    items += "<div class='inf-con-tag'" + style + ">" + item + "</div>";
                } else {
                    items += $("#result-bus-station-infowindow-content-item").html()
                        .replace("{{stationName}}", array[i]);
                }
            }
        }
        var content = $("#result-bus-station-infowindow-content").html()
            .replace("{{content}}", items);
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title: stationName + "公交站",
            content: content,
            offsetY: 0,
            offsetX: 0
        });
        var height = cmap.getExtent().getHeight();
        var y = parseFloat(point[1]) + height * 0.2;
        var x = parseFloat(point[0]);
        cmap.setCenter(new parent.beyond.geometry.MapPoint(x, y));
        infoWindow.open(cmap, new parent.beyond.geometry.MapPoint(parseFloat(point[0]), parseFloat(point[1])));
        parent.$(".beyond-info").find(".inf-con-tag").on("click", function () {
            var routesName = $.trim($(this).html());
            var andDown = data.andDown;
            var where = "routesName=" + routesName + "&andDown=" + andDown;
            parent.mapcomn.stationLineDetail(map, where, "", layerName);
        });
    };
    /**注册点击事件站点*/
    searchResultStation.eventStation = function (target) {
        var point = target.parent().parent().attr("point");
        var andDown = target.next().html();
        var x;
        var y;
        if (point) {
            var p = point.split(" ");
            x = p[0];
            y = p[1];
        }
        var name = $.trim(target.html());
        var array = new Array();
        target.parent().next().find(".buses-items-tag").each(function () {
            array.push($(this).html());
        });
        var data = {
            x: x,
            y: y,
            rnames: array,
            sname: name,
            andDown: andDown
        };
        cmap.clearInfoWindow();
        parent.mapcomn.queryDetail(cmap, "SP_GJZD", "marker", "", "", data);
        /*searchResultStation.addPopup(data);*/
    };
    /**注册点击事件路线*/
    searchResultStation.eventRoutes = function (target) {
        var routesName = $.trim(target.html());
        var andDown = $.trim(target.parent().next().attr("fx"));
        if (routesName.indexOf("...") >= 0) {
            routesName = $.trim(target.attr("startStation"));
        }
        var where = "routesName=" + routesName + "&andDown=" + andDown;
        parent.mapcomn.stationLineDetail(cmap, where, "", searchkey);
    };
    /**根据路线名称及上下行获取数据*/
    searchResultStation.listBusRotesAndStation = function (parame, target) {
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                searchResultStation.addNode(result, target);
                searchResultStation.addRoutes(result, target);
            }, parame);
        });
    };
    /**添加公交路线*/
    searchResultStation.addRoutes = function (result, target) {
        cmap.clearInfoWindow();
        cmap.removeOverlay(searchkey);
        var geometryStr = result.getData().list[0].geometryStr;
        var andDown = result.getData().list[0].andDown;
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
            strokeColor: "#4169E1", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: false   //居中放大
        });
        cmap.addOverlay(polyline, searchkey);
        searchResultStation.addRoutesMark(result.getData().list[0].busStations, andDown);
        polyline.addEventListener("click", function (obj, event) {
            alert("点击");
        });
    };
    /**点击途经车次添加节点*/
    searchResultStation.addNode = function (result, target) {
        var data = result.getData().list[0];
        var node = $("#result-bus-station-details-template").html()
            .replace("{{startStation}}", data.startStation)
            .replace("{{endStation}}", data.endStation)
            .replace("{{startTime}}", data.andDown === 0 ? data.upDepartureTime : data.downDepartureTime)
            .replace("{{endTime}}", data.andDown === 0 ? data.upCollectTime : data.downCollectTime)
            .replace("{{interval}}", data.andDown === 0 ? data.upDepartureInterval : data.downDepartureInterval)
            .replace("{{mileage}}", data.andDown === 0 ? data.upLength : data.downLength);
        var _target = target.parent().parent().find(".tag-details");
        if (!_target.html()) {
            var height = $(".ui-scroll-container").height();
            height += 79;
            $(".ui-scroll-container").css("height", height + "px");
        }
        if (_target.html()) {
            _target.remove();
        }
        target.parent().parent().append(node);
    };
    /**新增线路mark*/
    searchResultStation.addRoutesMark = function (data, andDown) {
        for (var i = 0; i < data.length; i++) {
            var parame = {
                andDown: data[i].andDown,
                stationCode: data[i].stationCode,
                andDown: andDown
            };
            var marker = new parent.beyond.maps.Marker({
                position: new parent.beyond.geometry.MapPoint(data[i].x, data[i].y),//位置
                icon: parent.ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
                offsetX: 0,
                offsetY: 0,
                data: parame
            });
            marker.setDraggable(false);
            cmap.addOverlay(marker, searchkey);
            marker.addEventListener("click", function (marker) {
                searchResultStation.listPopup(marker.getData());
            });
        }
    };
    /**根据站点名称及上下行查询数据*/
    searchResultStation.listPopup = function (data) {
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function (result) {
                if (result.getReturnFlag() === '1') {
                    var rdata = result.getData().list[0];
                    var array = rdata.stationName.split(",");
                    var data = {
                        point: rdata.x + " " + rdata.y,
                        stationName: rdata.routesName,
                        site: array
                    };
                    searchResultBusRoutes.addPopup(data);
                }
            }, data);
        });
    };

    /**公交路线加载使用*/
    /**查询公交路线主函数mian*/
    var searchResultBusRoutes = {};
    searchResultBusRoutes.num = 1;
    searchResultBusRoutes.listBusRotesAndStation2 = function (data) {
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                searchResultBusRoutes.fillNode(result);
            }, {
                routesName: data.NAME
            });
        });
    };
    /**填充dom节点*/
    searchResultBusRoutes.fillNode = function (result) {
        var data = result._data.list;
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var onlineList = "";
                var stationList = $(".result-bus-station-item-online").html();
                var item = data[i];
                var byway = "";
                var array = item.busStations;
                for (var j = 0; j < array.length; j++) {
                    byway += $("#result-bus-station-item-site-item").html()
                        .replace("{{item}}", j + 1 + "." + array[j].stationName)
                        .replace("{{point}}", array[j].x + " " + array[j].y)
                        .replace("{{code}}", array[j].stationCode);
                }
                var node = $("#result-bus-station-item-template").html()
                    .replace("{{line}}", item.geometryStr)
                    .replace("{{routesName}}", item.routesName)
                    .replace("{{stationBeginTime}}", item.andDown === 0 ? item.upDepartureTime : item.downDepartureTime)
                    .replace("{{stationEndTime}}", item.andDown === 0 ? item.upCollectTime : item.downCollectTime)
                    .replace("{{startStation}}", item.startStation)
                    .replace("{{endStation}}", item.endStation)
                    .replace("{{stationInterval}}", item.andDown === 0 ? item.upDepartureInterval : item.downDepartureInterval)
                    .replace("{{stationMileage}}", item.andDown === 0 ? item.upLength : item.downLength)
                    .replace("{{stationList}}", $("#result-bus-station-item-site").html().replace("{{andDown}}", item.andDown))
                    .replace("{{stationList}}", byway)
                    .replace("{{onlineList}}", $("#result-bus-station-item-online").html().replace("{{andDown}}", item.andDown).replace("{{routesCode}}", item.routesCode));
                $("#queryPanel_1").find(".mCSB_container").append(node);
            }
        }
    };
    /**填充线上车辆数据*/
    searchResultBusRoutes.onlineNode = function (parame) {
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRoutesVehicles(function (result) {
                if (result._data.list && result._data.list.length > 0) {
                    var array = result._data.list;
                    for (var i = 0; i < array.length; i++) {
                        var node = $("#result-bus-station-item-online-item").html()
                            .replace("{{number}}", i + 1)
                            .replace("{{name}}", array[i].licensePlateNumber)
                            .replace("{{point}}", array[i].x + " " + array[i].y);
                        $(".result-bus-station-item-online-list").append(node);
                        var data = {};
                        data.name = array[i].licensePlateNumber;
                        data.x = array[i].x;
                        data.y = array[i].y;
                        searchResultBusRoutes.addTextMark(data);
                    }
                    /**线上车辆点击事件*/
                    /* $(".items-online-list>.online-lic").on("click",function(){
                     var data={};
                     var point=$(this).attr("point").split(" ");
                     data.name=$(this).html();
                     data.x=point[0];
                     data.y=point[1];
                     searchResultBusRoutes.addTextMark(data);
                     });*/
                }
            }, parame);
        });
    };
    /**地图定位公交路线*/
    searchResultBusRoutes.routes = function (parame) {
        cmap.clearInfoWindow();
        cmap.removeOverlay(searchkey);
        var geometryStr = parame.line;
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
            strokeColor: "#4169E1", //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: false   //居中放大
        });
        cmap.addOverlay(polyline, searchkey);
        if (parame.pointArray && parame.pointArray.length > 0) {
            for (var j = 0; j < parame.pointArray.length; j++) {
                var item = parame.pointArray[j];
                var data = {
                    stationCode: item.code,
                    andDown: parame.andDown
                };
                var marker = new parent.beyond.maps.Marker({
                    position: new parent.beyond.geometry.MapPoint(parame.pointArray[j].x, parame.pointArray[j].y),//位置
                    icon: parent.ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    data: data
                });
                cmap.addOverlay(marker, searchkey);
                /**新增点击事件*/
                marker.addEventListener("click", function (marker) {
                    searchResultBusRoutes.listPopup(marker.getData());
                });
            }
            //居中显示
            cmap.setCenter(new parent.beyond.geometry.MapPoint(parame.pointArray[0].x, parame.pointArray[0].y));
        }
        polyline.addEventListener("click", function (obj, event) {
            alert("点击");
        });
    };
    /**根据站点名称及上下行查询数据*/
    searchResultBusRoutes.listPopup = function (data) {
        cmap.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function (result) {
                if (result.getReturnFlag() === '1') {
                    var rdata = result.getData().list[0];
                    var array = rdata.stationName.split(",");
                    var data = {
                        point: rdata.x + " " + rdata.y,
                        stationName: rdata.routesName,
                        site: array
                    };
                    searchResultBusRoutes.addPopup(data);
                }
            }, data);
        });
    };

    /**站点点击事件*/
    searchResultBusRoutes.addPopup = function (data) {
        var point = data.point.split(" ");
        var stationName = data.stationName;
        var array = data.site;
        var items = "";
        if (array) {
            for (var i = 0; i < array.length; i++) {
                /*   items+=$("#result-bus-station-infowindow-content-item").html()
                 .replace("{{stationName}}",array[i]);*/
                if (array[i].length > 4 && array[i].length < 25) {
                    var px = array[i].length;
                    var bei = ((px - (px % 4)) / 4) + 1;
                    var np = bei * 50;
                    var style = "style='width:" + np + "px;'";
                    items += "<div class='inf-con-tag'" + style + ">" + array[i] + "</div>";
                } else if (array[i].length > 25) {
                    var item = array[i].substring(0, 20) + "...";
                    var style = "style='width:280px;'";
                    items += "<div class='inf-con-tag'" + style + ">" + item + "</div>";
                } else {
                    items += $("#result-bus-station-infowindow-content-item").html()
                        .replace("{{stationName}}", array[i]);
                }
            }
        }
        var content = $("#result-bus-station-infowindow-content").html()
            .replace("{{content}}", items);
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title: stationName + "公交站",
            content: content,
            offsetY: 0,
            offsetX: 0
        });
        var height = cmap.getExtent().getHeight();
        var y = parseFloat(point[1]) + height * 0.2;
        var x = parseFloat(point[0]);
        cmap.setCenter(new parent.beyond.geometry.MapPoint(x, y));
        infoWindow.open(cmap, new parent.beyond.geometry.MapPoint(parseFloat(point[0]), parseFloat(point[1])));
    };
    /**
     * 根据数据新增文本mark
     * @param data
     */
    searchResultBusRoutes.addTextMark = function (data) {
        if (!data) {
            return;
        }
        var html = '<div class="chepai" style="font-family: Arial;font-weight: bold;font-size: smaller;text-align: center;line-height: 16px;color: rgb(234, 241, 250);border: 0px solid #379082;border-radius: 3px;padding: 1px 1px;width: 63px;height: 15px;background-color: rgb(40, 130, 217);" >' + data.name + '</div>';
        var text = new parent.beyond.maps.BText({"html": html, "offsetX": -33, "offsetY": -20});
        var marker = null;
        marker = new parent.beyond.maps.Marker({
            position: new parent.beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: parent.ctx + "/map/search/resource/imgs/onlineBlueCar.png",//图标
            width: 34,//宽度
            height: 34,//高度
            angle: 0,
            editEnable: true,
            offsetX: 0,
            offsetY: 0,
            btext: text,
            data: {"test": "测试"}
        });
        cmap.addOverlay(marker, searchkey);
        cmap.setCenter(marker.getPosition());
        marker.addEventListener("click", function (m) {
            alert("x:" + data.x + "  " + "y:" + data.y);
        });
    };

    searchResultBusRoutes.exall = function (target) {
        //途径站点内容折叠与展开
        var haspanel = target.parents(".result-items-has"),
            status = haspanel.attr("active");
        if (status == "0") {
            haspanel.addClass('items-unfold');
            haspanel.attr('active', '1');
        } else {
            haspanel.removeClass('items-unfold');
            haspanel.attr('active', '0');
        }
    };
//线上车辆内容折叠与展开
    searchResultBusRoutes.carexall = function (target) {
        var haspanel = target.parents(".result-items-has"),
            status = haspanel.attr("active");
        if (status == "0") {
            $(".result-bus-station-item-online-list").html("");
            var andDown = target.attr("andDown");
            var busRoutesCode = target.attr("routesCode");
            var parame = {
                "busRoutesCode": busRoutesCode,
                "andDown": andDown
            };
            searchResultBusRoutes.onlineNode(parame);
            haspanel.addClass('items-unfold');
            haspanel.attr('active', '1');
        } else {
            haspanel.removeClass('items-unfold');
            haspanel.attr('active', '0');
        }
    };
    /*汽车选中点击事件*/
    /*searchResultBusRoutes.carChoose=function(target){
     $(".result-bus-station-item-online-list").html("");
     var andDown=target.attr("andDown");
     var busRoutesCode=target.attr("routesCode");
     var parame={
     "busRoutesCode": busRoutesCode,
     "andDown": andDown
     };
     searchResultBusRoutes.onlineNode(parame);
     };*/
    /**公交路线选择*/
    searchResultBusRoutes.rotesChoose = function (target) {
        cmap.removeOverlay(searchkey);
        cmap.clearInfoWindow();
        var line = target.attr("line");
        var array = new Array();
        var andDown = target.next().attr("andDown");
        target.next().find(".items-station-list").each(function () {
            var point = new Object();
            var p = $(this).attr("point").split(" ");
            var code = $(this).attr("code");
            point.x = p[0];
            point.y = p[1];
            point.code = code;
            array.push(point);
        });
        var parame = {
            line: line,
            pointArray: array,
            andDown: andDown
        }
        searchResultBusRoutes.routes(parame);
    };
    /**途经站点点击事件*/
    searchResultBusRoutes.stationChoose = function (target) {
        var where = "stationCode=" + target.attr("code") + "&andDown=" + target.parent().parent().attr("anddown");
        parent.mapcomn.queryDetail(cmap, "SP_GJZD", null, where);
    };
    /**点击途经车次显示的详细关闭按钮*/
    searchResultStation.deleteNode = function (target) {
        target.parent().remove()
    };


    return {
        spatialQuery:spatialQuery
    }


});