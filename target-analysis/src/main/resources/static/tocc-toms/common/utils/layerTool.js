// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/common/res/tpl/tpl.html',
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
        controlLayer.that.mapUtils.setFeatureLayerVisible(controlLayer.that.$map, layerName, isChecked,controlLayer.that);
    }

    // 显示 基础详情
    function showBaseDetail(data){
        //markerCluster 点击后执行的方法（展示点击marker的详情）
        if(data){
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

    return controlLayer
})