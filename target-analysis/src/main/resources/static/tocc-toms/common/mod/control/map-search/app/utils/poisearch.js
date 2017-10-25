define(['control/map-search/app/config/poiconfig',
    'control/map-search/app/utils/mapSearchUtils',
],function(PoiConfig,MapSearchUtils) {

    var win = parent;
    var cmap=parent.window.map;
    var featureQuery;
    var NowPage = 1;
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
        var key = decodeURIComponent(decodeURIComponent(data.key));
        var layername = data.layername;
        var pageSize = 10;
        var where = "MC like '%" + key + "%'"
        var pageNum = 1;

        var listFields = "X,Y,MC,DZ,GID";
        if (layername === "S_SP_ZXCTKD") {
            listFields += ",ID";
        }
        var datail = ""
        for (var key in PoiConfig.poiConfig[layername].data) {
            datail += key + ","
        }
        datail = datail.substr(0, datail.length - 1)
        var detailFields = datail;
        var locateSymbol = {
            icon: ctx + PoiConfig.poiConfig[layername].config.locateIcon,//图标
            /* width: 20,//宽度
             height: 34,//高度*/
            offsetX: 0,
            offsetY: 0
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

    function showResult(result) {
        if (result.getReturnFlag() == 1) {
            var data = result.getData();
            $("#paginator").wyPaginator({
                controlTemplate: "{FirstPage}{PreviousPage}{PageLinks}{NextPage}{LastPage}",
                pageSize: 10,
                nowPage: NowPage,
                pageLinksNum: 3,
                recordTotal: data.count,
                pageChange: function (event, data) {
                    cmap.clear();
                    cmap.clearInfoWindow();
                    NowPage = data.nowPage;
                    pageChange()
                    //queryLayer(showConfig, map, container)
                }
            });
            var html = "";
            for (i = 0; i < data.list.length; i++) {
                var j = i + 1
                html += '<div class="result-lists" gid="' + data.list[i].GID + '" id="' + data.list[i].ID + '" x="' + data.list[i].X + '" y="' + data.list[i].Y + '">'
                html += '<span class="lists-title">' + j + '.' + data.list[i].MC + '</span>'
                if (data.list[i].DZ != null && data.list[i].DZ != "") {
                    html += '<span class="lists-subtitle">' + data.list[i].DZ + '</span>'
                } else {
                    html += '<span class="lists-subtitle">暂无数据</span>'
                }
                html += '</div>'
            }
            $("#queryPanel").find(".mCSB_container").html(html);
            $(".result-lists").on("click",function(){
                detailClick(this);
            });
        } else {
            alert(result.getReturnInfo());
        }
    }

    function featureLocate(marker) {
        var data = marker.getData();
        var id = data["GID"];
        var where = "GID=" + id;
        var paraObj = request();
        var layer = paraObj.layername;
        if (layer === "S_SP_ZXCTKD") {
            var data = marker.getData();
            var obj = new Object();
            obj.id = data["ID"]
            var where = JSON.stringify(obj);
            MapSearchUtils.queryDetail(cmap, "SP_ZXCKJKH", marker, where);
        } else {
            MapSearchUtils.queryDetail(cmap, layer, null, where);
        }
    }

    function pageChange() {
        var paraObj = request();
        var pageSize = 10;
        var where = "MC like '%" + paraObj.key + "%'"
        var pageNum = NowPage;
        var layername = paraObj.layername
        var listFields = "X,Y,MC,DZ,GID";
        var datail = ""
        for (var key in PoiConfig.poiConfig[layername].data) {
            datail += key + ","
        }
        datail = datail.substr(0, datail.length - 1)
        var detailFields = datail;
        var locateSymbol = {
            icon:ctx + PoiConfig.poiConfig[layername].config.locateIcon,//图标
            /*  width: 20,//宽度
             height: 34,//高度*/
            offsetX: 0,
            offsetY: 0
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
        var paraObj = request();
        var layer = paraObj.layername;
        if (layer === "S_SP_ZXCTKD") {
            var obj = new Object();
            obj.id = $(t).attr("id");
            obj.x = $(t).attr("x");
            obj.y = $(t).attr("y");
            var where = JSON.stringify(obj);
            var marker = new parent.beyond.maps.Marker({
                position: new parent.beyond.geometry.MapPoint(parseFloat(obj.x), parseFloat(obj.y)),//位置
                icon: ctx + "/control/map-search/resource/images/GJZ_1.png",//图标
                offsetX: 0,
                offsetY: 0
            });
            MapSearchUtils.queryDetail(cmap, "SP_ZXCKJKH", marker, where);
        } else {
            MapSearchUtils.queryDetail(cmap, layer, null, where);
        }

    }


    return {
        simpleQuery:simpleQuery,
        pageChange:pageChange
    };

});