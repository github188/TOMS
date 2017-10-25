/**
 * Created by mac-pc on 16/7/18.
 */
define([
    'jquery',
    '../remind/remind',
    '../search/search',
    '../config/poiconfig',
    'text!../../template/mapSearchTemplate.html',
    '../utils/searchUtils',
    '../utils/routesUtils',
    'tocc-toms/common/BaseView',
    'bmap',
    'map_utils',
    'log',
    'css!control/map-search/resource/css/mapSearch.css'
],function($,
           Remind,
           Search,
           PoiConfig,
           MapSearchTemplate,
           searchUtils,
           RoutesUtils,
           BaseView, bmap,mapUtils,Log) {
    var that;
    var ctx = window.AppConfig.RemoteApiUrl;
    var view = BaseView.extend({
        events: {
            "click .rec-clearhis":"clearHistory",
            "focus .search-panel-inp":"searchTextFocus",
            "keyup .search-panel-inp":"searchTextKeyUp",
            "click .search-panel-ico":"searchButtonClick",
            "click .history-items":"historyItemClick",
            "click .search-remind":"remindClick"
        },
        init: function() {
            that=this;
            that._templateFn(MapSearchTemplate);
        },
        render: function(options) {
            that=this;
            that.$map=options.map;
            that.$el=options.container;
            window.map=options.map;
            that.init();
            $(that.$el).append(that.mapSearchContentTemplate(options));
            that.initUI();
            that.jqueryEvent();
        },
        initUI:function(){
            //dom节点加载完毕调用
            $('#tab').wyTabview({
                navMode:"button",
                remove:function(e,d){
                    that.$map.clearInfoWindow()
                    var layer = d.data.name
                    if(layer==="SL_GJLX"|| d.data.type===1){
                        that.$map.removeOverlayByRegexp("^"+layer);
                    }else{
                        that.$map.removeOverlay(layer);
                    }
                    if(d.tabNumber==1){
                        var active = $(".result-panel-bottom").attr("active");
                        if(active == "0"){
                            $(".result-panel-bottom").click();
                            $(".search-result").hide();
                        }
                    }
                }
            });
        },
        jqueryEvent:function(){
            //注册
            Search.event();
            document.onclick = function(event){
                var e = event || window.event;
                var elem = e.srcElement || e.target;
                while(elem)
                {
                    if(elem.className == "hasDrop"){
                        return;
                    }
                    if(!$(".search-rec").is(":hidden")){
                        if($(elem).attr("id") == "search-base"){
                            return;
                        }
                    }
                    elem = elem.parentNode;
                }
                if(!$(".search-rec").is(":hidden")){
                    $(".search-rec").hide();
                }
                $(".panels-l-list").removeClass('panels-list-active');
            }
            //搜索框聚焦时
            $(".search-panel-inp").focus(function(event) {
                $(".search-rec").show();
                $(".search-result").hide();
                $(".search-remind").hide();
                Search.fillNodeTemplate(Search.getCookieKey());
            });

            //搜索框输入时提示
            $(".search-panel-inp").keyup(function(event) {
                if(searchUtils.containSpecial($(this).val())){
                    if($(this).val() == "" || $(this).val() == null){
                        $(".search-rec").show();
                        $(".search-result").hide();
                        $(".search-remind").hide();
                    }else{
                        Remind.fullSearch();
                        $(".search-rec").hide();
                        $(".search-result").hide();
                        $(".search-remind").show();
                    }
                }
            });

            //搜索按钮点击时
            $(".search-panel-ico").click(function(event) {
                var value=$(".search-panel-inp").val();
                if(value){
                    if(!searchUtils.containSpecial(value)){
                        alert("查询内容不能包含特殊字符！");
                        $(".search-panel-inp").val("");
                        $('.search-panel-inp').blur();
                        return;
                    }
                    var encode=encodeURIComponent(encodeURIComponent(value));
                    $(".search-rec").hide();
                    $(".search-result").show();
                    $(".search-remind").hide();
                    //debug
                    var tab = {
                        title: value,
                        content: ctx+"control/map-search/page/textsearch/textsearch.html?key="+encode,
                        contentType:"iframe",
                        data:{
                            name:encode,
                            type:1
                        }
                    };
                    searchUtils.addTab(tab);
                    //debug
                }
            });

            /**检索框回车事件*/
            $('.search-panel-inp').bind('keypress',function(event){
                if(event.keyCode == "13")
                {
                    /**文本框失去焦点*/
                    $('.search-panel-inp').blur();
                    var value=$(".search-panel-inp").val();
                    if(value){
                        if(!searchUtils.containSpecial(value)){
                            alert("查询内容不能包含特殊字符！");
                            $(".search-panel-inp").val("");
                            $('.search-panel-inp').blur();
                            return;
                        }
                        var encode=encodeURIComponent(encodeURIComponent(value));
                        //debug
                        var tab = {
                            title: value,
                            content: ctx+"control/map-search/page/textsearch/textsearch.html?key="+encode,
                            contentType:"iframe",
                            data:{
                                name:encode,
                                type:1
                            }
                        };
                        $(".search-rec").hide();
                        $(".search-result").show();
                        $(".search-remind").hide();
                        searchUtils.addTab(tab);
                        //debug
                    }
                }
            });

            //直接选择历史记录时
            $(".search-rec").on('click', '.history-items', function(event) {
                var layername=$(this).attr("layername");
                var history_text = $(this).find('.history-maintext')[0].innerText || $(this).find('.history-maintext')[0].textContent;
                $(".search-panel-inp").val(history_text);
                $(this).parents(".search-rec").hide();
                if(history_text){
                    var encode=encodeURIComponent(encodeURIComponent(history_text));
                    var tab = {
                        contentType:"iframe",
                        title:history_text,
                        data:{
                            name:encode,
                            type:1
                        }
                    };
                    if(layername==="SP_GJZD"){
                        tab.content= ctx+"/control/map-search/page/station/station.html?layername="+encode+"&key="+history_text;
                    }else if(layername==="SL_GJLX"){
                        tab.content= ctx+"/control/map-search/page/routes/routes.html?layername="+encode+"&key="+history_text;
                    }else {
                        /*tab.content = ctx + "/map/poi/page/poisearch.jsp?layername=" + layername + "&key=" + history_text;*/
                        tab.content= ctx+"control/map-search/page/textsearch/textsearch.html?layername=" + layername+"&key="+encode;
                    }
                }
                $(".search-rec").hide();
                $(".search-result").show();
                $(".search-remind").hide();
                searchUtils.addTab(tab);
                //debug

            });
            //直接选择搜索提示内容时
            $(".search-remind").on('click', '.remind-ul-list', function(event) {
                var layername=$(this).attr("layername");
                var remind_text = $(this).find('.remind-maintext')[0].innerText || $(this).find('.remind-maintext')[0].textContent;
                if(layername==='SL_GJLX'&&remind_text){
                    remind_text=remind_text.split("(")[0];
                }
                $(".search-panel-inp").val(remind_text);
                $(this).parents(".search-remind").hide();
                var obj={
                    value:remind_text,
                    layername:layername
                };
                Search.setCookie(obj);
                var tab = {
                    contentType:"iframe"
                };
                var encode=encodeURIComponent(encodeURIComponent(remind_text));
                if(layername==="SP_GJZD"){
                    tab.title= remind_text,
                        tab.content= ctx+"/control/map-search/page/station/station.html?layername="+encode+"&key="+remind_text;
                }else if(layername==="SL_GJLX"){
                    tab.title= remind_text,
                        tab.content= ctx+"/control/map-search/page/routes/routes.html?layername="+encode+"&key="+remind_text;
                }else{
                    tab.title= remind_text,
                        /*tab.content= ctx+"/map/poi/page/poisearch.jsp?layername="+layername+"&key="+encode;*/
                        tab.content= ctx+"control/map-search/page/textsearch/textsearch.html?layername=" + layername+"&key="+encode;
                }
                tab.data={
                    name:encode,
                    type:1
                };
                $(".search-rec").hide();
                $(".search-result").show();
                $(".search-remind").hide();
                searchUtils.addTab(tab);

                //debugs

            });
            /**检索框回车事件*/
            $('.search-panel-inp').bind('keypress',function(event){
                if(event.keyCode == "13")
                {
                    /**文本框失去焦点*/
                    $('.search-panel-inp').blur();
                    var value=$(".search-panel-inp").val();
                    if(value){
                        if(!searchUtils.containSpecial(value)){
                            alert("查询内容不能包含特殊字符！");
                            $(".search-panel-inp").val("");
                            $('.search-panel-inp').blur();
                            return;
                        }
                        var encode=encodeURIComponent(encodeURIComponent(value));
                        //debug
                        var tab = {
                            title: value,
                            content: ctx+"control/map-search/page/textsearch/textsearch.html?key="+encode,
                            contentType:"iframe",
                            data:{
                                name:encode,
                                type:1
                            }
                        };
                        $(".search-rec").hide();
                        $(".search-result").show();
                        $(".search-remind").hide();
                        searchUtils.addTab(tab);
                        //debug
                    }
                }
            });
        },
        /**
         * 地图工具栏事件注册
         * @param event
         */
        mapEvent:function(event){
            //测量距离
            $("#mapTool .measureTool").click(function(event) {
                app.cmap.setMouseTool(DrawType.MEASURE);
            });
            //测量面积
            $("#mapTool .measureAreaTool").click(function(event) {
                app.cmap.setMouseTool(DrawType.MEASAREA);
            });
            //区域查询
            $("#mapTool .bufferQueryTool").click(function(event) {
                app.cmap.setMouseTool(DrawType.QUERY_CIRCLE,drawCircleHandler);
            });
            //公交线路热力图
            $("#layerControl .gjxl_rlt").change(function(event) {
                var isChecked = $(this).is(":checked");
                var layerName = layerNameConfig.gjxl_rlt_name;
                mapcomn.setTileLayerVisible(app.cmap,layerName,isChecked,5);
            });
            //公交站点热力图
            $("#layerControl .gjzd_rlt").change(function(event) {
                var isChecked = $(this).is(":checked");
                var layerName = layerNameConfig.gjzd_rlt_name;
                mapcomn.setTileLayerVisible(app.cmap,layerName,isChecked,6);
            });
            //公交站点300米覆盖
            $("#layerControl .gjzd_300").change(function(event) {
                var isChecked = $(this).is(":checked");
                var disChecked=$("#layerControl .gjzd_500").is(":checked");
                if(disChecked&&isChecked){
                    $("#layerControl .gjzd_500").click();
                }
                var layerName = layerNameConfig.gjzd_300_name;
                mapcomn.setTopicLayerVisible(app.cmap,layerName,isChecked);
            });
            //公交站点500米覆盖
            $("#layerControl .gjzd_500").change(function(event) {
                var isChecked = $(this).is(":checked");
                var disChecked=$("#layerControl .gjzd_300").is(":checked");
                if(disChecked&&isChecked){
                    $("#layerControl .gjzd_300").click();
                }
                var layerName = layerNameConfig.gjzd_500_name;
                mapcomn.setTopicLayerVisible(app.cmap,layerName,isChecked);
            });
            //公交站点500米覆盖
            $("#layerControl .bus_cluster").change(function(event) {
                var isChecked = $(this).is(":checked");
                var layerName = layerNameConfig.bus_cluster_name;
                mapcomn.setTopicLayerVisible(app.cmap,layerName,isChecked);
            });

        },
        /**
         * 画圆工具
         * @param center_
         * @param radius_
         * @param unit_
         */
        drawCircleHandler:function(center_,radius_,unit_){
            app.cmap.removeOverlay("query_circle");
            //单位默认是米
            var ellipse=new beyond.maps.BQueryCircle({
                "center":center_,
                "radius": radius_,
                "unit":unit_,
                "strokeColor": "#a3b1cc",
                "strokeOpacity": 0.9,
                "strokeWeight": 1,
                "fillColor": "#4673cc",
                "fillOpacity": 0.2,
                "isShowStatus":false
            });
            app.cmap.addOverlay(ellipse,"query_circle");

            var type = "SP_GJZD";
            var mapRadius = beyond.maps.GeometryUtil.convertLenToMapUnit(radius_,unit_);
            var points = beyond.maps.GeometryUtil.createCircle(center_,mapRadius,0,6);
            ellipse.addEventListener("drawEnd",drawCircleHandler);
            var tab = {
                title: '区域查询',
                content: ctx+"/map/poi/page/spatialsearch.jsp?distance="+radius_+"&point="+center_.x+","+center_.y+"&type="+type+"&layerId=query_circle",
                contentType:"iframe",
                reload:true,
                data:{
                    name:'query_circle'
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            searchUtils.addTab(tab);
        },
        /**
         * 清除历史纪录
         */
        clearHistory:function(event){
            $(event.target).html("");
            Search.clearCookie();
        },
        /**
         * 搜索框聚焦时
         * @param event
         */
        searchTextFocus:function(event){
            $(".search-rec").show();
            $(".search-result").hide();
            $(".search-remind").hide();
            Search.fillNodeTemplate(Search.getCookieKey());
        },
        /**
         * 搜索框输入时提示
         * @param event
         */
        searchTextKeyUp:function(event){
            if(searchUtils.containSpecial($(event.target).val())){
                if($(this).val() == "" || $(this).val() == null){
                    $(".search-rec").show();
                    $(".search-result").hide();
                    $(".search-remind").hide();

                }else{
                    Search.fullSearch();
                    $(".search-rec").hide();
                    $(".search-result").hide();
                    $(".search-remind").show();
                }
            }
        },
        /**
         * 搜索框点击事件
         * @param event
         */
        searchButtonClick:function(event){
            var value=$(".search-panel-inp").val();
            if(value){
                if(!searchUtils.containSpecial(value)){
                    alert("查询内容不能包含特殊字符！");
                    $(".search-panel-inp").val("");
                    $('.search-panel-inp').blur();
                    return;
                }
                var encode=encodeURIComponent(encodeURIComponent(value));
                $(".search-rec").hide();
                $(".search-result").show();
                $(".search-remind").hide();
                //debug
                var tab = {
                    title: value,
                    content: ctx+"control/map-search/page/textsearch/textsearch.html?key="+encode,
                    contentType:"iframe",
                    data:{
                        name:encode,
                        type:1
                    }
                };
                searchUtils.addTab(tab);
                //debug
            }
        },
        /**
         * 直接选择历史纪录时
         * @param event
         */
        historyItemClick:function(event){
            var layername=$(this).attr("layername");
            var history_text = $(this).find('.history-maintext')[0].innerText || $(this).find('.history-maintext')[0].textContent;
            $(".search-panel-inp").val(history_text);
            $(this).parents(".search-rec").hide();
            if(history_text){
                var encode=encodeURIComponent(encodeURIComponent(history_text));
                var tab = {
                    contentType:"iframe",
                    title:history_text,
                    data:{
                        name:encode,
                        type:1
                    }
                };
                if(layername==="SP_GJZD"){
                    tab.content= ctx+"/control/map-search/page/station/station.html?layername="+encode+"&key="+history_text;
                }else if(layername==="SL_GJLX"){
                    tab.content= ctx+"/control/map-search/page/routes/routes.html?layername="+encode+"&key="+history_text;
                }else {
                    /*tab.content = ctx + "/map/poi/page/poisearch.jsp?layername=" + layername + "&key=" + history_text;*/
                    tab.content= ctx+"control/map-search/page/textsearch/textsearch.html?layername=" + layername+"&key="+encode;
                }
            }
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            searchUtils.addTab(tab);
            //debug
        },
        /**
         * 直接选择搜索提示内容时
         * @param event
         */
        remindClick:function(event){
            var layername=$(this).attr("layername");
            var remind_text = $(this).find('.remind-maintext')[0].innerText || $(this).find('.remind-maintext')[0].textContent;
            $(".search-panel-inp").val(remind_text);
            $(this).parents(".search-remind").hide();
            var obj={
                value:remind_text,
                layername:layername
            };
            search.setCookie(obj);
            var tab = {
                contentType:"iframe"
            };
            var encode=encodeURIComponent(encodeURIComponent(remind_text));
            if(layername==="SP_GJZD"){
                tab.title= remind_text,
                    tab.content= ctx+"/control/map-search/page/station/station.html?layername="+encode+"&key="+remind_text;
            }else if(layername==="SL_GJLX"){
                tab.title= remind_text,
                    tab.content= ctx+"/control/map-search/page/routes/routes.html?layername="+encode+"&key="+remind_text;
            }else{
                tab.title= remind_text,
                    tab.content= ctx+"control/map-search/page/textsearch/textsearch.html?layername=" + layername+"&key="+encode;
            }
            tab.data={
                name:encode,
                type:1
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            searchUtils.addTab(tab);
        }
    });
    return view;
});