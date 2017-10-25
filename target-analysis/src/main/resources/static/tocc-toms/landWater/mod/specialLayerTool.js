// 图层控制（包含）

define([
    "jquery",
    'text!tocc-toms/landWater/tpl/tpl.html',
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
        Mock.mock(window.AppConfig.RemoteApiUrl+"ship/getShip",function(){
            var data = {};
            data.returnFlag = "1";
            data.data=[
                {
                    MC:'绍兴市柯桥区水上巴士游船有限公司',
                    DZ:'瓜渚湖南岸公园',
                    X:30.060797,
                    Y:120.496368,
                    FZR:Mock.Random.cname(),
                    LXDH:Mock.Random.integer(1000,10000)
                },{
                    MC:'绍兴运输有限公司',
                    DZ:'东浦镇体育场路',
                    X:30.049362,
                    Y:120.534734,
                    FZR:Mock.Random.cname(),
                    LXDH:Mock.Random.integer(1000,10000)
                }
            ]

            return data;
        })
    }

    // 根据 图层名称（layerName=SP_JC） 展示对应图层静态数据
    function showLayerByName(layerName,isChecked){
        setLayerVisible(layerName, isChecked,controlLayer.that);
    }

    //TODO  从写  静态数据 展示
    //获取图层 展示地图数据 并添加数据
    function setLayerVisible(layerName, visible) {
        if (!controlLayer.that.$map) {
            return;
        }
        var featureLayer = controlLayer.that.$map.getOverlays(layerName + "_layercontrol");
        if (featureLayer && featureLayer.length > 0) {
            if (visible) {
                controlLayer.that.$map.showOverlays(layerName+'_layercontrol');
                return;
            } else {
                controlLayer.that.$map.hideOverlays(layerName+'_layercontrol');
                return;
            }
        }

        //船舶
        queryData(layerName);
    }

    //请求船舶数据接口（ship/getShip）
    function queryData(layerName){
        //根据  showType 显示对应的数据图层
        $.ajax({
            type:"post",
            data:{
                layerName:layerName
            },
            url:window.AppConfig.RemoteApiUrl+"ship/getShip",
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
                        data[i].layerName = layerName;
                        var splitLayerName = layerName.substring(layerName.indexOf('_')+1);
                        data[i].icon = window.AppConfig.RemoteApiUrl+"/tocc-toms/common/res/img/layerImg/"+splitLayerName+".png";
                        //添加marker
                        addMarker(data[i]);
                    }
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();
                    layer.msg("船舶数据获取超时")
                }
            },
            error:function(err){
                console.log(err);
                layer.msg("船舶数据获取失败")
            }
        });
    }

    function addMarker(data){
        var marker = new beyond.maps.Marker({
            position: new beyond.geometry.MapPoint(data.X, data.Y),//位置
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

    // 查询 详情
    function selectDetails(detail){
        var html = controlLayer.that.cbInfoTemplate({data:detail});
        var point = new beyond.geometry.MapPoint(detail.X, detail.Y);

        //生成 弹框
        var infoWindow = new beyond.maps.BInfoWindow({
            isCustom:true,
            content: html,
            offsetY: 307,
            offsetX: -202
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