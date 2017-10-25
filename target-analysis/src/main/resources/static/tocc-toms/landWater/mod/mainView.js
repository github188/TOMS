/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/landWater/mod/specialLayerTool',
        "dateutils",
        "echarts",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        'libs/core/echart/3.7.1/macarons'

    ],
    function (BaseView,mapUtils,specialLayerTool,dateutils,echarts,mapToolBox) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                this.$map = {};
                this.mapUtils = mapUtils;
                //that.echarts()
            },
            render: function (options) {
                options = options || {};
                this.loadJs();
            },
            // 加载地图
            loadJs: function () {
                var that = this;
                that.$map = mapUtils.initMap("mapContainer", function () {
                    // 工具栏逻辑
                    mapToolBox.addMapToolEvent(that);
                    //工具栏 事件
                    specialLayerTool.addEvent(that,true,echarts);
                });

            },
            echarts:function () {
                sevenDay();//初始化载入界面调用echart
                //echart方法
                function sevenDay() {
                    var myChart = echarts.init(document.getElementById('sevenDay'),'macarons');
                    var symbolSize = 8;
                    var xAxisData = ['18/7','19/7','20/7','21/7','22/7','23/7','24/7'];//x轴需要传入的数据
                    var seriesData = [10, 12, 21, 54, 260, 830, 710];//series需要传入的数据
                    var seriesData2 = [30, 182, 434, 791, 390, 30, 10];//series需要传入的数据
                    var seriesData3 = [13200000000, 1132, 601, 234, 120, 90, 20];//series需要传入的数据
                    option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top:'15%',
                            left: '2%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type : 'category', // category坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                            boundaryGap : false, //
                            axisLine: {
                                show: true , //x轴的线
                                lineStyle:{
                                    color:'#00ffff' //轴线颜色
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: 14,//x轴文字大小
                                    color:'#0f8dcc' //x轴文字颜色
                                }
                            },
                            splitLine:{
                                show:false, //分隔线
                                lineStyle:{
                                    color:'#25303b' //分隔线颜色
                                }
                            },
                            splitArea:{
                                show:false //分隔区域
                            },
                            data : xAxisData
                        },
                        yAxis: {
                            type: 'value',
                            name:'万人次',
                            axisLine: {
                                show: true , //y轴的线
                                lineStyle:{
                                    color:'#00ffff' //轴线颜色
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: 14,//y轴文字大小
                                    color:'#0f8dcc' //y轴文字颜色
                                }
                            },
                            splitLine:{
                                show:false, //分隔线
                                lineStyle:{
                                    color:'#25303b' //分隔线颜色
                                }
                            },
                            splitArea:{
                                show:false //分隔区域
                            }
                        },
                        series: [
                            {
                                name:'入口车流',
                                type: 'line',
                                smooth: true, //平滑曲线显示，smooth为true时lineStyle不支持虚线
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default' //区域填充样式，目前仅支持'default'(实填充)
                                        }
                                    }
                                },
                                symbolSize: symbolSize,//折线点大小
                                data: seriesData
                            },
                            {
                                name:'出口车流',
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                },
                                symbolSize: symbolSize,
                                data: seriesData2
                            },
                            {
                                name:'总车流',
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                },
                                symbolSize: symbolSize,
                                data: seriesData3
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }
            },
            mapToolBox:function(){
                var that = this;
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

                });
                $(".layerBox .layerTab>li").on("click",function(){
                    $(this).addClass("active").siblings().removeClass("active");
                    $(".mapToolBox .layerInfo>li").eq($(this).index()).addClass("active").siblings().removeClass("active");
                });

                //卫星地图按钮
                $(".mapToolBox .mapTool li.wxTool").on("click",function(){
                    $(this).toggleClass("toolActive");
                    if($(this).hasClass("toolActive")){
                        that.$map.setMapType(beyond.maps.MapType.IMAGE);
                    }else{
                        that.$map.setMapType(beyond.maps.MapType.VECTOR);
                    }
                })

                // 工具栏
                // 测线
                $("#measuringLine").on("click",function(){
                    that.$map.setMouseTool(DrawType.MEASURE)
                });
                // 测面
                $("#measuringSurface").on("click",function(){
                    that.$map.setMouseTool(DrawType.MEASAREA );
                })
            }

        });


        return view;
    });


