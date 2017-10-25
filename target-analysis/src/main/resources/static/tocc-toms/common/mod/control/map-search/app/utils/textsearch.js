define(['../config/poiconfig',
'../utils/mapSearchUtils',
'../utils/stationUtils',
'../utils/routesUtils'],function(PoiConfig,MapSearchUtils,StationUtils,RoutesUtils) {

    var win = parent;
    var module;
    var searchService;
    var NowPage = 1;
    var featureQuery;
    var searchkey;
    var show;
    var rname;
    var map=parent.window.map;
    var ctx=window.AppConfig.RemoteApiUrl;

    window.onload = function () {
        $("#queryPanel").mCustomScrollbar({
            theme: "dark"
        });
        var paraObj = request();
        simpleQuery(paraObj);
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

    function simpleQuery(data) {
        if(!data){
            data=request();
        }
        //查询参数配置
        searchService = new win.beyond.data.SearchService();
        map.clear();
        var key = decodeURIComponent(decodeURIComponent(data.key));
        show = data.show;
        rname = key;
        var queryVo = new Object();
        queryVo.key = key;
        queryVo.pageSize = 10;
        queryVo.pageNum = NowPage;
        queryVo.needGeometry = true;
        searchService.fullSearch(showResult, queryVo);
    }

    function showResult(result) {
        if (result.getReturnFlag() == 1) {
            var data = result.getData();
            $("#paginator").wyPaginator({
                controlTemplate: "{PreviousPage}{NextPage}",
                pageSize: 10,
                nowPage: NowPage,
                pageLinksNum: 3,
                recordTotal: 1000,
                pageChange: function (event, data) {
                    map.clearInfoWindow()
                    NowPage = data.nowPage;
                    var paraObj = request();
                    simpleQuery(paraObj);
                    //queryLayer(showConfig, map, container)
                }
            });
            var html = "";
            var img = ""
            map.clearInfoWindow();
            searchkey = request().key;
            /**过滤全文检索中存在的相同的名称及相同的类型的数据*/
            var isExist = new Array();

            var nData = new Array();
            for (var i = 0; i < data.length; i++) {
                if (!isExist[data[i].TYPE + "_" + data[i].NAME + "_" + data[i].OID]) {
                    nData.push(data[i]);
                    isExist[data[i].TYPE + "_" + data[i].NAME + "_" + data[i].OID] = "1";
                }
            }
            for (i = 0; i < nData.length; i++) {
                var j = i + 1
                var layer = nData[i].TYPE
                if (layer == "SP_GJZD") {
                    img = ""
                    searchResultStation.listBusRotesByStation(nData[i]);
                } else if (layer == "SL_GJLX") {
                    img = ""
                    searchResultBusRoutes.listBusRotesAndStation2(nData[i]);
                } else {
                    img = ctx + PoiConfig.poiConfig[layer].config.locateIcon
                    html += '<div class="result-lists"  gid="' + nData[i].OID + '" layer="' + nData[i].TYPE + '" style="cursor:pointer">'
                    html += '<span class="lists-title">' + j + '.' + nData[i].NAME + '</span>'
                    if (nData[i].ATTRIBUTE != "") {
                        var attribute = $.parseJSON(nData[i].ATTRIBUTE);
                        for (var key in attribute) {
                            html += '<span class="lists-subtitle">' + attribute[key] + '</span>'
                        }
                    }
                    html += '</div>'
                    if (nData[i].X && nData[i].Y) {
                        marker = new win.beyond.maps.Marker({
                            position: new win.beyond.geometry.MapPoint(nData[i].X, nData[i].Y),//位置
                            icon: img,//图标
                            offsetX: 0,
                            offsetY: 0,
                            data: {"layerName": nData[i].TYPE, "GID": nData[i].OID, "X": nData[i].X, "Y": nData[i].Y}
                        });
                        map.addOverlay(marker, searchkey);
                        map.setCenter(marker.getPosition());
                        marker.addEventListener("click", function (m) {
                            var data = m.getData();
                            featureLocate(m)
                        });
                    }
                    $("#queryPanel").find(".mCSB_container").html(html);
                }
                searchResultStation.num = 1;
                searchResultBusRoutes.num = 1;

            }

            $(".result-lists").on("click",function(){
                detailClick(this);
            });

        } else {
            alert(result.getReturnInfo());
        }
    }

    function featureLocate(m) {
        var data = m.getData();
        var id = data.GID;
        var where = "GID=" + id;
        var layer = data.layerName
        MapSearchUtils.queryDetail(map, layer, m, where);
    }

    function pageChange() {
        map.clearInfoWindow()
        var paraObj = request();
        var pageSize = 10;
        var key = decodeURIComponent(decodeURIComponent(data.key))
        var where = "MC like '%" + key + "%'"
        var pageNum = NowPage;
        var listFields = "X,Y,MC,DZ";
        var datail = ""
        for (var key in PoiConfig.poiConfig[layername].data) {
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
            "map": map,
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
        map.plugin("beyond.maps.FeatureQuery", function () {
            featureQuery = new win.beyond.maps.FeatureQuery(options);
            featureQuery.simpleQuery(showResult);
        });
    }

    function detailClick(t) {
        var id = $(t).attr("gid");
        var where = "GID=" + id;
        var layer = $(t).attr("layer");
        MapSearchUtils.queryDetail(map, layer, "", where);
    }


    /**查询数据并返回html*/
    var searchResultStation = {};
    searchResultStation.num = 1;
    /**查询数据*/
    searchResultStation.listBusRotesByStation = function (data) {
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesByStation(function (result) {
                searchResultStation.fillNode(result);
            }, {
                stationCode: data.OID
            });
        });
    };
    /**填充模版内容*/
    searchResultStation.fillNode = function (result) {
        if (result.getReturnFlag() === '1') {
            var data = result.getData();
            $("#pageInfo").wyPaginator({
                pageSize: data.pageSize,
                nowPage: data.pageNo,
                recordTotal: data.totalCount
            });
            var height = 940;
            for (i = 0; i < data.list.length; i++) {
                var node = data.list[i];
                var title = $("#result-bus-station-title-template").html()
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
                                byway += $("#result-bus-station-byway-template").html()
                                    .replace("{{routes}}", item)
                                    .replace("{{startStation}}", array[j]);
                            } else {
                                byway += $("#result-bus-station-byway-template").html()
                                    .replace("{{routes}}", array[j]);
                            }
                        }
                    }
                    byway = $("#result-bus-station-items-template").html()
                        .replace("{{byway}}", byway)
                        .replace("{{fx}}", node.andDown);
                }
                var buses = $("#result-bus-station-buses-template").html()
                    .replace("{{title}}", title)
                    .replace("{{byway}}", byway)
                    .replace("{{point}}", node.x + " " + node.y);
                $("#queryPanel_1").find(".mCSB_container").append(buses);
                searchResultStation.addMark(node);
            }
        }
    };
    /**新增mark图标*/
    searchResultStation.addMark = function (data) {
        var parame = {
            point: data.x + " " + data.y,
            stationName: data.routesName,
            site: data.stationName.split(",")
        };
        var marker = new parent.beyond.maps.Marker({
            position: new parent.beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
            offsetX: 0,
            offsetY: 0,
            data: parame
        });
        marker.setDraggable(false);
        map.addOverlay(marker, searchkey);
        /**新增点击事件*/
        var where = "stationName=" + data.routesName + "&andDown=" + data.andDown;
        marker.addEventListener("click", function (marker) {
            MapSearchUtils.stationDetail(map, where, "marker", "", "", searchkey);
            /*     searchResultStation.addPopup(marker.getData());*/
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
                    items += $("#result-bus-station-infowindow-content-item-2").html()
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
        var height = map.getExtent().getHeight();
        var y = parseFloat(point[1]) + height * 0.2;
        var x = parseFloat(point[0]);
        map.setCenter(new parent.beyond.geometry.MapPoint(x, y));
        infoWindow.open(map, new parent.beyond.geometry.MapPoint(parseFloat(point[0]), parseFloat(point[1])));
        parent.$(".beyond-info").find(".inf-con-tag").on("click", function () {
            searchResultBusRoutes.popupClick($(this));
        });
    };
    /**注册点击事件站点*/
    searchResultStation.eventStation = function (target) {
        var point = target.parent().parent().attr("point");
        var name = $.trim(target.html());
        var array = new Array();
        target.parent().next().find(".buses-items-tag").each(function () {
            array.push($.trim($(this).html()));
        });
        var data = {
            point: point,
            stationName: name,
            site: array
        };
        map.clearInfoWindow();
        searchResultStation.addPopup(data);
    };
    /**注册点击事件路线*/
    searchResultStation.eventRoutes = function (target) {
        var routesName = $.trim(target.html());
        var andDown = $.trim(target.parent().next().attr("fx"));
        if (routesName.indexOf("...") >= 0) {
            routesName = $.trim(target.attr("startStation"));
        }
        var parame = {
            "routesName": routesName,
            "andDown": andDown
        };
        searchResultStation.listBusRotesAndStation(parame, target);
    };
    /**根据路线名称及上下行获取数据*/
    searchResultStation.listBusRotesAndStation = function (parame, target) {
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                searchResultStation.addNode(result, target);
                searchResultStation.addRoutes(result, target);
            }, parame);
        });
    };
    /**添加公交路线*/
    searchResultStation.addRoutes = function (result, target) {
        map.clearInfoWindow();
        map.removeOverlay(searchkey);
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
        map.addOverlay(polyline, searchkey);
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
            if (height <= 320) {
                height = 320;
            }
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
                stationCode: data[i].stationCode,
                andDown: andDown
            };
            var marker = new parent.beyond.maps.Marker({
                position: new parent.beyond.geometry.MapPoint(data[i].x, data[i].y),//位置
                icon: ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
                offsetX: 0,
                offsetY: 0,
                data: parame
            });
            marker.setDraggable(false);
            map.addOverlay(marker, searchkey);
            marker.addEventListener("click", function (marker) {
                searchResultStation.listPopup(marker.getData());
            });
        }
    };
    /**根据站点名称及上下行查询数据*/
    searchResultStation.listPopup = function (data) {
        map.plugin("beyond.data.BusService", function () {
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
        map.plugin("beyond.data.BusService", function () {
            var busService = new parent.beyond.data.BusService();
            busService.listBusRotesAndStation(function (result) {
                searchResultBusRoutes.fillNode(result);
            }, {
                routesName: data.NAME&&data.NAME.split("(")[0]
            });
        });
    };
    /**填充dom节点*/
    searchResultBusRoutes.fillNode = function (result) {
        RoutesUtils.fillNode(result);
    }

    return {
        simpleQuery:simpleQuery,
        pageChange:pageChange
    };

});
