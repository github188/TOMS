// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/roadNetworkHighway/tpl/tpl.html',
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
        loadMock();
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
            //点击静态图层名
            if(dataType.indexOf('SP') != -1){
                showLayerByName(dataType,isChecked);
            }
        });
    }

    //mock 数据
    function loadMock(){
        // 近 7日
        Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getStationFlowInSeven",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    LIGHT_VEHICLE:[Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000)],
                    MID_VEHICLE:[Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000)],
                    HEAVY_VEHICLE:[Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000),Mock.Random.integer(1000,10000)],
                    TOTALFLOW:[Mock.Random.integer(10000,100000),Mock.Random.integer(10000,100000),Mock.Random.integer(10000,100000),Mock.Random.integer(10000,100000)],
                    STAT_DATE:[Mock.Random.date('yyyy-MM-dd'),Mock.Random.date('yyyy-MM-dd'),Mock.Random.date('yyyy-MM-dd'),Mock.Random.date('yyyy-MM-dd')],
                    'DEVICE_IP|1':['192.168.212.2','192.168.212.3','192.168.252.2','192.168.252.3'] //在数组中随机找一个
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
                "isZoomTo":false,
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
                        //marker 点击后执行的方法（展示点击marker的详情）
                        if(obj){
                            if('SP_QBB' == layer){
                                html = controlLayer.that.qbbInfoTemplate({data:obj});
                                //alert(obj.ID+' --- '+obj.SBMC);
                            }else if('SP_CLLJKD' == layer){
                                var deviceIp = obj.SBIP.split(',');
                                var direction = obj.FX.split(',');
                                obj.singleOne = deviceIp[0];
                                obj.singleTwo = deviceIp[1];
                                obj.directionOne = direction[0];
                                obj.directionTwo = direction[1];
                                html = controlLayer.that.echartsInfoTemplate({data:obj});
                                //alert(obj.SBIP+' --- '+obj.FX);
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
                                                        "<div class='close'>&#10005;</div>" +
                                                    "</div>" +
                                                    "<div class='tplCon'>" +
                                                        "<table class='tplTable' cellspacing='0' cellpadding='0'>"
                                                            + html+
                                                        "</table>" +
                                                    "</div>" +
                                                "</div>" +
                                                 "<div class='indexBottom'></div>";
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
                            offsetY: 377,
                            offsetX: -206
                        });
                    }else{
                        infoWindow = new beyond.maps.BInfoWindow({
                            isCustom:true,
                            content: html,
                            offsetY: 265,
                            offsetX: -99
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
                        showEChartsDetail(obj.singleOne,'sevenDay');
                    }

                    $('.close').on('click',function(){
                        cmap.clearInfoWindow();
                    });

                    //点击事件
                    $('.sevenDay').off('click').on('click',function(){
                        $('.changData').text(($(this).text()));
                        var hideData = $(this).attr('hide-data').split(',');
                        var singleIp = hideData[0];
                        var singleKey = hideData[1];
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sevenDay").show();
                        $("#sameDay").hide();
                        showEChartsDetail(singleIp,singleKey);
                    });

                    $('.sameDay').off('click').on('click',function(){
                        $('.changData').text(($(this).text()));
                        var hideData = $(this).attr('hide-data').split(',');
                        var singleIp = hideData[0];
                        var singleKey = hideData[1];
                        $(this).addClass("btnActive").siblings().removeClass("btnActive");
                        $("#sameDay").show();
                        $("#sevenDay").hide();
                        showEChartsDetail(singleIp,singleKey);
                    });
                }
            }, where);
        });
    }

    // 显示 echarts 详情( 进7日) （shuttleBus/getShiftBySiteBy7Day）
    function showEChartsDetail(stationIp,singleKey){
        //TODO  添加进7日 的流量 ajax
        $.ajax({
            url:window.AppConfig.RemoteApiUrl+"highWay/getStationFlowInSeven",
            type:"post",
            data:{
                stationIp:stationIp
            },
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    if(data && data.length >0){
                        var unit = ['辆','天'];
                        var legendArr = ["总流量","小型车数量","中型车数量","重型车数量"];

                        var option = {
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:legendArr,
                                x: 'center',
                                y: 'bottom',
                                textStyle:{color: '#fff'}
                            },
                            calculable : true,
                            xAxis : [
                                echartsCss.getxAxis(unit[0],data[0].STAT_DATE)
                            ],
                            yAxis : [
                                echartsCss.getyAxis(unit[0])
                            ],
                            series :[
                                echartsCss.getseries(unit[0],'line',data[0].TOTALFLOW),
                                echartsCss.getseries(unit[1],'line',data[0].LIGHT_VEHICLE),
                                echartsCss.getseries(unit[2],'line',data[0].MID_VEHICLE),
                                echartsCss.getseries(unit[3],'line',data[0].HEAVY_VEHICLE)
                            ]
                        }


                        controlLayer.that.getEchart('#'+singleKey,option);
                    }
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