define(['../utils/searchUtils',
    '../config/poiconfig',
    'map_utils',
    'bmapui'],function(SearchUtils,PoiConfig,mapUtils) {
    var tjgjlx='<div class="inf-content" style="width:350px;">'+
        '<label class="inf-con-label">途径公交路线：</label>'+
        '{{content}}'+
        '</div>';

    var cmap=window.map;

    var tjgjlxItem=' <div class="inf-con-tag">{{stationName}}</div>';
    var ctx=window.AppConfig.RemoteApiUrl;
    var layerNameConfig={
        /**
         * 公交线路热力图，此名称要和静态地图服务的名称对应
         */
        gjxl_rlt_name: "wenzhouroad",
        /**
         * 公交站点热力图，此名称要和静态地图服务的名称对应
         */
        gjzd_rlt_name: "wenzhougjzd",
        /**
         * 公交站点300米覆盖
         */
        gjzd_300_name: "gjzd_300",
        /**
         * 公交站点500米覆盖
         */
        gjzd_500_name: "gjzd_500",
        bus_cluster_name:"bus_cluster",
        /**
         * 自行车距离图
         */
        bicycle_gjzd_name:"bicycle_gjzd",
        /**
         * 自行车可借可还图层
         */
        bicycle_kejiekehuan_name:"bicycle_kejiekehuan",

        //自行车站点
        bicycle_biczd:"bicycle_biczd",

        bicycle_rlt_name: "bicycle_rlt",
        /**
         * 出租车聚合
         */
        taxi_cluster_name:"taxi_cluster",
        /**
         * 高速通畅图层
         */
        highspeed_tc:"highspeed_tc",
        /**
         * 高速收费站图层
         */
        highspeed_sfz:"highspeed_sfz",
        /**
         * 路网专题图层
         */
        roadnetwork_jyz:"roadnetwork_jyz",
        roadnetwork_sd:"roadnetwork_sd",
        roadnetwork_fwq:"roadnetwork_fwq",
        roadnetwork_zcz:"roadnetwork_zcz",
        roadnetwork_sfz:"roadnetwork_sfz",
        other_wx:"other_wx",
        other_ph:"other_ph",
        other_jp:"other_jp",
        other_whtc:"other_whtc",
        other_kyz:"other_kyz",
        gjzd_gjzd:"gjzd_gjzd"
    };

    var pasthroughputChart1;

    var pasthroughputChartDate1=function(passenger_pasthroughput_month,passenger_pasthroughputIn,passenger_In,passenger_Out,stationName){
        var option = {
            color:['#32B332','#3CCAD7','#6375E7'],
            title : {
                text: stationName+"近7日车流量走势图",
                x: 'center',
                y:'－2'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['总车流','进站车流','出站车流'],
                x:'right',
                y:'25'
            },
            calculable : true,
            grid:{
                x:55,
                y:45,
                x2:55,
                y2:25
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : passenger_pasthroughput_month
                }
            ],
            yAxis : [
                {
                    type : 'value',
//			            min:0,
//						max:500,
                    axisLabel : {
                        formatter: '{value}辆'
                    }
                }
            ],
            series : [
                {
                    name:'总车流',
                    type:'line',
                    data:passenger_pasthroughputIn
                },
                {
                    name:'进站车流',
                    type:'line',
                    data:passenger_In
                },
                {
                    name:'出站车流',
                    type:'line',
                    data:passenger_Out

                }
            ]
        };
        pasthroughputChart1.clear();
        pasthroughputChart1.setOption(option);
    };

    var lineRGB=["#F2711C","#DB2828","#ecb108","#B5CC18","#407349",
        "#00B5AD","#1F5FDB","#6435C9","#A333C8","#E03997","#A5673F",
        "#4169E1","#999900","#CC9933","#6633FF"];

    var gjzPNG={
        "#F2711C":"GJZ__01.png",
        "#DB2828":"GJZ__02.png",
        "#ecb108":"GJZ__03.png",
        "#B5CC18":"GJZ__04.png",
        "#407349":"GJZ__05.png",
        "#00B5AD":"GJZ__06.png",
        "#1F5FDB":"GJZ__07.png",
        "#6435C9":"GJZ__08.png",
        "#A333C8":"GJZ__09.png",
        "#E03997":"GJZ__10.png",
        "#A5673F":"GJZ__11.png",
        "#4169E1":"GJZ__12.png",
        "#999900":"GJZ__13.png",
        "#CC9933":"GJZ__14.png",
        "#6633FF":"GJZ__15.png"};
    var chooseRGB;
    Array.prototype.remove=function(dx)
    {
        if(isNaN(dx)||dx>mapcomn.length){return false;}
        for(var i=0,n=0;i<mapcomn.length;i++)
        {
            if(mapcomn[i]!=mapcomn[dx])
            {
                mapcomn[n++]=mapcomn[i]
            }
        }
        mapcomn.length-=1
    }

    /**
     * 获取高速json数据
     */
    function gethighspeedData(callback){
        var jsonPath=highspeedpath;
        $.getJSON(jsonPath, function(data){
            callback(data);
        });
    }

    /**
     * 获取收费站流量数据
     * @param marker
     */
    function featureLocate11(marker) {
        var mdata=marker.getData();
        var stationName;
        if(mdata.MC){
            stationName=encodeURIComponent(encodeURIComponent(mdata.MC.replace("收费站","")));
        }
        $.ajax({
            url: ctx + "/holiday/findTollCateDetail?date7hours=" + false + "&stationName=" + stationName,
            type: "get",
            success:function(data){
                $("#highspeedflowTemplate").find("input[name=stationName]").val(decodeURIComponent(decodeURIComponent(stationName)));
                $("#highspeedflowTemplate").find(".incar").html(data.flowData[0][1]+"辆");
                $("#highspeedflowTemplate").find(".outcar").html(data.flowData[0][2]+"辆");
                $("#highspeedflowTemplate").find(".updatetime").html(data.updateTime);
                openInfoWindow(marker,$("#highspeedflowTemplate").html(),mdata.MC,app.cmap);
                var node=document.getElementById("beyondmap-info");
                //initPasthroughputChart(node.firstChild.firstChild.lastChild.previousSibling.childNodes[3]);
                //pasthroughputChartDate1(data.dayList,data.totalList,data.inNumData,data.outNumData,mdata.MC);
                pasthroughputChart1.hideLoading();
            },
            error:function(data){
                $("#highspeedflowTemplate").find(".incar").html('-·-'+"辆");
                $("#highspeedflowTemplate").find(".outcar").html('-·-'+"辆");
                $("#highspeedflowTemplate").find(".updatetime").html('-·-');
                openInfoWindow(marker,$("#highspeedflowTemplate").html(),mdata.MC,app.cmap);
                var node=document.getElementById("beyondmap-info");
                //initPasthroughputChart(node.firstChild.firstChild.lastChild.previousSibling.childNodes[3]);
                pasthroughputChartDate1([],[],[],[],mdata.MC);
            }
        });
    }
    /**
     * 打开收费站infowindow
     */
    function openInfoWindow(marker,html,stationName,map){
        var infoWindow = new parent.beyond.maps.BInfoWindow({
            title: stationName+"流量数据详情",
            content: html,
            offsetY: 0,
            offsetX: 0
        });
        var height = map.getExtent().getHeight();
        var y = marker.getPosition().y + height * 0.2;
        var x = marker.getPosition().x;
        map.setCenter(new beyond.geometry.MapPoint(x, y));
        infoWindow.open(map, marker.getPosition());
    }

    var highspeedInterval;
    /**每5分钟查询一次高速数据*/
    function startInterval(map,layername){
        highspeedInterval=setInterval("mapcomn.addTopicLayer_(map,layername);",300000);
    }
    /**
     * 根据拥堵度返回路线颜色
     * @param ydd
     */
    function getRgb(ydd){
        if(ydd){
            if(ydd==="0"||ydd==="1"){
                return "#4cca5e";
            }else if(ydd==="2"){
                return "#f2a621";
            }else if(ydd==="3"){
                return "#f06b30";
            }else if(ydd==="4"){
                return "#ec2e2e";
            }else if(ydd==="5"){
                return "#b456cc";
            }
        }else{
            return "#4cca5e";
            /*alert("高速拥堵度暂无数据！");
             console.log(ydd);*/
        }
    }

    /**获取随机整数*/
    function getRandom(min, max){
        var r = Math.random() * (max - min);
        var re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min)
        return re;
    }
    /**
     * 根据名称检索结果，并打开新窗口
     * @param parame
     */
    function searchResult(parame){
        if(!parame.name){
            return;
        }
        var encode=encodeURIComponent(encodeURIComponent(parame.name));
        if(parame.layerName){
            encode=parame.layerName;
        }
        //debug
        var tab = {
            title: parame.name,
            content: ctx+"/control/map-search/page/routes/routes.html?layername="+encode+"&show=0&key="+parame.name+"&rgb="+parame.rgb+"&andDown="+parame.andDown,
            contentType:"iframe",
            data:{
                name:encode,
                type:1
            }
        };
        SearchUtils.addTab(tab);
    }
    function openAnalyseWindow(title,src){
        $(".analysis-enter").click(function(){
            //TODO:设置iframe页面
            $("#analysisBox .container-title h2").html(title);
            $("#analysisBox iframe").attr("src",src);
            $("#analysisBox").slideDown();
        });

        $("#analysisBox .title-btnClose").click(function(){
            $("#analysisBox").slideUp();
        });
    }

    function floatLayerBoxToggle(){
        $(".floatLayerBox").toggle();
    }
    function floatLayerBoxToggle(b){
        $(".floatLayerBox").toggle(b);
    }
    /**
     * 根据数据添加公交路线以及站点mark
     * @param data
     */
    function addLineAndStation(map,data,layerName){
        if(!data||(data&&data.length===0)){
            alert("map.js传入加载公交路线的数据为空！");
            return;
        }
        var routesCode=data.routesCode;
        var geometryStr = data.line;
        if(!geometryStr){
            geometryStr = data.geometryStr;
        }
        if(geometryStr==='null'){
            alert("此公交路线暂无路线数据！");
        }
        var andDown = data.andDown;
        var polylineArray = new Array();
        var polyline = null;
        var arr = geometryStr.split(" ");
        var a;
        for (var i = 0; i < arr.length; i++) {
            a = arr[i].split(",");
            polylineArray.push(new parent.beyond.geometry.MapPoint(a[0], a[1]));
        }
        var obj;
        if(data.rgb){
            obj=new Object();
            obj.rgb=data.rgb;
            obj.png=data.png;
        }
        if(!obj){
            obj=mapcomn.getLineRGB();
        }
        polyline = new parent.beyond.maps.BPolyline({
            points: polylineArray,//点对象数组
            strokeColor: obj.rgb, //线颜色
            strokeOpacity: 0.6, //线透明度
            strokeWeight: 7, //线粗细度
            isZoomTo: false   //居中放大
        });
        var layer1=map.getOverlays(layerName+"_"+routesCode+"_"+andDown+"_line");
        if(layer1&&layer1.length>0){
            return;
        }else{
            var layer1=map.getOverlays("SL_GJLX"+"_"+routesCode+"_"+andDown+"_line");
            if(layer1&&layer1.length>0){
                return;
            }
            var obj1=new Object();
            obj1.name=data.routesName;
            obj1.layerName=layerName;
            obj1.rgb=obj.rgb;
            obj1.andDown=andDown;
            searchResult(obj1);
        }
        map.addOverlay(polyline, layerName+"_"+routesCode+"_"+andDown+"_line");
        map.setExtent(polyline.getExtent());
        /*polyline.addEventListener("click", function (obj, event) {
         alert("点击");
         });*/
        var stations=data.pointArray;
        if(!stations){
            stations = data.busStations;
        }
        if(!stations){
            alert("map.js暂无公交路线站点信息数据！");
            return;
        }
        var stationLayername= layerName+"_"+routesCode+"_"+andDown+"_line_station";
        for (var i = 0; i < stations.length; i++) {
            var stationCode=stations[i].code;
            if(!stationCode){
                stationCode=stations[i].routesCode;
            }
            if(!stationCode){
                stationCode=stations[i].stationCode;
            }
            var where="stationCode="+stationCode+"&andDown="+andDown;
            addMark(map,stations[i],where,stationLayername,obj.png,layerName);
        }
    }
    /**
     * 根据数据添加公交站mark
     * @param data
     */
    function addMark(map,data,where,layerName,png,llayerName){
        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: ctx + "/control/map-search/resource/images/"+png,//图标
            offsetX: 0,
            offsetY: 0,
            data: {
                where: where,
                layerName:llayerName
            }
        });
        marker.setDraggable(false);
        map.addOverlay(marker, layerName);
        marker.addEventListener("click", function (marker) {
            mapcomn.queryDetail(map,"SP_GJZD","marker",where,null,null,marker.getData().layerName);
           /* parent.$(".beyond-info").find(".inf-con-tag").on("click",function(){
                var routesName=$.trim($(mapcomn).html());
                alert(routesName);
                var andDown=data.andDown==="上行"?0:1;
                var where="routesName="+routesName+"&andDown="+andDown;
                mapcomn.stationLineDetail(map,where,"",layerName);
            });*/
            //mapcomn.stationDetail(map,marker.getData().where,"marker","","",layerName);
        });
    }

    var mapcomn = {
        /**
         * poi检索返回图层数据
         * @param layername
         */
        poiLayerSearch:function (map,layer,layername){
            var layerconfig=PoiConfig.poiConfig[layer].config;
            var where = "1=1";
            var listFields = "X,Y,MC";
            if(layer=="SP_WX"){
                listFields="";
            }
            if(layer=="SP_KYZ"){
                where = "XCODE like '%"+parent.window.AppConfig.xcode+"%'";
            }
            if(layer=="SP_GJZD"){
                listFields = "X,Y,MC,ID";
            }

            var detailFields = PoiConfig.poiConfig[layer].list;
            var locateSymbol = {
                icon: ctx+layerconfig.locateIcon,//图标
                offsetX: 0,
                offsetY: 0
            };
            if(layername===layerNameConfig.roadnetwork_jkd||layername===layerNameConfig.roadnetwork_dcsb){
                listFields="X,Y"
                locateSymbol.width=30;
                locateSymbol.height=30;
            }
            var options = {
                "map": map,
                "id": layer,
                "layerName": layer,
                "locateSymbol": locateSymbol,
                "listFields": listFields,
                "detailFields": detailFields,
                "where": where,
                "featureClick": function(marker){
                    mapcomn.featureLocate(marker,layer);
                }

            };
            map.plugin("beyond.maps.FeatureLayer", function () {
                featureLayer = new beyond.maps.FeatureLayer(options);
                map.addOverlay(featureLayer,layername);
            });
        },
        featureLocate:function(marker,layer){
            var data = marker.getData();
            var id = data["GID"]||data["ID"];
            var where = "GID=" + id;
            if(layer==="SP_GJZD"){
                where="ID='" + id+"'";
            }
            featureLayer.queryDetail(function (result) {
                if (result.getReturnFlag() == 1) {
                    var data = result.getData();
                    var html = "";
                    var count = 0;
                    var title;
                    var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                    if(layerConfig==null){
                        return;
                    }
                    var obj = data.list[0];
                    if (data == null || data.list.length == 0) {
                        for (var key in obj) {
                            html += "<div class='row "+layer+"'><span class='title' style='display: inline-block;width: 75px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label + ":" + "</span><span style='margin-left: 10px;color:red' class='content'>"
                                + "暂无数据" + "</span></div>";
                        }
                    } else {
                        var querydata = ""
                        var width = PoiConfig.poiConfigUtil.getShowLabelWidth(layer);
                        layerConfig = layerConfig || {};
                        layerConfig.list = layerConfig.list || "";
                        var keys = layerConfig.list.split(",");
                        for (var k in keys) {
                            var key = keys[k];
                            querydata = obj[key];
                            if(!layerConfig.data[key]||!layerConfig.data[key].label){
                                continue;
                            }
                            count++;
                            if(querydata==null){
                                html += "<div class='row "+ layer +"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                            }else{
                                html += "<div class='row "+layer+ "'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>"
                                    + querydata + "</span></div>";
                            }
                        }
                    }
                    html += '</div>';
                    var infoWindow;
                    if(parent.beyond&&parent.beyond.maps){
                        infoWindow = new parent.beyond.maps.BInfoWindow({
                            title: obj.MC||obj.NAME,
                            content: html,
                            offsetY: 0,
                            offsetX: 0
                        });
                    }else{
                        infoWindow = new beyond.maps.BInfoWindow({
                            title: obj.MC||obj.NAME,
                            content: html,
                            offsetY: 0,
                            offsetX: 10
                        });
                    }
                    if(!cmap){
                        cmap=window.map;
                    }
                    var height = cmap.getExtent().getHeight();
                    var y = marker.getPosition().y + height * 0.2;
                    var x = marker.getPosition().x;
                    cmap.setCenter(new beyond.geometry.MapPoint(x, y));
                    infoWindow.open(cmap, marker.getPosition());

                }
            }, where);

        },
        /**
         * 传入颜色数组随机获取颜色值并返回清除选中了的颜色值
         * @param array
         * @returns {*}
         */
        getLineRGB:function(){
            if(!chooseRGB||(chooseRGB&&chooseRGB.length===0)){
                chooseRGB=lineRGB.slice(0);
            }
            var obj=new Object();
            if(chooseRGB&&chooseRGB.length>0){
                var i=getRandom(0,chooseRGB.length-1);
                obj.rgb=chooseRGB[i];
                obj.png=gjzPNG[obj.rgb];
                chooseRGB.remove(i);
                return obj;
            }
            return null;
        },
        initMap:function(container,options_){
            var options= options_||{
                    center:new beyond.geometry.MapPoint(120.81939680856037,27.955591137305234),
                    zoom:5
                };
            var cmap=new beyond.maps.Map(container||"dituContent",options,function(){});
            $("#navigation").hide();
            return cmap;
        },
        /**
         * 根据参数查询地图详细
         * @param map 地图对象
         * @param layer 图层名称
         * @param marker marker对象
         * @param where 查询条件
         * @param callback 回调函数(用于注册事件)
         * @param data 节点展示数据
         */
        queryDetail:function(map,layer,marker,where,ssfb,callback,data,layerName){
            if(layer=="SP_GJZD"){
                mapcomn.stationDetail(map,where,marker,callback,data,layerName);
            }else if(layer=="SL_GJLX"){
                mapcomn.stationLineDetail(map,where,callback,data);
            }else if(layer=="SP_ZXCKJKH"){
                mapcomn.bicycleKejiekehuanDetail(map,layer,marker,where);
            }else{
                mapcomn.poiDetail(map,layer,marker,where,ssfb);
            }
        },
        /**
         * 通用poi查询详细，杨益汉
         * @param map
         * @param type
         * @param where
         */
        poiDetail:function(cmap,layer,m,where,ssfb){
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
                if("ssfb"==ssfb){
                    featureQuery = new beyond.maps.FeatureQuery(options);
                }else{
                    featureQuery = new parent.beyond.maps.FeatureQuery(options);
                }
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
                                for(var key in obj){
                                    querydata = obj[key];

                                    if(!layerConfig.data[key]||!layerConfig.data[key].label){
                                        continue;
                                    }
                                    count++;
                                    if(querydata==null){
                                        html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                                    }else{
                                        html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>"
                                        + querydata + "</span></div>";
                                    }
                                }
                            }

                        }
                        html = '<div class="detailInfo">' + html;
                        html += '</div>';
                        if("ssfb"==ssfb){
                            var infoWindow = new beyond.maps.BInfoWindow({
                                title:obj.MC,
                                content: html,
                                offsetY: 24,
                                offsetX: -1
                            });
                        }else{
                            var infoWindow = new parent.beyond.maps.BInfoWindow({
                                title:obj.MC,
                                content: html,
                                offsetY: 0,
                                offsetX: 0
                            });
                        }
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

                    }
                }, where);
            });
        },
        /**
         * 自行车可借可还查询详细
         */
        bicycleKejiekehuanDetail:function(cmap,layer,m,where){
            var param=JSON.parse(where);
            cmap.plugin("beyond.maps.ClassBreakInfo",function(){
                $.ajax({
                    url: ctx + "/rest/bike/getBicycleStationInfo?Id="+param.id,
                    type: "post",
                    success: function (success) {
                        var data=success.data;
                        var html="";
                        var count = 0;
                        var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                        var obj= data ? data[0] : {};
                        if (!data) {
                            html +="<div class='row "+layer+"'><span style='margin-right: 15px;color:red' class='content'>"+ "暂无数据" + "</span></div>";
                        } else {
                            var querydata = ""
                            var width = PoiConfig.poiConfigUtil.getShowLabelWidth(layer);
                            //var list=layerConfig.data;

                            layerConfig = layerConfig || {};
                            layerConfig.list = layerConfig.list || "";
                            var keys = layerConfig.list.split(",");
                            for (var k in keys) {
                                var key = keys[k];
                                querydata = obj[key];
                                if(!layerConfig.data[key]||!layerConfig.data[key].label){
                                    continue;
                                }
                                count++;
                                if(querydata==null){
                                    html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                                }else{
                                    html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>"
                                    + querydata + "</span></div>";
                                }
                            }


                            //for (var key in obj) {
                            //    querydata = obj[key];
                            //    if(!layerConfig.data[key]||!layerConfig.data[key].label){
                            //        continue;
                            //    }
                            //    count++;
                            //    if(querydata==null){
                            //        html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                            //    }else{
                            //        html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>"
                            //            + querydata + "</span></div>";
                            //    }
                            //}
                        }
                        html = '<div class="detailInfo">' + html;
                        html += '</div>';
                        var infoWindow;
                        if(!parent.beyond){
                            infoWindow = new beyond.maps.BInfoWindow({
                                title:obj.name,
                                content: html,
                                offsetY: 8,
                                offsetX: -1
                            });
                        }else{
                            infoWindow = new parent.beyond.maps.BInfoWindow({
                                title:obj.name,
                                content: html,
                                offsetY: 0,
                                offsetX: 0
                            });
                        }
                        var height = cmap.getExtent().getHeight();
                        var y = m.getPosition().y + height*0.2;
                        var x = m.getPosition().x;
                        cmap.setCenter(new beyond.geometry.MapPoint(x, y));
                        infoWindow.open(cmap, m.getPosition());
                    }
                });
            });
        },
        /**
         * 公交站查询详细
         * @param map 地图对象
         * @param where 查询条件
         * @param m marker对象
         * @param callback 回调函数，用于注册marker点击事件
         * @param data 数据
         * @param layerName 图层名称
         */
        stationDetail:function(map,where,m,callback,data,layerName){
            var array;
            if(where){
                array=mapcomn.whereToObj(where);
                map.plugin("beyond.data.BusService", function () {
                    var busService = new parent.beyond.data.BusService();
                    busService.listBusRotesByStation(function (result) {
                        if(result.getData().list&&result.getData().list.length>0){
                            /*map.clearInfoWindow();*/
                            var obj=result.getData().list[0];
                            var items="";
                            var array=obj.stationName.split(",");
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
                                    items+=tjgjlxItem
                                        .replace("{{stationName}}",array[i]);
                                }
                            }
                            var content=tjgjlx
                                .replace("{{andDown}}",obj.andDown)
                                .replace("{{content}}",items);
                            var infoWindow = new parent.beyond.maps.BInfoWindow({
                                title:obj.routesName+"公交站",
                                content: content,
                                offsetY: 0,
                                offsetX: 0
                            });
                            var marker = new beyond.maps.Marker({
                                position:new beyond.geometry.MapPoint(parseFloat(obj.x), parseFloat(obj.y)),//位置
                                icon: ctx+"/control/map-search/resource/images/GJZ_1.png",//图标
                                offsetX: 0,
                                offsetY: 0
                            });
                            if(!m){
                                map.addOverlay(marker, layerName);
                                marker.addEventListener("click", function (marker) {
                                    infoWindow.open(map, new beyond.geometry.MapPoint(parseFloat(obj.x), parseFloat(obj.y)));
                                });
                            }
                            var height = map.getExtent().getHeight();
                            var y = parseFloat(obj.y) + height*0.2;
                            var x = parseFloat(obj.x);
                            map.setCenter(new beyond.geometry.MapPoint(x, y));
                            infoWindow.open(map,new beyond.geometry.MapPoint(parseFloat(obj.x), parseFloat(obj.y)));
                            parent.$(".beyond-info").find(".inf-con-tag").on("click",function(){
                                var routesName=$.trim($(this).html());
                                var andDown=$.trim($(this).parent().attr("andDown"))||0;
                                var where="routesName="+routesName+"&andDown="+andDown;
                                var layerName=encodeURIComponent(encodeURIComponent(routesName));
                                mapcomn.stationLineDetail(map,where,"",layerName);
                            });
                        }
                    },array);
                });
            }
            if(data){
                mapcomn.stationAddMarkAndInfo(map,m,data,callback,layerName);
            }
        },
        /**
         * 加载公交站点mark及打开公交站点详细信息
         * @param map地图对象
         * @param m 如果不为空就不新建marker
         * @param data 传入数据
         * 数据格式为：
         * var data={
     *   x:x,
     *   y:y,
     *   rnames:array,
     *   sname:name
   	 *	 };
         *@param callback 回调函数用于infowindow中注册点击事件
         *@param layerName 图层名称拥有添加marker命名
         *
         */
        stationAddMarkAndInfo:function(map,m,data,callback,layerName){
            var array;
            var nodes="";
            var stationName;
            var x;
            var y;
            var height;
            var title;
            if(data.stationName){
                array=data.stationName.split(",");
            }
            if(!array&&data.rnames){
                array=data.rnames;
            }
            /**遍历设置marker点击显示文本中途经公交路线buttion的宽度*/
            for(var i=0;i<array.length;i++){
                if(array[i].length>4&&array[i].length<25){
                    nodes+=$("#result-bus-busmap-station-infowindow-content-item").html()
                        .replace("{{stationName}}",array[i]);
                }else if(array[i].length>25){
                    var item=array[i].substring(0,20)+"...";
                    var style="style='width:280px;'";
                    nodes+="<div class='inf-con-tag'"+style+">"+item+"</div>";
                }
            }
            var content=$("#result-bus-busmap-station-infowindow-content").html()
                .replace("{{content}}",nodes);
            if(data.routesName){
                stationName=data.routesName;
            }
            if(!stationName&&data.sname){
                stationName=data.sname
            }
            if(data.andDown){
                title=stationName+"公交站"+"&nbsp;<span class='route-title-tag'>"+data.andDown+"</span>";
            }else{
                title=stationName+"公交站";
            }
            var infoWindow = new parent.beyond.maps.BInfoWindow({
                title:title,
                content: content,
                offsetY: 0,
                offsetX: 0
            });
            /**如果marker不为空则生成marker图标并注册点击事件*/
            if(!m){
                var marker = new beyond.maps.Marker({
                    position:new beyond.geometry.MapPoint(data.x, data.y),//位置
                    icon: ctx+ "/control/map-search/resource/images/GJZ_1.png",//图标
                    offsetX:0,
                    offsetY:0
                });
                marker.setDraggable(false);
                map.addOverlay(marker, layerName);
                marker.addEventListener("click", function (marker) {
                    infoWindow.open(map, new beyond.geometry.MapPoint(x, y));
                });
            }
            if(data.x){
                x=data.x;
            }
            if(data.y){
                y=data.y;
            }
            height = map.getExtent().getHeight();
            map.setCenter(new beyond.geometry.MapPoint(x, y));
            /*infoWindow.open(map, new beyond.geometry.MapPoint(x, y));*/
            parent.$(".beyond-info").find(".inf-con-tag").on("click",function(){
                var routesName=$.trim($(mapcomn).html());
                var andDown=data.andDown==="上行"?0:1;
                var where="routesName="+routesName+"&andDown="+andDown;
                mapcomn.stationLineDetail(map,where,"",layerName);
            });
        },
        /**
         * 公交线路查询详细
         * @param map
         * @param where
         */
        stationLineDetail:function(map,where,data,layerName){
            if(where) {
                var array=mapcomn.whereToObj(where);
                map.plugin("beyond.data.BusService", function () {
                    var busService = new parent.beyond.data.BusService();
                    busService.listBusRotesAndStation(function(result){
                        if(result.getData().list&&result.getData().list.length>0) {
                            var data = result.getData().list[0];
                            addLineAndStation(map,data, layerName);
                        }
                    },array);
                });
            }else if(data){
                addLineAndStation(map,data, layerName);
            }
        },
        /**
         * where条件转换为array对象
         * @param where
         */
        whereToObj:function(where){
            var wheres=where.split("&");
            var array={};
            if(wheres&&wheres.length>0){
                for(var i=0;i<wheres.length;i++){
                    var arr=wheres[i].split("=");
                    array[arr[0]]=arr[1];
                }
            }
            return array;
        },
        setLayerVisible: function (map, layername, visible, where, ssfb,locateSymbol) {
            if (!map || !layername ) {
                return;
            }
            var listFields = "";
            if (!locateSymbol) {
                locateSymbol = PoiConfig.poiConfigUtil.getLayerLocateSymbol(layername);

            }
            var featureLayer;
            if (beyond.maps.FeatureLayer) {
                //featureLayer = map.getOverlaysByType(layername + "_layercontrol", beyond.maps.FeatureLayer);
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
                    "id": layername,
                    "layerName": layername,
                    "locateSymbol": locateSymbol,
                    "listFields": listFields,
                    "where": where,
                    "featureClick": function (marker) {
                        var data = marker.getData();
                        if (data && data["GID"]) {
                            var where = "GID=" + data["GID"];
                            mapcomn.queryDetail(map, layername, marker, where,ssfb);
                        }

                    }
                };
                map.plugin("beyond.maps.FeatureLayer", function () {
                    var featureLayer2 = new beyond.maps.FeatureLayer(options);
                    map.addOverlay(featureLayer2, layername + "_layercontrol");
                });
            }
        },
        //专题图控制，杨益汉补充
        setTopicLayerVisible: function (map, layername, visible) {
            if(!map||!layername){
                return;
            }
            var layers = map.getOverlays(layername);
            var legendData = mapcomn.getLayerLegend(layername);
            if(visible){
                if(layers!=null&&layers.length>0){
                    map.showOverlays(layername);
                }else{
                    mapcomn.addTopicLayer_(map,layername);
                }
                if(legendData!=null){
                    addLegend(legendData);
                }
            }else{
                map.hideOverlays(layername);
                map.clearInfoWindow();
                removeLegend(layername);
            }

        },
        addTopicLayer_:function(map, layername){
            if(layername==layerNameConfig.bicycle_gjzd_name){
                mapcomn.addBicycleLayer_(map);
            }else if(layername==layerNameConfig.bicycle_kejiekehuan_name){
                mapcomn.addBicycleLayer_kejiekehuan(map,layername);
            }else if(layername==layerNameConfig.bus_cluster_name){
                map.plugin("beyond.maps.BCarClusterMarker", function () {

                    var options = {};

                    //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
                    options.industry = 1;
                    options.scode = null;
                    options.xcode = null;
                    var markerClusterer = new beyond.maps.BCarClusterMarker(options);
                    markerClusterer.getSingleMarker = function (car) {

                        var html = '<div class="chepai">' + car["plateNo"] + '</div>';


                        var text = new beyond.maps.BComplexText({
                            "text": car["plateNo"],
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
                        var angle = car["direction"];
                        var marker = new beyond.maps.Marker({
                            position: new beyond.geometry.MapPoint(car["X"], car["Y"]),//位置
                            icon: ctx+"/control/map-search/resource/images/bus.png",//图标
                            angle: angle,
                            offsetX: 0,
                            offsetY: 0,
                            btext: text,
                            data:car
                        });
                        marker.addEventListener("click", function (m) {
                            var data =  m.getData();
                            var html =  '<div class="detailInfo">';
                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "车牌号："+" </span><span style='margin-left: 10px;'>";
                            html += data["plateNo"];
                            html +="</span></div>";

                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "公交路线："+" </span><span style='margin-left: 10px;'>";
                            html += !data["line"]?"<span style='color: red;'>暂无数据</span>":data["line"];
                            html +="</span></div>";

                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "速度："+" </span><span style='margin-left: 10px;'>";
                            html += data["gpsSpeed"]+"公里/小时";
                            html +="</span></div>";

                            if(data["posTime"]!=null&&data["posTime"].date!=null){
                                html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                                html += "时间："+" </span><span style='margin-left: 10px;'>";
                                html += getFormatDate(data["posTime"]);
                                html +="</span></div>";
                            }

                            html +="</div>";

                            var infoWindow = new parent.beyond.maps.BInfoWindow({
                                title:data["plateNo"],
                                content: html,
                                offsetY: 0,
                                offsetX: 0
                            });
                            infoWindow.open(map,m.getPosition());
                        });

                        return marker;
                    };
                    map.addOverlay(markerClusterer,layername);
                });
            }else if(layername==layerNameConfig.taxi_cluster_name){
                map.plugin("beyond.maps.BCarClusterMarker", function () {
                    var options = {};

                    //参数为行业类型，0:全行业，1:DANGEROUS、2:PASSAGER、3:TAXI、4:公交、5:教练车，后续如有其它再依此增加
                    options.industry = 2;
                    options.scode = null;
                    options.xcode = null;
                    var markerClusterer = new beyond.maps.BCarClusterMarker(options);
                    markerClusterer.getSingleMarker = function (car) {
                        var html = '<div class="chepai">' + car["NO"] + '</div>';
                        //var text = new beyond.maps.BText({"htmlText":html,"offsetX":-34,"offsetY":-17});
                        var text = new beyond.maps.BComplexText({
                            "text": car["NO"],
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
                        var angle = car["DIRECTION"];
                        var taxiIcon="car_blue.png";
                        var taxiState="重车";
                        if(car["vehicleState"]===0) {
                            taxiIcon = "car_orange.png";
                            taxiState = "空车";
                        }else if(car["vehicleState"]===2){
                            taxiIcon = "car_orange.png";
                            taxiState = "掉线";
                        }
                        car.taxiState=taxiState;
                        var marker = new beyond.maps.Marker({
                            position: new beyond.geometry.MapPoint(car["X"], car["Y"]),//位置
                            icon: ctx+"/map/taxi/resource/imgs/icon/"+taxiIcon,//图标
                            width: 12,//宽度
                            height: 22,//高度
                            angle: angle,
                            offsetX: 0,
                            offsetY: 0,
                            btext: text,
                            data:car
                        });
                        //出租车地图上功能汇报有一点要求： 空重车颜色进行区分、点击单车可以看到车牌号、空载状态、速度等信息，今天必须要改掉

                        marker.addEventListener("click", function (m) {
                            var data = m.getData();
                            var state="<span style='color: red;'>暂无数据</span>";

                            var html = '<div class="detailInfo">';
                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "车牌号：" + " </span><span style='margin-left: 10px;'>";
                            html += data["plateNo"];
                            html += "</span></div>";

                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "空载状态：" + " </span><span style='margin-left: 10px;'>";
                            html += !data["taxiState"] ? "<span style='color: red;'>暂无数据</span>" : data["taxiState"];
                            html += "</span></div>";

                            html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                            html += "速度：" + " </span><span style='margin-left: 10px;'>";
                            html += data["gpsSpeed"] + "公里/小时";
                            html += "</span></div>";

                            if (data["posTime"] != null && data["posTime"].date != null) {
                                html += "<div class='row'><span class='' style='display: inline-block;width: 70px;font-weight:bold;text-align: right'>";
                                html += "时间：" + " </span><span style='margin-left: 10px;'>";
                                html += getFormatDate(data["posTime"]);
                                html += "</span></div>";
                            }

                            html += "</div>";

                            var infoWindow = new parent.beyond.maps.BInfoWindow({
                                title: data["plateNo"],
                                content: html,
                                offsetY: 0,
                                offsetX: 0
                            });
                            infoWindow.open(map, m.getPosition());
                        });
                        return marker;
                    };
                    map.addOverlay(markerClusterer,layername);
                });
            }else if(layername==layerNameConfig.gjzd_300_name){
                map.plugin("beyond.maps.BHeatMapLayer", function () {
                    var heatMapLayer = new beyond.maps.BFeatureHeatMapLayer({
                        "layerName": "SP_GJZD",
                        "defaultValue":1,
                        "radius":300,
                        "unit":Units.METERS,
                        "isZoomTo": true
                    });
                    heatMapLayer.setMinLevel(0);
                    heatMapLayer.setMaxLevel(19);
                    map.addOverlay(heatMapLayer,layername);
                });
            }else if(layername==layerNameConfig.gjzd_500_name){
                map.plugin("beyond.maps.BHeatMapLayer", function () {
                    var heatMapLayer = new beyond.maps.BFeatureHeatMapLayer({
                        "layerName": "SP_GJZD",
                        "defaultValue":1,
                        "radius":500,
                        "unit":Units.METERS,
                        "isZoomTo": true
                    });
                    heatMapLayer.setMinLevel(0);
                    heatMapLayer.setMaxLevel(19);
                    map.addOverlay(heatMapLayer,layername);
                });
            }else if(layername===layerNameConfig.highspeed_tc){
                gethighspeedData(function(jsonData){
                    map.removeOverlay(layername);
                    var features=jsonData.features;
                    for(var i=0;i<features.length;i++){
                        var points=features[i].geometry.points;
                        var polyline=new Array();
                        for(var j=0;j<points.length;j++){
                            polyline.push(new parent.beyond.geometry.MapPoint(points[j].x, points[j].y));
                        }
                        var lineColor=getRgb(features[i].fieldValues[13]);
                        var polyline = new parent.beyond.maps.BPolyline({
                            points: polyline,//点对象数组
                            strokeColor: lineColor, //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 3.1, //线粗细度
                            isZoomTo: false   //居中放大
                        });
                        map.addOverlay(polyline,layername);
                    }
                    if(!highspeedInterval){
                        startInterval(map,layername);
                    }
                });
            }else if(layername===layerNameConfig.highspeed_sfz){
                var where = "MC like '%收费站%' and XCODE like '%3303%'";
                var listFields = "X,Y,MC";
                var detailFields = "*";
                var locateSymbol = {
                    icon: ctx+"/map/poi/resource/imgs/SFZ.png",//图标
                    offsetX: 0,
                    offsetY: 0
                };
                var options = {
                    "map": map,
                    "id": "SP_SFZ",
                    "layerName": "SP_SFZ",
                    "locateSymbol": locateSymbol,
                    "listFields": listFields,
                    "detailFields": detailFields,
                    "where": where,
                    "featureClick": featureLocate11

                };
                map.plugin("beyond.maps.FeatureLayer", function () {
                    featureLayer = new beyond.maps.FeatureLayer(options);
                    map.addOverlay(featureLayer,layername);
                });
            }else if(layername===layerNameConfig.roadnetwork_jyz){
                mapcomn.poiLayerSearch(map,"SP_JYZ",layername);
            }else if(layername===layerNameConfig.roadnetwork_sd){
                mapcomn.poiLayerSearch(map,"SP_SD",layername);
            }else if(layername===layerNameConfig.roadnetwork_fwq){
                mapcomn.poiLayerSearch(map,"SP_FWQ",layername);
            }else if(layername===layerNameConfig.roadnetwork_sfz){
                mapcomn.poiLayerSearch(map,"SP_SFZ",layername);
            }else if(layername===layerNameConfig.roadnetwork_zcz){
                mapcomn.poiLayerSearch(map,"SP_ZCZ",layername);
            }else if(layername===layerNameConfig.other_wx){
                mapcomn.poiLayerSearch(map,"SP_WX",layername);
            }else if(layername===layerNameConfig.other_ph){
                mapcomn.poiLayerSearch(map,"SP_PH",layername);
            }else if(layername===layerNameConfig.other_jp){
                mapcomn.poiLayerSearch(map,"SP_JX",layername);
            }else if(layername===layerNameConfig.other_whtc){
                mapcomn.poiLayerSearch(map,"SP_WHTCC",layername);
            }else if(layername===layerNameConfig.other_kyz){
                mapcomn.poiLayerSearch(map,"SP_KYZ",layername);
            }else if(layername===layerNameConfig.gjzd_gjzd){
                mapcomn.poiLayerSearch(map,"SP_GJZD",layername);
            }else if(layername===layerNameConfig.bicycle_biczd){
                mapcomn.poiLayerSearch(map,"SP_ZXCTKD",layername);
            }
            //SP_ZXCTKD
        },
        addBicycleLayer_: function (map) {
            var layername = layerNameConfig.bicycle_gjzd_name;
            map.plugin("beyond.maps.ClassBreakInfo", function () {
                var classBreaks = [];
                var classBreak = new beyond.maps.ClassBreakInfo({
                    icon: ctx+"/control/map-search/resource/images/4.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    minValue: 0,
                    maxValue: 200
                });
                classBreaks.push(classBreak);

                classBreak = new beyond.maps.ClassBreakInfo({
                    icon: ctx+"/control/map-search/resource/images/5.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    minValue: 201,
                    maxValue: 500
                });
                classBreaks.push(classBreak);

                classBreak = new beyond.maps.ClassBreakInfo({
                    icon: ctx+"/control/map-search/resource/images/6.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    minValue: 501,
                    maxValue: 1000
                });
                classBreaks.push(classBreak);

                classBreak = new beyond.maps.ClassBreakInfo({
                    icon: ctx+"/control/map-search/resource/images/7.png",//图标
                    offsetX: 0,
                    offsetY: 0,
                    minValue: 1001,
                    maxValue: 1000000
                });
                classBreaks.push(classBreak);

                var classBreakLayer = new beyond.maps.FeatureClassBreaksLayer({
                    "layerName": "SP_ZXCTKD",
                    "valueField":"DZJGJZJL",
                    "listFields":"GID,DZJGJZJL,ID",
                    "classBreaks": classBreaks,
                    "isZoomTo": false,
                    "featureClick":function (marker){
                        var data = marker.getData();
                        var obj=new Object();
                        obj.id=data.ID;
                        var where  = JSON.stringify(obj);
                        mapcomn.queryDetail(map,"SP_ZXCKJKH",marker,where);
                    }
                });
                map.addOverlay(classBreakLayer,layername);
            });
        },
        addBicycleLayer_kejiekehuan:function(map,layername){
            map.plugin("beyond.maps.ClassBreakInfo",function(){
                $.ajax({
                    url:ctx+"/rest/bike/getAllBicycleStationInfo",
                    type:"post",
                    data:{
                        xcode:window.AppConfig.xcode
                    },
                    timeout : 10000,
                    success:function(success){
                        var classBreaks = [];
                        var classBreak = new beyond.maps.ClassBreakInfo({
                            icon: ctx+"/control/map-search/resource/images/bicycle2.png",//图标
                            offsetX: 0,
                            offsetY: 0,
                            minValue: 0,
                            maxValue: 0
                        });
                        classBreaks.push(classBreak);

                        classBreak = new beyond.maps.ClassBreakInfo({
                            icon: ctx+"/control/map-search/resource/images/bicycle3.png",//图标
                            offsetX: 0,
                            offsetY: 0,
                            minValue: 1,
                            maxValue: 50
                        });
                        classBreaks.push(classBreak);

                        classBreak = new beyond.maps.ClassBreakInfo({
                            icon: ctx+"/control/map-search/resource/images/bicycle4.png",//图标
                            offsetX: 0,
                            offsetY: 0,
                            minValue: 51,
                            maxValue: 100
                        });
                        classBreaks.push(classBreak);

                        var data=success.data;
                        if(!data){
                            alert("抱歉暂无自行车可借可还数据！");
                            return;
                        }
                        var classBreakLayer = new beyond.maps.FeatureClassBreaksLayer({
                            "layerName": layername,
                            "classBreaks": classBreaks,
                            "valueField":"availbikeRate",
                            "listFields":"id,availbikeRate",
                            "data": data,
                            "isZoomTo": false,
                            "featureClick":function (marker){
                                var data = marker.getData();
                                //var where  = JSON.stringify(data);
                                //mapcomn.queryDetail(map,"SP_ZXCKJKH",marker,where);
                                var html = "";
                                var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig("SP_ZXCKJKH");
                                if(layerConfig==null){
                                    return;
                                }

                                var count = 0;
                                if (data == null) {
                                    //html += "<div class='row "+layer+"'><span class='title' style='display: inline-block;width: 75px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label + ":" + "</span><span style='margin-left: 10px;color:red' class='content'>"
                                    //    + "暂无数据" + "</span></div>";
                                    html += "<div class='row "+layer+"'><span class='title' style='display: inline-block;width: 75px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label + ":" + "</span><span style='margin-left: 10px;color:red' class='content'>"
                                        + "暂无数据" + "</span></div>";

                                } else {
                                    var querydata = ""
                                    var width = PoiConfig.poiConfigUtil.getShowLabelWidth("SP_ZXCKJKH");
                                    for (var key in data) {
                                        querydata = data[key];
                                        if(!layerConfig.data[key]||!layerConfig.data[key].label){
                                            continue;
                                        }
                                        count++;
                                        if(querydata==null){
                                            html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>暂无数据</span></div>";
                                        }else{
                                            html += "<div class='row "+layer+"'><span class='' style='display: inline-block;width: "+width+"px;font-weight:bold;text-align: right'>" + layerConfig.data[key].label  + ":" + " </span><span style='margin-left: 10px;'>"
                                                + querydata + "</span></div>";
                                        }
                                    }
                                }
                                html = '<div class="detailInfo">' + html;
                                html += '</div>';
                                    var infoWindow = new beyond.maps.BInfoWindow({
                                        title:data.name,
                                        content: html,
                                        offsetY: 0,
                                        offsetX: 0
                                    });

                                if(marker == ""||marker == null){
                                    var point;
                                    if(data.X!=null&&data.Y!=null){
                                        point = new beyond.geometry.MapPoint(data.X, data.Y);
                                    }else{
                                        point = beyond.maps.GeometryUtil.parseGeometry(data.geometryStr);
                                    }
                                    marker = new beyond.maps.Marker({
                                        position:point,//位置
                                        /*icon:"",//图标
                                         width:20,//宽度
                                         height:34,//高度
                                         editEnable:true,*/
                                        offsetX:0,
                                        offsetY:0
                                    });
                                    /*map.addOverlay(m, );*/
                                }
                                var height = map.getExtent().getHeight();
                                var y = marker.getPosition().y + height*0.2;
                                var x = marker.getPosition().x;
                                map.setCenter(new beyond.geometry.MapPoint(x, y));
                                infoWindow.open(map, marker.getPosition());
                            }
                        });
                        map.addOverlay(classBreakLayer,layername);
                    }
                });
            });
        },
        //瓦片地图控制，，杨益汉补充，类似路况
        setTileLayerVisible: function (map, layername, visible,index) {
            if(!map||!layername){
                return;
            }
            var legendData = mapcomn.getLayerLegend(layername);
            if(visible){
                map.addTileLayer(layername,index);
                if(legendData!=null){
                    addLegend(legendData);
                }
            }else{
                map.hideTileLayer(layername);
                removeLegend(layername);
            }
        },
        /*spatialQuery:function(rings,layers,pageSize,beginRecord){
         if(!rings){
         return;
         }
         var searchService = new beyond.data.SearchService();
         var queryVo = new Object();
         queryVo.pageSize = pageSize||10;
         queryVo.beginRecord = beginRecord||1;
         queryVo.needGeometry = true;
         queryVo.rings = rings;
         searchService.fullSearch(showResult, queryVo);
         },*/
        getLayerLegend:function(layername){
            var data = null;
            if(layername== layerNameConfig.gjxl_rlt_name){
                data = {
                    layername : layername,
                    title:"公交线热力图",
                    legends:[
                        {
                            color:"#279300",
                            text:"0-7",
                            width:"100"
                        },
                        {
                            color:"#EFDC00",
                            text:"8-15",
                            width:"100"
                        },
                        {
                            color:"#F30A80",
                            text:"16-21",
                            width:"100"
                        },
                        {
                            color:"#930013",
                            text:"22-28",
                            width:"100"

                        },
                        {
                            color:"#ff0000",
                            text:"29-",
                            width:"80"

                        }
                    ]
                };
                return data;
            }else if(layername== layerNameConfig.bicycle_gjzd_name){
                data = {
                    layername : layername,
                    title:"公交站换乘距离(米)",
                    legends:[
                        {
                            color:"#4cca5e",
                            text:"0-200",
                            width:"100"
                        },
                        {
                            color:"#3cc9ba",
                            text:"201-500",
                            width:"100"
                        },
                        {
                            color:"#008aea",
                            text:"501-1000",
                            width:"100"
                        },
                        {
                            color:"#3965e4",
                            text:"1000-",
                            width:"100"

                        }
                    ]
                };
                return data;
            }else if(layername==layerNameConfig.bicycle_kejiekehuan_name){
                data = {
                    layername : layername,
                    title:"可借车辆",
                    legends:[
                        {
                            color:"#f06b30",
                            text:"0%",
                            width:"100"
                        },
                        {
                            color:"#ff00ff"/*"#ef3f3f"*/,
                            text:"1-50%",
                            width:"100"
                        },
                        {
                            color:"#980000"/*"#b456cc"*/,
                            text:"51-100%",
                            width:"100"
                        }
                    ]
                };
                return data;
            }
            else if(layername== layerNameConfig.gjzd_rlt_name){
                data = {
                    layername : layername,
                    title:"公交站点热力图",
                    legends:[
                        {
                            color:"#279300",
                            text:"0-6",
                            width:"100"
                        },
                        {
                            color:"#EFDC00",
                            text:"6-15",
                            width:"100"
                        },
                        {
                            color:"#F30A80",
                            text:"15-",
                            width:"100"
                        }
                    ]
                };
                return data;
            }else if(layername==layerNameConfig.highspeed_tc){
                data = {
                    layername : layername,
                    title:"高速平均拥堵度",
                    legends:[
                        {
                            color:"#b456cc",
                            text:"阻塞",
                            width:"100"
                        },
                        {
                            color:"#ec2e2e",
                            text:"拥挤",
                            width:"100"
                        },
                        {
                            color:"#f06b30",
                            text:"一般",
                            width:"100"
                        },
                        {
                            color:"#f2a621",
                            text:"基本通畅",
                            width:"100"
                        },
                        {
                            color:"#4cca5e",
                            text:"非常通畅",
                            width:"100"
                        }
                    ]
                };
                return data;
            }

        }
    };
    function getFormatDate(date,f) {
        if(!f){
            f = "yyyy-MM-dd HH:mm:ss";
        }
        if(date!=null){
            var t = {
                "y+" : date.year+1900,
                "M+" : date.month+1,
                "d+" : date.date,
                "H+" : date.hours,
                "m+" : date.minutes,
                "s+" : date.seconds,
                "S+" : 0
            };
            var _t;
            for(var k in t){
                while(new RegExp("(" + k + ")").test(f)){
                    _t = (RegExp.$1.length == 1) ? t[k] :
                        ("0000000000".substring(0, RegExp.$1.length) + t[k]).substr(("" + t[k]).length);
                    f = f.replace(RegExp.$1, _t + "");
                }
            }
            return f;

        }

    }
    function getDecimalLenFromDouble(obj, len) {
        var str = ""+obj;
        var tempStr;
        var  temp = str.indexOf(".");
        if (temp > -1 && str.length > temp + len) {
            tempStr = str.substring(0, temp + len + 1);
        }
        else {
            tempStr = str;
        }
        return parseFloat(tempStr);
    }


    function addLegend(data){
        var legendLayerName = $("#map-legend-box").find(".bmap-legend[layername="+ data.layername +"]");
        if(legendLayerName.length > 0){
            return;
        }

        var itemHtml =  '<span style="{{ITEMSTYLE}}">{{TEXT}}</span>'
        var items  = "";
        var styles = "";
        for(var i=0;i<data.legends.length;i++){
            if(data.legends[i].color){
                styles += "background-color:" + data.legends[i].color +";"
            }
            if(data.legends[i].width){
                styles += "width:" + data.legends[i].width +";"
            }
            items += itemHtml.replace("\{\{ITEMSTYLE\}\}",styles).replace("\{\{TEXT\}\}",data.legends[i]["text"]);
        }

        var html =  '<div class="bmap-legend" layername="' + data.layername +'">'
            + '<div class="colour">'
            + '<span class="bmap-legend-header">'+ data.title +'</span>'
            + '<div class="bmap-legend-items">'+ items +'</div>'
            + '<i class="bmap-legend-close fa fa-times"></i>'
            + '</div>'
            + '</div>';

        var $item = $(html);
        $item.find(".bmap-legend-close").click(function(){
            $(this).closest(".bmap-legend").remove();
        });
        $("#map-legend-box").append($item);
    }


    function removeLegend(layername){
        $("#map-legend-box").find(".bmap-legend[layername="+ layername+"]").remove();
    }



    return {
        getFormatDate:getFormatDate,
        getDecimalLenFromDouble:getDecimalLenFromDouble,
        getLayerLegend:mapcomn.getLayerLegend,
        setTileLayerVisible:mapcomn.setTileLayerVisible,
        setTopicLayerVisible:mapcomn.setTopicLayerVisible,
        setLayerVisible:mapcomn.setLayerVisible,
        whereToObj:mapcomn.whereToObj,
        stationLineDetail:mapcomn.stationLineDetail,
        stationAddMarkAndInfo:mapcomn.stationAddMarkAndInfo,
        stationDetail:mapcomn.stationDetail,
        bicycleKejiekehuanDetail:mapcomn.bicycleKejiekehuanDetail,
        poiDetail:mapcomn.poiDetail,
        queryDetail:mapcomn.queryDetail,
        getLineRGB:mapcomn.getLineRGB,
        featureLocate:mapcomn.featureLocate,
        poiLayerSearch:mapcomn.poiLayerSearch,
        addMark:addMark,
        addLineAndStation:addLineAndStation,
        searchResult:searchResult,
        openInfoWindow:openInfoWindow,
        featureLocate11:featureLocate11,
        pasthroughputChartDate1:pasthroughputChartDate1,
        layerNameConfig:layerNameConfig
    };


});