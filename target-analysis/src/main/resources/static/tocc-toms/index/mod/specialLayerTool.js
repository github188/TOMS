// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/index/tpl/tpl.html',
    "tocc-toms/common/utils/echartsCss",
    "tocc-toms/common/utils/mapClusterUtil",
    'tocc-toms/common/mod/map/poiconfig',
    "dateutils"
],function($,tpl,echartsCss,mapClusterUtil,PoiConfig,dateUtils){
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
                if('SP_ZXCTKD' != dataType && 'SP_HCZ' != dataType){
                    controlLayer.showLayer.layerName.push(dataType);
                    $(this).prop('checked',true);
                }
            }
            //点击行业类别
            if(dataType.indexOf('SP') == -1){
                controlLayer.showLayer.industry.push(dataType);
                $(this).prop('checked',true);
            }
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
        if('SP_ZXCTKD' == layerName){
            var featureLayer = controlLayer.that.$map.getOverlays(layerName + "_layercontrol");
            if (featureLayer && featureLayer.length > 0) {
                if (isChecked) {
                    controlLayer.that.$map.showOverlays(layerName+'_layercontrol');
                    return;
                } else {
                    controlLayer.that.$map.hideOverlays(layerName+'_layercontrol');
                    return;
                }
            }
            queryBicycleData(layerName);
        }else{
            setFeatureLayerVisible(controlLayer.that.$map, layerName, isChecked,controlLayer.that);
        }
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
                            if('SP_HZL' == layer){
                                html = controlLayer.that.echartsInfoTemplate({data:obj});
                            }else{
                                html = controlLayer.that.staticCompanyInfoTemplate({data:obj});
                            }
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
                        }
                    });
                }
            }, where);
        });
    }

    //请求自行车可借可还数据接口（bike/getAllBicycleStationInfo）
    function queryBicycleData(layerName){
        //根据  showType 显示对应的数据图层
        $.ajax({
            type:"post",
            data:{},
            url:window.AppConfig.RemoteApiUrl+"bike/getAllBicycleStationInfo",
            //设置响应时长
            //timeOut:10000,
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    if(!data) return;
                    for (var i = 0; i< data.length; i++){
                        data[i].availbikeRate = (data[i].availbikeRate*100).toFixed(0);
                        data[i].unavailbikeRate =  (data[i].unavailbikeRate*100).toFixed(0);
                        var icon = window.AppConfig.RemoteApiUrl+"/tocc-toms/common/res/img/layerImg/ZXCTKD.png";
                        //自行车数据返回  根据逻辑展示 （1 可借可还图层  2 公交换乘距离图层）
                        data[i].icon= icon;
                        data[i].layerName = layerName;

                        //TODO 添加marker
                        addMarker(data[i])
                    }
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    layer.msg("自行车数据获取超时")
                }
            },
            error:function(err){
                console.log(err)
                layer.msg("自行车数据获取失败")
            }
        });
    }

    function addMarker(data){
        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(data.x, data.y),//位置
            icon: data.icon,//图标
            //width: 20,//宽度
            //height: 34,//高度
            editEnable: false,
            offsetX: 0,
            offsetY: 17,
            data:{"detail":data}
        });
        controlLayer.that.$map.addOverlay(marker,data.layerName+'_layercontrol');
        //controlLayer.that.$map.setCenter(marker.getPosition());
        marker.addEventListener("click", function (m) {
            selectDetails(m.getData().detail);
        });
    }

    // 查询 详情（自行车可借可换详情 ）
    function selectDetails(detail){
        var html = controlLayer.that.bikesInfoTemplate({data:detail});
        var point = new beyond.geometry.MapPoint(detail.x, detail.y);

        //生成 弹框
        var infoWindow = new beyond.maps.BInfoWindow({
            isCustom:true,
            content: html,
            offsetY: 313,
            offsetX: -179
        });

        var height =  controlLayer.that.$map.getExtent().getHeight();
        var y = point.y + height * 0.2;
        var x = point.x;

        infoWindow.open(controlLayer.that.$map, point);
        controlLayer.that.$map.setCenter(new beyond.geometry.MapPoint(x, y));

        $('.close').on('click',function(){
            controlLayer.that.$map.clearInfoWindow();
        });
        controlLayer.that.topHeight();
    }

    // 显示 基础详情(实时车辆)
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
                offsetY: 280,
                offsetX: -167
            });

            var height =  controlLayer.that.$map.getExtent().getHeight();
            var y = point.y + height * 0.2;
            var x = point.x;

            infoWindow.open(controlLayer.that.$map, point);
            controlLayer.that.$map.setCenter(new beyond.geometry.MapPoint(x, y));

            $('.close').on('click',function(){
                controlLayer.that.$map.clearInfoWindow();
            });
        }else{
            console("详情暂无数据");
        }
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

    return controlLayer
})