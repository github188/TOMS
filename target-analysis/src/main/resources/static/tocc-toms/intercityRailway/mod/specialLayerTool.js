// 图层控制（包含echarts  铁路）

define([
    "jquery",
    'text!tocc-toms/intercityRailway/tpl/tpl.html',
    "tocc-toms/common/utils/mapClusterUtil",
    "tocc-toms/common/utils/echartsCss",
    "dateutils",
    "tocc-toms/common/mod/map/poiconfig"
],function($,tpl,mapClusterUtil,echartsCss,dateUtils,PoiConfig){
    var controlLayer = {};

    controlLayer.showLayer = {
        industry:[],
        layerName:[]
    };
    controlLayer.that = {};
    // 添加 对应元素的事件
    controlLayer.addEvent=function(that,needDetail,echarts){
        controlLayer.needDetail = needDetail;
        controlLayer.echarts = echarts;
        controlLayer.that = that;
        //初始化模板数据
        controlLayer.that._templateFn(tpl);
        //默认 设置图层全部勾选
        $(".layerInfo").find("input[type='checkbox']").each(function(){
            var dataType = $(this).attr('data-type');
            //点击静态图层名
            if(dataType.indexOf('SP') != -1){
                controlLayer.showLayer.layerName.push(dataType);
            }
            $(this).prop('checked',true);
        });

        //默认 设置图层全部展示
        if(controlLayer.showLayer.layerName.length > 0){
            //循环加载静态数据
            for(var i = 0; i < controlLayer.showLayer.layerName.length; i++){
                showLayerByName(controlLayer.showLayer.layerName[i],true);
            }
        }

        //  input 点击事件
        $('.layerInfo li li input').on('click',function(){
            var isChecked = $(this).is(":checked");
            var dataType = $(this).attr('data-type');

            //点击 图层控制按钮 关闭弹框
            controlLayer.that.$map.clearInfoWindow();
            //点击静态图层名
            if(dataType.indexOf('SP') != -1){
                showLayerByName(dataType,isChecked);
            }
        });
    }

    // 根据 图层名称（layerName=SP_JC） 展示对应图层静态数据
    function showLayerByName(layerName,isChecked){
        setFeatureLayerVisible(controlLayer.that.$map, layerName, isChecked,controlLayer.that);
    }

    function setFeatureLayerVisible(map, layername, visible,that, where, locateSymbol) {
        if (!map || !layername) {
            return;
        }
        var listFields = "";
        if (!locateSymbol) {
            locateSymbol = PoiConfig.poiConfigUtil.getLayerLocateSymbol(layername);
        }
        var featureLayer;
        if (beyond.maps.FeatureLayer) {
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
                "isZoomTo":true,
                "id": layername,
                "layerName": layername,
                "locateSymbol": locateSymbol,
                "listFields": listFields,
                "where": where,
                "featureClick": function (marker) {
                    var data = marker.getData();
                    if (data && data["GID"]) {
                        var where = "GID=" + data["GID"];
                        poiDetail(map,layername,marker,where);
                    }
                }
            };
            map.plugin("beyond.maps.FeatureLayer", function () {
                featureLayer = new beyond.maps.FeatureLayer(options);
                map.addOverlay(featureLayer, layername + "_layercontrol");
            });
        }
    }

    function poiDetail(cmap,layer,m,where){
        if(layer==""||PoiConfig.poiConfig[layer]==null){
            alert('该图层未配置')
        }
        var datail = "";
        for(var key in PoiConfig.poiConfig[layer].data){
            datail += key + ","
        }
        datail = datail.substr(0, datail.length - 1);
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
            featureQuery = new beyond.maps.FeatureQuery(options);
            featureQuery.queryDetail(function (result) {
                if (result.getReturnFlag() == 1) {
                    var data = result.getData();

                    var html = "";
                    var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                    if(layerConfig==null){
                        return;
                    }

                    if (data == null || data.list.length == 0) {
                        alert('请求失败!');
                    } else {
                        var obj = data.list[0];
                        //marker 点击后执行的方法（展示点击marker的详情）
                        if(obj){

                            html = controlLayer.that.echartsInfoTemplate({data:obj});
                        }
                    }
                    html = '<div class="ofo">' + html;
                    html += '</div>';
                    //生成 弹框
                    var infoWindow = new beyond.maps.BInfoWindow({
                        isCustom:true,
                        content: html,
                        offsetY: 393,
                        offsetX: -299
                    });
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
                    }
                    //var height = cmap.getExtent().getHeight();
                    var y = m.getPosition().y;
                    var x = m.getPosition().x;
                    cmap.setCenter(new beyond.geometry.MapPoint(x, y));
                    infoWindow.open(cmap, m.getPosition());

                    showEChartsDetail(data.list[0].MC);

                    $('.close').on('click',function(){
                        cmap.clearInfoWindow();
                    });
                    controlLayer.that.topHeight();
                    //点击事件
                    $('.sevenDay').off('click').on('click',function(){
                        $('.changData').text('近7日');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sevenDay").show();
                        $("#sameDay").hide();

                        var siteName = $(this).attr('hide-data');
                        showEChartsDetail(siteName);
                    });

                    $('.sameDay').off('click').on('click',function(){
                        $('.changData').text('当天各时段');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sameDay").show();
                        $("#sevenDay").hide();

                        var siteName = $(this).attr('hide-data');
                        showEChartsDayDetail(siteName);
                    });
                }
            }, where);
        });
    }

    // 显示 echarts 详情( 近7日) （train/get7DayFlowRateAnalysis）
    function showEChartsDetail(siteName){
        //更新详情数据
        queryDayCount(siteName);
        //进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"train/get7DayFlowRateAnalysis",
            type:"post",
            data:{
                siteName:siteName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                var data = result.data;
                if(data && data.length >0){
                    var length = ['客流量','天'];

                    var xDateData = [];
                    var seriesData = [];
                    //组装数据
                    for(var i = 0; i < data.length; i++){
                        xDateData.push(data[i].DAYTIME);
                        seriesData.push(data[i].TOTAL);
                    }

                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '12%',
                            right: '8%',
                        },
                        calculable : true,
                        xAxis : [
                            echartsCss.getxAxis(length[1],xDateData)
                        ],
                        yAxis : [
                            echartsCss.getyAxis('人次')
                        ],
                        series :[
                            echartsCss.getseries(length[0],'line',seriesData)
                        ]
                    }

                    controlLayer.that.getEchart('#sevenDay',option);
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    // 显示 echarts 详情( 当日) （train/get24HourFlowRateAnalysis）
    function showEChartsDayDetail(siteName){
        //更新详情数据
        queryDayCount(siteName);
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"train/get24HourFlowRateAnalysis",
            type:"post",
            data:{
                siteName:siteName
            },
            success:function(result){
                var data = result.data;
                if(data && data.length >0){
                    var unit = ['客流量','小时'];

                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '10%',
                            right: '8%'
                        },
                        calculable : true,
                        xAxis : [
                            echartsCss.getxAxis(unit[1],data[0].hourTime)
                        ],
                        yAxis : [
                            echartsCss.getyAxis('人次')
                        ],
                        series :[
                            echartsCss.getseries(unit[0],'line',data[0].total)
                        ]
                    }

                    controlLayer.that.getEchart('#sameDay',option);
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    //根据车站名称查询站点最新数据（train/getSiteData）
    function queryDayCount(siteName){

        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"train/getSiteData",
            type:"post",
            data:{
                siteName:siteName
            },
            success:function(result){
                var data = result.data;
               if(data && data != null){
                   var detailData = data;
                   //填充 近7日 显示的详情
                   $('.number').text(detailData.CHECK_IN_NUM?0:detailData.CHECK_IN_NUM);
                   $('.number1').text(detailData.YW_NUM?0:detailData.YW_NUM);
                   $('.number2').text(detailData.CHECK_OUT_NUM?0:detailData.CHECK_OUT_NUM);
                   $('.number3').text(detailData.EXCHANGE_TIME?'暂无数据':detailData.EXCHANGE_TIME);
               }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    return controlLayer
})