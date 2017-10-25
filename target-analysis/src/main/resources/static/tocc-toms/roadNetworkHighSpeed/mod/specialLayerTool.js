// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/roadNetworkHighSpeed/tpl/tpl.html',
    "tocc-toms/common/utils/mapClusterUtil",
    "tocc-toms/common/utils/echartsCss",
    "dateutils",
    "tocc-toms/common/mod/map/poiconfig",
    "mock"
],function($,tpl,mapClusterUtil,echartsCss,dateUtils,PoiConfig,Mock){
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
        //模拟 接口返回数据
        //loadMock();
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

            var infoWindowType = $('.close').attr('data-type');

            if(dataType == infoWindowType){
                controlLayer.that.$map.clearInfoWindow();
            }

            //点击静态图层名
            if(dataType.indexOf('SP') != -1){
                showLayerByName(dataType,isChecked);
            }
        });
    }

    //mock 数据
    function loadMock(){
        // 车辆监控 近 7日
        Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getStationSXFlowInSeven",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    JDCZRS_SX:Mock.Random.integer(1000,10000),
                    JDCZRS_XX:Mock.Random.integer(1000,10000),
                    LXMC:Mock.Random.cname(),
                    TIME:Mock.Random.date('yyyyMMdd')
                }
            ]

            return data;
        })

        // 收费站 近 7日数据
        Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getTollStationFlowInSeven",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_D:Mock.Random.date('yyyy-MM-dd')
                }
            ]

            return data;
        })

        // 收费站 当日数据
        Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getTollStationDataByHour",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                },{
                    CFCLZL:Mock.Random.integer(1000,10000),
                    CLZZ:Mock.Random.integer(1000,10000),
                    ZDMC:Mock.Random.integer(1000,10000),
                    DDCLZL:Mock.Random.integer(1000,10000),
                    TJSJ_H:Mock.Random.date('yyyy-MM-dd')
                }
            ]

            return data;
        })


        //  情报站
        Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getBoardInformation",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    REALCONTENT:Mock.Random.cname()
                }
            ]

            return data;
        })
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
                            if('SP_QBB' == layer){
                                html = controlLayer.that.qbbInfoTemplate({data:obj});
                                //alert(obj.ID+' --- '+obj.SBMC);
                            }else if('SP_CLLJKD' == layer){
                                html = controlLayer.that.echartsInfoTemplate({data:obj});
                            }else if('SP_SFZ' == layer){
                                html = controlLayer.that.sfzEchartsInfoTemplate({data:obj});
                            }else{
                                var querydata = "";
                                var layerConfig = PoiConfig.poiConfigUtil.getLayerConfig(layer);
                                var width = PoiConfig.poiConfigUtil.getShowLabelWidth(layer);

                                for(var key in obj){
                                    querydata = obj[key];

                                    if(!layerConfig.data[key]||!layerConfig.data[key].label){
                                        continue;
                                    }

                                    // 根据 poiconfig.js  配置的数据  展示
                                    if(querydata==null){
                                        html += "<tr><td><span class='lightBlue'>"+layerConfig.data[key].label+"："+"</span><span>"+"暂无数据"+"</span></td></tr>";
                                    }else{
                                        html += "<tr><td><span class='lightBlue'>"+layerConfig.data[key].label+"："+"</span><span>"+querydata+"</span></td></tr>";
                                    }
                                }
                                // 组装HTML
                                html = "<div class='mapTpl'>" +
                                                    "<div class='tplHead'>" +
                                                        "<div class='tit'>"+obj['MC']+"</div>" +
                                                        "<div class='close' data-type="+obj['layerName']+">&#10005;</div>" +
                                                    "</div>" +
                                                    "<div class='tplCon'>" +
                                                        "<table class='tplTable' cellspacing='0' cellpadding='0'>"
                                                            + html+
                                                        "</table>" +
                                                    "</div>" +
                                                "</div>" +
                                                 "<div class='indexBottom'><img src='../common/res/img/base/sharp.png' /></div>";
                            }
                        }
                    }
                    html = '<div class="ofo">' + html;
                    html += '</div>';
                    //生成 弹框
                    var infoWindow;
                    if('SP_CLLJKD' == layer){
                        infoWindow = new beyond.maps.BInfoWindow({
                            isCustom:true,
                            content: html,
                            offsetY: 387,
                            offsetX: -203
                        });
                    }else if('SP_SFZ' == layer){
                        infoWindow = new beyond.maps.BInfoWindow({
                            isCustom:true,
                            content: html,
                            offsetY: 393,
                            offsetX: -302
                        });
                    }else{
                        infoWindow = new beyond.maps.BInfoWindow({
                            isCustom:true,
                            content: html,
                            offsetY: 296,
                            offsetX: -183
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
                    }
                    //var height = cmap.getExtent().getHeight();
                    var y = m.getPosition().y;
                    var x = m.getPosition().x;
                    cmap.setCenter(new beyond.geometry.MapPoint(x, y));
                    infoWindow.open(cmap, m.getPosition());
                    if('SP_QBB' == layer){
                        showQbbDetail(data.list[0].ID);
                    }else if('SP_CLLJKD' == layer){
                        showEChartsDetail(obj.BM);
                    }else if('SP_SFZ' == layer){
                        showSfzEChartsDetail(obj.MC);
                    }

                    $('.close').on('click',function(){
                        cmap.clearInfoWindow();
                    });
                    controlLayer.that.topHeight();
                    //点击事件
                    $('.sevenDay').off('click').on('click',function(){
                        $('.changData').text('近7日');
                        var stationName = $(this).attr('hide-data').split(',');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sevenDay").show();
                        $("#sameDay").hide();
                        showSfzEChartsDetail(stationName);
                    });

                    $('.sameDay').off('click').on('click',function(){
                        $('.changData').text('当天各时段');
                        var stationName = $(this).attr('hide-data');
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sameDay").show();
                        $("#sevenDay").hide();
                        showSfzDayEChartsDetail(stationName);
                    });
                }
            }, where);
        });
    }

    // 车流监控 显示 echarts 详情( 进7日) （highWay/getStationSXFlowInSeven）
    function showEChartsDetail(gczbh){
        //TODO  添加进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"highWay/getStationSXFlowInSeven",
            type:"post",
            data:{
                gczbh:gczbh,
                dateType: dateUtils.dateFmt(new Date(), 'yyyyMMdd')
            },
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    if(data && data.length >0){
                        var unit = ['辆','天'];
                        var legendArr = ["上行车流量","下行车流量"];

                        var xData = [];
                        //上行车流量
                        var serviceData = [];
                        //下行车流量
                        var serviceData1 = [];

                        for (var i = 0; i < data.length; i++){
                            xData.push(data[i].TIME);
                            serviceData.push(data[i].JDCZRS_SX);
                            serviceData1.push(data[i].JDCZRS_XX);
                        }

                        var option = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:legendArr,
                                x: 'center',
                                y: '37',
                                textStyle:{color: '#fff'}
                            },
                            grid: {
                                top:55,
                                left: '4%',
                                right: '7%',
                                bottom: '3%',
                                containLabel: true
                            },
                            calculable : true,
                            xAxis : [
                                echartsCss.getxAxis(unit[1],xData)
                            ],
                            yAxis : [
                                echartsCss.getyAxis(unit[0])
                            ],
                            series :[
                                echartsCss.getseries(legendArr[0],'line',serviceData),
                                echartsCss.getseries(legendArr[1],'line',serviceData1),
                            ]
                        }
                        controlLayer.that.getEchart('#showData',option);
                    }else{
                        $('#showData').html('暂无数据');
                    }
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    // 收费站 显示 echarts 详情( 进7日) （highWay/getTollStationFlowInSeven）
    function showSfzEChartsDetail(stationName){
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"highWay/getTollStationFlowInSeven",
            type:"post",
            data:{
                ZDMC:stationName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;

                    var xData = [];
                    //总流量
                    var serviceData = [];
                    //入口流量
                    var serviceData1 = [];
                    //出口流量
                    var serviceData2 = [];

                    for (var i = 0; i < data.length; i++){
                        xData.push(data[i].TJSJ_D);
                        serviceData.push(data[i].CLZZ);
                        serviceData1.push(data[i].CFCLZL);
                        serviceData2.push(data[i].DDCLZL);
                    }

                    if(data && data.length >0){
                        var unit = ['辆','天','总车流','入口车流','出口车流'];

                        var option = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            calculable : true,
                            xAxis : [
                                echartsCss.getxAxis(unit[1],xData)
                            ],
                            yAxis : [
                                echartsCss.getyAxis(unit[0])
                            ],
                            series :[
                                echartsCss.getseries(unit[2],'line',serviceData),
                                echartsCss.getseries(unit[3],'line',serviceData1),
                                echartsCss.getseries(unit[4],'line',serviceData2)
                            ]
                        }
                        controlLayer.that.getEchart('#sevenDay',option);
                    }else{
                        $('#sevenDay').html('暂无数据');
                    }
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    //收费站  显示 echarts 详情( 当日) （highWay/getTollStationDataByHour）
    function showSfzDayEChartsDetail(stationName){
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"highWay/getTollStationDataByHour",
            type:"post",
            data:{
                ZDMC:stationName,
                dateType:dateUtils.dateFmt(new Date(),"yyyyMMdd")
            },
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    if(data && data.length >0){
                        var unit = ['辆','时','总车流','入口车流','出口车流'];

                        var xData = [];
                        //总流量
                        var serviceData = [];
                        //入口流量
                        var serviceData1 = [];
                        //出口流量
                        var serviceData2 = [];

                        for (var i = 0; i < data.length; i++){
                            xData.push(data[i].TJSJ_H);
                            serviceData.push(data[i].CLZZ);
                            serviceData1.push(data[i].CFCLZL);
                            serviceData2.push(data[i].DDCLZL);
                        }

                        var option = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            calculable : true,
                            xAxis : [
                                echartsCss.getxAxis(unit[1],xData)
                            ],
                            yAxis : [
                                echartsCss.getyAxis(unit[0])
                            ],
                            series :[
                                echartsCss.getseries(unit[2],'line',serviceData),
                                echartsCss.getseries(unit[3],'line',serviceData1),
                                echartsCss.getseries(unit[4],'line',serviceData2)
                            ]
                        }
                        controlLayer.that.getEchart('#sameDay',option);
                    }
                }else{
                    $('#sameDay').html('暂无数据');
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    //根据ID 查询 对应的描述字段（highWay/getBoardInformation）
    function showQbbDetail(id){
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"highWay/getBoardInformation",
            type:"post",
            data:{
                id:id
            },
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    if(result.data && result.data.length > 0){
                        var qbbDescribe = result.data[0].REALCONTENT || '暂无数据';
                        $('.qbbDescribe').html(qbbDescribe);
                    }else{
                        $('.qbbDescribe').html('暂无数据');
                    }
                }
            },
            error:function(err){
                console.log(err)
            }

        })
    }

    return controlLayer
})