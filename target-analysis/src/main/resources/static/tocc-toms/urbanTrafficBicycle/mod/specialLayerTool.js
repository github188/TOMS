// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/urbanTrafficBicycle/tpl/tpl.html',
    "dateutils",
    "tocc-toms/common/mod/map/poiconfig"
],function($,tpl,dateUtils,PoiConfig){
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
            if('1' == dataType){
                $(this).prop('checked',true);
                controlLayer.showLayer.layerName.push(dataType);
            }
        });

        //默认 设置可借可还（可借车辆）图层展示
        if(controlLayer.showLayer.layerName.length > 0){
            for(var i = 0; i < controlLayer.showLayer.layerName.length; i++){
                //判断 点击的是 可借可还( 1 )   --   公交换乘距离( 2 )
                if('1' == controlLayer.showLayer.layerName[i]){
                    //showLayerByName  设置 参数
                    showLayerByName('1',true);
                }else{
                    showLayerByName('2',false);
                }
            }
        }

        //  input 点击事件
        $('.layerInfo li li input').on('click',function(){
            var isChecked = $(this).is(":checked");
            var dataType = $(this).attr('data-type');
            //点击 图层控制按钮 关闭弹框
            controlLayer.that.$map.clearInfoWindow();
            //点击静态图层名
            if(controlLayer.showLayer.layerName[0] == dataType){
                showLayerByName(dataType,isChecked);
                controlLayer.showLayer.layerName[0] = dataType;
            }else{
                if(dataType == '1'){
                    $('#trainLayers').removeProp('checked');
                    controlLayer.that.$map.removeOverlay('2_layercontrol');
                    controlLayer.showLayer.layerName[0] = dataType;
                    showLayerByName(dataType,isChecked);
                }else{
                    $('#trainLayer').removeProp('checked');
                    controlLayer.that.$map.removeOverlay('1_layercontrol');
                    controlLayer.showLayer.layerName[0] = dataType;
                    showLayerByName(dataType,isChecked);
                }
            }
        });
    }

    // 根据 图层名称（layerName=SP_JC） 展示对应图层静态数据
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
                controlLayer.that.$map.removeOverlay(type+'_layercontrol');
                return;
            } else {
                controlLayer.that.$map.removeOverlay(type+'_layercontrol');
                return;
            }
        }

        //请求自行车可借可还数据接口
        queryBicycleData(type);

    }

    //请求自行车可借可还数据接口（bike/getAllBicycleStationInfo）
    function queryBicycleData(showType){
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
                        var icon = window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/GJZD_green.png";
                        //自行车数据返回  根据逻辑展示 （1 可借可还图层  2 公交换乘距离图层）
                        if('1' == showType){
                            //判断 可借可还图层 显示的图标
                            if(0.0 == data[i].availbikeRate || 1.0 > data[i].availbikeRate){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/ZXCTKD_red.png";
                            }else if(1.0 <= data[i].availbikeRate && 50.0 >= data[i].availbikeRate){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/ZXCTKD_yellow.png";
                            }else if(51.0 <= data[i].availbikeRate && 100.0 >= data[i].availbikeRate){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/ZXCTKD_green.png";
                            }else{
                                icon = '';
                            }
                        }else{
                            //判断 公交换乘距离图层 显示的图标
                            if(0.0 <= data[i].distance && 200.0 >= data[i].distance){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/GJZD_green.png";
                            }else if(201.0 <= data[i].distance && 500.0 >= data[i].distance){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/GJZD_blue.png";
                            }else if(501.0 <= data[i].distance && 1000.0 >= data[i].distance){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/GJZD_lavender.png";
                            }else if(1001.0 <= data[i].distance && 2000.0 >= data[i].distance){
                                icon =  window.AppConfig.RemoteApiUrl+"/tocc-toms/urbanTrafficBicycle/res/img/GJZD_violet.png";
                            }else{
                                icon = '';
                            }
                        }

                        data[i].icon= icon;
                        data[i].showType = showType;

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
        controlLayer.that.$map.addOverlay(marker,data.showType+'_layercontrol');
        //controlLayer.that.$map.setCenter(marker.getPosition());
        marker.addEventListener("click", function (m) {
            selectDetails(m.getData().detail);
        });
    }

    // 查询 详情
    function selectDetails(detail){
        var html = controlLayer.that.bikeInfoTemplate({data:detail});
        var point = new beyond.geometry.MapPoint(detail.x, detail.y);

        //生成 弹框
        var infoWindow = new beyond.maps.BInfoWindow({
            isCustom:true,
            content: html,
            offsetY: 345,
            offsetX: -180
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

    return controlLayer
})