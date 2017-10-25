// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/intercityBus/tpl/tpl.html',
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
            //点击行业类别
            if(dataType.indexOf('SP') == -1){
                controlLayer.showLayer.industry.push(dataType);
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
        if(controlLayer.showLayer.industry.length > 0){
            var industry = "";
            for(var i = 0; i<controlLayer.showLayer.industry.length; i++){
                industry += controlLayer.showLayer.industry[i] + ',';
            }
            industry = industry.substring(0,industry.length-1);
            //展示车辆实时数据
            showClusterByIndustry(industry,window.AppConfig.xcode);
        }

        //  input 点击事件
        $('.layerInfo li li input').on('click',function(){
            var isChecked = $(this).is(":checked");
            var dataType = $(this).attr('data-type');

            var infoWindowType = $('.close').attr('data-type');

            if(dataType == infoWindowType){
                controlLayer.that.$map.clearInfoWindow();
            }

            //点击静态图层名
            if(dataType.indexOf('SP') != -1){
                showLayerByName(dataType,isChecked);
            }
            //点击行业类别
            if(dataType.indexOf('SP')==-1){
                if(isChecked){
                    controlLayer.showLayer.industry.push(dataType);
                }else{
                    for(var i = 0; i<controlLayer.showLayer.industry.length; i++){
                        if(dataType == controlLayer.showLayer.industry[i]){
                            controlLayer.showLayer.industry.splice(i,1);
                        }
                    }
                }
                var industry = "";
                for(var i = 0; i<controlLayer.showLayer.industry.length; i++){
                    industry += controlLayer.showLayer.industry[i] + ',';
                }
                industry = industry.substring(0,industry.length-1);
                //如果不存在industry 就取消所有聚合图层
                if(!industry) industry = "999999";
                mapClusterUtil.returnMakerClustererLkyw().setIndustry(industry);
            }
        });
    }

    // 根据 行业类别（industry=011,012） 展示对应车辆实时数据(聚合图层)
    function showClusterByIndustry(industry,areaCode){
        mapClusterUtil.cluster(industry,controlLayer.that.$map,areaCode,function(data){
            //markerCluster 点击后执行的方法（展示点击marker的详情）
            showBaseDetail(data);
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
                        alert('暂无数据');
                    } else {
                        var obj = data.list[0];
                        obj.layerName = layer;
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
                        offsetY: 395,
                        offsetX: -275
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

                    if('SP_HZL' == layer){
                        showHzlEChartsDetail(data.list[0].MC);
                    }else {
                        showEChartsDetail(data.list[0].MC);
                    }

                    $('.close').on('click',function(){
                        cmap.clearInfoWindow();
                    });

                    //获取弹框高度
                    controlLayer.that.topHeight();

                    //点击事件
                    $('.sevenDay').off('click').on('click',function(){
                        $('.changData').text('近7日');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sevenDay").show();
                        $("#sameDay").hide();

                        var layerName = $('.close').attr('data-type');
                        var siteName = $(this).attr('hide-data');
                        if('SP_HZL' == layerName){
                            showHzlEChartsDetail(siteName);
                        }else{
                            showEChartsDetail(siteName);
                        }
                    });

                    $('.sameDay').off('click').on('click',function(){
                        $('.changData').text('当天各时段');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sameDay").show();
                        $("#sevenDay").hide();

                        var layerName = $('.close').attr('data-type');
                        var siteName = $(this).attr('hide-data');
                        if('SP_HZL' == layerName){
                            showHzlDayEChartsDetail(siteName);
                        }else{
                            showEChartsDayDetail(siteName);
                        }
                    });
                }
            }, where);
        });
    }

    // 显示 基础详情
    function showBaseDetail(data){
        //markerCluster 点击后执行的方法（展示点击marker的详情）
        if(data){
            data.layerName = data.industyType;
            data.time = dateUtils.dateFmt(new Date(data.gpsTime.time), 'yyyy-MM-dd hh:mm:ss');
            var html = controlLayer.that.carInfoTemplate({data:data});
            var point = new beyond.geometry.MapPoint(data.longitude, data.latitude);

            //生成 弹框
            var infoWindow = new beyond.maps.BInfoWindow({
                isCustom:true,
                content: html,
                offsetY: 275,
                offsetX: -182
            });

            var height =  controlLayer.that.$map.getExtent().getHeight();
            var y = point.y + height * 0.2;
            var x = point.x;

            infoWindow.open(controlLayer.that.$map, point);
            controlLayer.that.$map.setCenter(new beyond.geometry.MapPoint(x, y));

            $('.close').on('click',function(){
                controlLayer.that.$map.clearInfoWindow();
            });

            //获取弹框高度
            controlLayer.that.topHeight();
        }else{
            console("详情暂无数据");
        }
    }

    // 显示 echarts 详情( 进7日) （shuttleBus/getShiftBySiteBy7Day）
    function showEChartsDetail(siteName){
        // 添加 当日 总量的 ajax
        queryDayCount(siteName);
        // 添加进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"shuttleBus/getShiftBySiteBy7Day",
            type:"post",
            data:{
                siteName:siteName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                var data = result.data;
                if(data && data.length >0){
                    var length = ['客运量','天'];

                    var xDateData = [];
                    var seriesData = [];
                    //组装数据
                    for(var i = 0; i < data.length; i++){
                        xDateData.push(data[i].TJSJ_D);
                        seriesData.push(data[i].FSL_NUM);
                    }

                    var option = {
                        tooltip : {
                            trigger: 'axis'
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

    // 显示 echarts 详情( 当日) （shuttleBus/getShiftBySiteByHour）
    function showEChartsDayDetail(siteName){
        //TODO  添加 当日 总量的 ajax
        queryDayCount(siteName);
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"shuttleBus/getShiftBySiteByHour",
            type:"post",
            data:{
                siteName:siteName,
                dateType:dateUtils.dateFmt(new Date, 'yyyyMMdd')
            },
            success:function(result){
                var data = result.data;
                if(data && data.length >0){
                    var length = ['客运量','小时'];

                    var xDateData = [];
                    var seriesData = [];
                    //组装数据
                    for(var i = 0; i < data.length; i++){
                        xDateData.push(data[i].TJSJ_H);
                        seriesData.push(data[i].FSL_NUM);
                    }

                    var option = {
                        tooltip : {
                            trigger: 'axis'
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

                    controlLayer.that.getEchart('#sameDay',option);
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    // 航站楼 显示 echarts 详情( 进7日) （shuttleBus/getAirportTerminalFlowInSeven）
    function showHzlEChartsDetail(siteName){
        //TODO  添加进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"shuttleBus/getAirportTerminalFlowInSeven",
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
                        xDateData.push(data[i].TJSJ_D);
                        seriesData.push(data[i].FSLNUM);
                    }

                    var option = {
                        tooltip : {
                            trigger: 'axis'
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

    // 航站楼 显示 echarts 详情( 当日) （shuttleBus/getAirportTerminalFlowByHour）
    function showHzlDayEChartsDetail(siteName){
        //TODO  添加进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"shuttleBus/getAirportTerminalFlowByHour",
            type:"post",
            data:{
                siteName:siteName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                var data = result.data;
                if(data && data.length >0){
                    var length = ['客运量','小时'];

                    var xDateData = [];
                    var seriesData = [];
                    //组装数据
                    for(var i = 0; i < data.length; i++){
                        xDateData.push(data[i].TJSJ_H);
                        seriesData.push(data[i].FSLNUM);
                    }

                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        calculable : true,
                        xAxis : [
                            echartsCss.getxAxis(length[0],xDateData)
                        ],
                        yAxis : [
                            echartsCss.getyAxis('人次')
                        ],
                        series :[
                            echartsCss.getseries(length[0],'line',seriesData)
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

    //根据站名班车出发，到达班次，周转量，发送量（shuttleBus/getShiftBySite）
    function queryDayCount(siteName){

        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"shuttleBus/getShiftBySite",
            type:"post",
            data:{
                siteName:siteName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                var data = result.data;
               if(data && data.length > 0){
                   var detailData = data.data;
                    //填充 近7日 显示的详情
                   $('.box').each(function(index,ele){
                        for(var i =0; i<detailData.length; i++){
                            switch (index){
                                case 0 : $(this).find('.number').text(detailData[i].ON_NUM);
                                    break;
                                case 1 : $(this).find('.number').text(detailData[i].FSL_NUM);
                                    break;
                                case 2 : $(this).find('.number').text(detailData[i].ZZL_NUM);
                                    break;
                                case 3 : $(this).find('.number').text(detailData[i].EXCHANGE_TIME);
                                    break;
                                default : break;
                            }
                        }
                   });
               }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    return controlLayer
})