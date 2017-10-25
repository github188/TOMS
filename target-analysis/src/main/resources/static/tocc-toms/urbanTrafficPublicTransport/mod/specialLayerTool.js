// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/urbanTrafficPublicTransport/tpl/tpl.html',
    "tocc-toms/common/utils/mapClusterUtil",
    "dateutils",
    "tocc-toms/common/mod/map/poiconfig"
],function($,tpl,mapClusterUtil,dateUtils,PoiConfig){
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
        //默认 设置可借可还（可借车辆）图层勾选
        $(".layerInfo").find("input[type='checkbox']").each(function(){
            var dataType = $(this).attr('data-type');
            if('080' == dataType){
                $(this).prop('checked',true);
                controlLayer.showLayer.layerName.push(dataType);
            }
        });

        //默认 设置可借可还（可借车辆）图层展示
        if(controlLayer.showLayer.layerName.length > 0){
            for(var i = 0; i < controlLayer.showLayer.layerName.length; i++){
                //判断 点击的是 可借可还( 1 )   --   公交换乘距离( 2 )
                if('080' == controlLayer.showLayer.layerName[i]){
                    //showLayerByName  设置 参数
                    showLayerByName(controlLayer.showLayer.layerName[i],true);
                }
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
            queryBicycleData(dataType);
            //点击公交车图层
            if(dataType.indexOf('SP') != -1){
                //兄弟元素
                var sibEle = $(this).parent().siblings().find('input');
                //判断 图层里是否含有 覆盖 图
                var overlays = controlLayer.that.$map.getOverlays(dataType);
                if(overlays != null && overlays.length > 0){
                    if (isChecked) {
                        controlLayer.that.$map.hideOverlays(sibEle.attr('data-type'));
                        controlLayer.that.$map.showOverlays(dataType);
                    } else {
                        controlLayer.that.$map.hideOverlays(dataType);
                    }
                    sibEle.prop('checked',false);
                }else{
                    controlLayer.that.$map.hideOverlays(sibEle.attr('data-type'));
                    sibEle.prop('checked',false);
                    mapClusterUtil.addTopicLayer(controlLayer.that.$map,dataType);
                }
            }else{
                if (isChecked) {
                    controlLayer.that.$map.showOverlays(dataType+'_layercontrol');
                } else {
                    controlLayer.that.$map.hideOverlays(dataType+'_layercontrol');
                }
            }
        });
    }

    // 展示对应图层数据
    function showLayerByName(type,isChecked){
            setLayerVisible(type,isChecked);
    }

    //TODO  从写  静态数据 展示
    //获取图层 展示地图数据 并添加数据
    function setLayerVisible(type, visible,that,where, locateSymbol) {
        if (!controlLayer.that.$map) {
            return;
        }
        controlLayer.that ._templateFn(tpl);
        var featureLayer = controlLayer.that.$map.getOverlays(type + "_layercontrol");
        if (featureLayer && featureLayer.length > 0) {
            if (visible) {
                controlLayer.that.$map.showOverlay(type+'_layercontrol');
                return;
            } else {
                controlLayer.that.$map.removeOverlay(type+'_layercontrol');
                return;
            }
        }

        //请求公交车可借可还数据接口
        queryBicycleData(type);

    }

    //请求公交车数据接口（bus/getLineData）
    function queryBicycleData(showType){
        //根据  showType 显示对应的数据图层
        $.ajax({
            type:"post",
            data:{
                industry:showType,
                areaCode:window.AppConfig.xcode
            },
            url:window.AppConfig.RemoteApiUrl+"bus/getLineData",
            //设置响应时长
            //timeOut:10000,
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    var onlineBus = 0;
                    var offlineBus = 0;
                    for (var i = 0; i< data.length; i++){
                        var icon = window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficPublicTransport/res/img/offlineBus.png";
                        //自行车数据返回  根据逻辑展示 （1 可借可还图层  2 公交换乘距离图层）
                        if('080' == showType){
                            //判断 可借可还图层 显示的图标
                            if(1 == data[i].ONLINE_STATUS){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficPublicTransport/res/img/onlineBus.png";
                                onlineBus++;
                            }else if(0 == data[i].ONLINE_STATUS){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficPublicTransport/res/img/offlineBus.png";
                                offlineBus++;
                            }else{
                                icon = '';
                            }
                        }

                        data[i].icon= icon;
                        data[i].showType = showType;
                        data[i].layerName = showType;

                        //TODO 添加marker
                        addMarker(data[i]);
                    }

                    //添加覆盖物结束 开始 填充公交车在线离线数据
                    $('.online').text(onlineBus);
                    $('.offline').text(offlineBus);
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    layer.msg("公交车数据获取超时")
                }
            },
            error:function(err){
                console.log(err)
                layer.msg("公交车数据获取失败")
            }
        });
    }

    function addMarker(data){
        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(data.GPSLON, data.GPSLAT),//位置
            icon: data.icon,//图标
            //width: 20,//宽度
            //height: 34,//高度
            editEnable: false,
            offsetX: 0,
            offsetY: 17,
            data:{"detail":data}
        });
        controlLayer.that.$map.addOverlay(marker,data.showType+'_layercontrol');
        //controlLayer.that.$map.setCenter(marker.getPosition());
        marker.addEventListener("click", function (m) {
            selectDetails(m.getData().detail);
        });
    }

    // 查询 详情
    function selectDetails(detail){
        $.ajax({
            type:"post",
            data:{
                plateNo:detail.PLATE_NUMBER
            },
            url:window.AppConfig.RemoteApiUrl+"bus/getBusLine",
            //设置响应时长
            //timeOut:10000,
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = detail;
                    if(result.data && result.data.length > 0){
                        data.MC = result.data[0].MC;
                    }else{
                        data.MC = '暂无数据';
                    }
                    if(data.TERMINAL_TIME){
                        data.time = dateUtils.dateFmt(new Date(data.TERMINAL_TIME), 'yyyy-MM-dd hh:mm:ss');
                    }else{
                        data.time = '暂无数据';
                    }
                    var html = controlLayer.that.carInfoTemplate({data:data});
                    var point = new beyond.geometry.MapPoint(data.GPSLON, data.GPSLAT);

                    //生成 弹框
                    var infoWindow = new beyond.maps.BInfoWindow({
                        isCustom:true,
                        content: html,
                        offsetY: 290,
                        offsetX: -183
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
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    layer.msg("公交车数据获取超时")
                }
            },
            error:function(err){
                console.log(err)
                layer.msg("公交车数据获取失败")
            }
        });
    }

    return controlLayer
})