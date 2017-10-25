/**
 * Created by mac-pc on 16/7/18.
 */
define([
    'jquery',
    'tocc-toms/common/BaseView',
    'tocc-toms/common/mod/control/map-search/app/utils/searchUtils',
    'tocc-toms/common/mod/control/map-search/app/search/search',
    'tocc-toms/common/mod/control/map-search/app/utils/mapSearchUtils',
    'tocc-toms/common/mod/control/map-real-distribution/app/utils/mapClusterUtil',
    'tocc-toms/common/mod/control/map-real-distribution/app/carinfo/mainView',
    'text!../../template/mapToolsTemplate.html',
    'bmap',
    'map_utils',
    'log',
    'css!../../resource/css/maptools.css'
],function($,BaseView,SearchUtils,Search,MapSearchUtils,MapClusterUtil,CarInfoMainView,MapToolsTemplate, bmap,mapUtils,Log) {
        var that;
        var view = BaseView.extend({
            events: {

            },
            init: function() {
                that=this;
                that.$clcxView=new CarInfoMainView();
                that._templateFn(MapToolsTemplate);
            },
            render: function(options) {
                that=this;
                that.init();
                that.$map=options.map;
                that.$el=options.container;
                that.$type=options.type;
                that.$ctx=window.AppConfig.RemoteApiUrl+"";
                if(options.type){
                    $(that.$el).append(that.mapToolsTemplate(options));
                }
                that.loadJs();
            },
            initUI: function() {

            },
            loadJs: function() {
                /*$(".analysis-enter").on("click",function(){
                    var options={};
                    if(that.$type==='bus'){
                        options.page='../ReportServer?formlet=TCSP/high/high.frm';
                        options.text='城市公交指标分析';
                    }else if(that.$type==='taxi'){
                        options.page='../ReportServer?formlet=TCSP/bicycle/bicycle.frm';
                        options.text='出租车指标分析';
                    }else if(that.$type==='bicycle'){
                        options.page='../ReportServer?formlet=TCSP/bicycle/bicycle.frm';
                        options.text='公共自行车指标分析';
                    }
                    if(options.page&&parent.window.addFrameTabs){
                        parent.window.addFrameTabs(options);
                    }
                });*/
                //清除历史记录
                $(".rec-clearhis").click(function(event) {
                    $(".rec-history").html("");
                    Search.clearCookie();
                });
                //地图工具下拉面板
                $(".tools-panels").on('click', '.panels-l-list', function(event) {

                    var list_drop = $(this).find('.list-drop').css("display");

                    if(list_drop == "none"){
                        $(".tools-panels .panels-l-list").removeClass('panels-list-active');
                        $(this).addClass('panels-list-active');
                    }else{
                        $(this).removeClass('panels-list-active');
                    }

                });
                //测量距离
                $("#mapTool .measureTool").click(function(event) {
                    that.$map.setMouseTool(DrawType.MEASURE);
                });
                //测量面积
                $("#mapTool .measureAreaTool").click(function(event) {
                    that.$map.setMouseTool(DrawType.MEASAREA);
                });
                //区域查询
                $("#mapTool .bufferQueryTool").click(function(event) {
                    that.$map.setMouseTool(DrawType.QUERY_CIRCLE,drawCircleHandler);
                });

                function drawCircleHandler(center_,radius_,unit_)
                {
                    var type = "SP_GJZD";
                    that.$map.removeOverlay("query_circle");

                    var tab = {
                        title: '区域查询',
                        content: that.$ctx+"/control/map-search/page/spatial/spatialSearch.html?distance="+radius_+"&point="+center_.x+","+center_.y+"&type="+type+"&layerId=query_circle",
                        contentType:"iframe",
                        reload:true,
                        data:{
                            name:'query_circle'
                        }
                    };
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
                    that.$map.addOverlay(ellipse,"query_circle");

                    var mapRadius = beyond.maps.GeometryUtil.convertLenToMapUnit(radius_,unit_);
                    var points = beyond.maps.GeometryUtil.createCircle(center_,mapRadius,0,6);
                    ellipse.addEventListener("drawEnd",drawCircleHandler);

                    $(".search-rec").hide();
                    $(".search-result").show();
                    $(".search-remind").hide();
                    SearchUtils.addTab(tab);
                }
                //公交线路热力图
                $("#layerControl .gjxl_rlt").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    var layerName = MapSearchUtils.layerNameConfig.gjxl_rlt_name;
                    MapSearchUtils.setTileLayerVisible(that.$map,layerName,isChecked,5);
                });
                //公交站点热力图
                $("#layerControl .gjzd_rlt").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    var layerName = MapSearchUtils.layerNameConfig.gjzd_rlt_name;
                    MapSearchUtils.setTileLayerVisible(that.$map,layerName,isChecked,6);
                });
                //公交站点300米覆盖
                $("#layerControl .gjzd_300").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .gjzd_500").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .gjzd_500").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.gjzd_300_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //公交站点500米覆盖
                $("#layerControl .gjzd_500").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .gjzd_300").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .gjzd_300").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.gjzd_500_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //聚合图层
                $("#layerControl .bus_cluster").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    var layerName = MapSearchUtils.layerNameConfig.bus_cluster_name;
                    //MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                    if(isChecked){
                        MapClusterUtil.cluster( "080", that.$map,that.$areaName,function(data){
                            that.$clcxView.carDataInfoWindow(data,that.$map);
                        });
                    }else{
                        MapClusterUtil.cluster( "SP_WHTCC|SP_KYZ,SP_JX,SP_ZXCTKD,SP_WX,SP_KYQY,SP_HYQY", that.$map,that.$areaName,function(data){
                            that.$clcxView.carDataInfoWindow(data,that.$map);
                        });
                    }

                    var isChecked_gjzd = $("#layerControl .gjzd_gjzd").is(":checked");
                    var layerName_gjzd = MapSearchUtils.layerNameConfig.gjzd_gjzd;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName_gjzd,isChecked_gjzd);

                    var isChecked_gj300 = $("#layerControl .gjzd_300").is(":checked");
                    var layerName_gj300 = MapSearchUtils.layerNameConfig.gjzd_300_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName_gj300,isChecked_gj300);

                    var isChecked_gj500 = $("#layerControl .gjzd_500").is(":checked");
                    var layerName_gj500 = MapSearchUtils.layerNameConfig.gjzd_500_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName_gj500,isChecked_gj500);
                });
                //自行车距离公交站点分布图
                $("#layerControl .bicycle_gjzd").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .bicycle_kejiekehuan").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .bicycle_kejiekehuan").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.bicycle_gjzd_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });

                //自行车可借可还站点分布图
                $("#layerControl .bicycle_kejiekehuan").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .bicycle_gjzd").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .bicycle_gjzd").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.bicycle_kejiekehuan_name;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });

                //自行车站点
                $("#layerControl .bicycle_biczd").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .bicycle_biczd").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .bicycle_biczd").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.bicycle_biczd;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });


                //维修分布图
                $("#layerControl .other_wx").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .other_wx").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .other_wx").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.other_wx;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //普货分布图
                $("#layerControl .other_ph").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .other_ph").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .other_ph").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.other_ph;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //驾培学校分布图
                $("#layerControl .other_jp").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .other_jp").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .other_jp").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.other_jp;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //危货停车场分布图
                $("#layerControl .other_whtc").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .other_whtc").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .other_whtc").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.other_whtc;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });
                //客运站分布图
                $("#layerControl .other_kyz").change(function(event) {
                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .other_kyz").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .other_kyz").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.other_kyz;
                    //MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                    MapSearchUtils.setLayerVisible(that.$map,"SP_KYZ",isChecked,"1=1","ssfb");
                });
                //公交站点分布
                $("#layerControl .gjzd_gjzd").change(function(event) {
                    var isChecked_bus_cluster = $("#layerControl .bus_cluster").is(":checked");
                    if(isChecked_bus_cluster){
                        MapClusterUtil.cluster( "080", that.$map,that.$areaName,function(data){
                            that.$clcxView.carDataInfoWindow(data,that.$map);
                        });
                    }else{
                        MapClusterUtil.cluster( "SP_WHTCC|SP_KYZ,SP_JX,SP_ZXCTKD,SP_WX,SP_KYQY,SP_HYQY", that.$map,that.$areaName,function(data){
                            that.$clcxView.carDataInfoWindow(data,that.$map);
                        });
                    }

                    var isChecked = $(this).is(":checked");
                    //var disChecked=$("#layerControl .gjzd_gjzd").is(":checked");
                    //if(disChecked&&isChecked){
                    //    $("#layerControl .gjzd_gjzd").click();
                    //}
                    var layerName = MapSearchUtils.layerNameConfig.gjzd_gjzd;
                    MapSearchUtils.setTopicLayerVisible(that.$map,layerName,isChecked);
                });

            },
            addPanel: function(options) {

            }
        });
        return view;
    });