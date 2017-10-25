// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/urbanTrafficTaxi/tpl/tpl.html',
    "tocc-toms/common/utils/mapClusterUtil",
    "dateutils"
],function($,tpl,mapClusterUtil,dateUtils){
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
            //点击行业类别
            controlLayer.showLayer.industry.push(dataType);
            $(this).prop('checked',true);
        });

        //默认 设置图层全部展示
        if(controlLayer.showLayer.industry.length > 0){
            var industry = "";
            for(var i = 0; i<controlLayer.showLayer.industry.length; i++){
                industry += controlLayer.showLayer.industry[i] + ',';
            }
            industry = industry.substring(0,industry.length-1);
            //展示车辆实时数据
            showClusterByIndustry(industry,window.AppConfig.scode);
        }

        //  input 点击事件
        $('.layerInfo li li input').on('click',function(){
            //点击 图层控制按钮 关闭弹框
            controlLayer.that.$map.clearInfoWindow();
            //查询出租车辆  数据
            queryTaxiCarData();
            var isChecked = $(this).is(":checked");
            var dataType = $(this).attr('data-type');
            //点击 出租车实时分布图层
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
        });
    }

    // 根据 行业类别（industry=011,012） 展示对应车辆实时数据(聚合图层)
    function showClusterByIndustry(industry,areaCode){
        queryTaxiCarData();
        mapClusterUtil.clusterTaxi(industry,controlLayer.that.$map,areaCode,function(data){
            //markerCluster 点击后执行的方法（展示点击marker的详情）
            showBaseDetail(data);
        });
    }

    // 查询出租车辆  数据
    function queryTaxiCarData(){
        $.ajax({
            type:"post",
            data:{
                industry:'090',
                areaCode:window.AppConfig.xcode
            },
            url:window.AppConfig.RemoteApiUrl+"taxi/getOnlineByTaxi",
            //设置响应时长
            //timeOut:10000,
            success:function(result){
                if((typeof result)=="string"){
                    result=JSON.parse(result);
                }
                if(result.returnFlag=="1"){
                    var data = result.data;
                    var emptyCarNo = 0;
                    var heavyTruckNo = 0;
                    var offlineCarNo = 0;
                    for (var i = 0; i< data.length; i++){
                        offlineCarNo += (data[i].zl - data[i].sxCount || 0);
                        heavyTruckNo += data[i].zcCount || 0;
                        emptyCarNo += data[i].ccCount || 0;
                    }
                    $('.emptyCar').text(emptyCarNo);
                    $('.heavyTruck').text(heavyTruckNo);
                    $('.offlineCar').text(offlineCarNo);
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    layer.msg("出租车数据获取超时")
                }
            },
            error:function(err){
                console.log(err)
                layer.msg("出租车数据获取失败")
            }
        });
    }

    // 显示 基础详情
    function showBaseDetail(data){
        //markerCluster 点击后执行的方法（展示点击marker的详情）
        if(data){
            data.time = dateUtils.dateFmt(new Date(data.gpsTime.time), 'yyyy-MM-dd hh:mm:ss');
            if('0' == data.vehicleState){
                data.runState = '空车';
            }else if('1' == data.vehicleState){
                data.runState = '重车';
            }else{
                data.runState = '掉线';
            }
            var html = controlLayer.that.carInfoTemplate({data:data});
            var point = new beyond.geometry.MapPoint(data.longitude, data.latitude);

            //生成 弹框
            var infoWindow = new beyond.maps.BInfoWindow({
                isCustom:true,
                content: html,
                offsetY: 273,
                offsetX: -181
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
        }else{
            console("详情暂无数据");
        }
    }

    return controlLayer
})