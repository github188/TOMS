// 图层控制工具事件

define([
    "jquery",
    "dateutils"
],function($,dateUtils){
    var mapTool = {};

    mapTool.that = {};
    // 添加 地图栏工具事件
    mapTool.addMapToolEvent=function(_that){
        mapTool.that = _that;
        addToolEvent();
    }

    // 添加 地图栏工具
    function addToolEvent(){
            // 工具栏切换
            // 其他3个按钮
            $(".mapToolBox .mapTool li.toolLi").on("click",function(){
                if($(this).hasClass("toolActive")){
                    $(this).removeClass("toolActive");
                    $(".mapToolBox .mapToolDateil").hide()

                }else{
                    $(this).addClass("toolActive").siblings(".toolLi").removeClass("toolActive");
                    $(".mapToolBox .mapToolDateil").show()
                    $(".mapToolBox .mapToolDateil>li").eq($(this).index(".toolLi")).addClass("active").siblings().removeClass("active");
                }

            })
            $(".layerBox .layerTab>li").on("click",function(){
                $(this).addClass("active").siblings().removeClass("active");
                $(".mapToolBox .layerInfo>li").eq($(this).index()).addClass("active").siblings().removeClass("active");
            })
            //卫星地图按钮
            $(".mapToolBox .mapTool li.wxTool").on("click",function(){
                $(this).toggleClass("toolActive");
                if($(this).hasClass("toolActive")){
                    mapTool.that.$map.setMapType(beyond.maps.MapType.IMAGE);
                }else{
                    mapTool.that.$map.setMapType(beyond.maps.MapType.VECTOR);
                }
            })

            // 工具栏
            // 测线
            $("#measuringLine").on("click",function(){
                mapTool.that.$map.setMouseTool(DrawType.MEASURE)
            });
            // 测面
            $("#measuringSurface").on("click",function(){
                mapTool.that.$map.setMouseTool(DrawType.MEASAREA );
            })
            // 路况页签下的事件
            $(".timeChoiceTab .timeChoiceBtn li").on("click",function(){
                $(this).addClass("active").siblings().removeClass("active");
                $(".timeChoiceBox>div").eq($(this).index()).addClass("active").siblings().removeClass("active");
            })
            // 时间选择
            if($("#ECalendarDate").length > 0){
                $("#ECalendarDate").ECalendar({
                    type:"time",   //模式，time: 带时间选择; date: 不带时间选择;
                    stamp : false,   //是否转成时间戳，默认true;
                    offset:[0,2],   //弹框手动偏移量;
                    skin:"#3755B7",   //皮肤颜色，默认随机，可选值：0-8,或者直接标注颜色值;
                    step:10,   //选择时间分钟的精确度;
                    callback:function(v,e){} //回调函数
                });
            }
    }

    return mapTool
})