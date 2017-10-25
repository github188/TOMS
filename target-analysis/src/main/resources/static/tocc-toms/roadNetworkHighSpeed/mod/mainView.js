/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/roadNetworkHighSpeed/mod/specialLayerTool',
        "echarts",
        "dateutils",
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "swiper",
        'libs/core/echart/3.7.1/macarons'

    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,dateutils,echartsCss,Mock,mapToolBox) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                //that.mockData()
                this.$map = {};
                this.mapUtils = mapUtils;
                that.footTabShow();
                that.echarts()
                that.getData()
            },
            render: function (options) {
                options = options || {};
               this.loadJs();
            },
            mockData:function(){
                 Mock.mock(window.AppConfig.RemoteApiUrl+"highWay/getFlowPercentage",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[{"percentageOfTrucks":".3030"},{"percentageOfETC":"0.2870"}]
                    return data;
                })
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
                //sevenDay();//初始化载入界面调用echart
                //$(".tabBut .sevenDay").click(function () {
                //    $(this).addClass("btnActive").siblings().removeClass("btnActive");
                //    $("#sevenDay").show();
                //    $("#sameDay").hide();
                //    $("#conFoot").show();
                //    sevenDay();
                //});
                //$(".tabBut .sameDay").click(function () {
                //    $(this).addClass("btnActive").siblings().removeClass("btnActive");
                //    $("#sameDay").show();
                //    $("#sevenDay").hide();
                //    $("#conFoot").hide();
                //    sameDay();
                //});
                //echart方法
                //function sevenDay() {
                //    var myChart = echarts.init(document.getElementById('sevenDay'),'macarons');
                //    var symbolSize = 8;
                //    var xAxisData = ['18/7','19/7','20/7','21/7','22/7','23/7','24/7'];//x轴需要传入的数据
                //    var seriesData = [10, 12, 21, 54, 260, 830, 710];//series需要传入的数据
                //    var seriesData2 = [30, 182, 434, 791, 390, 30, 10];//series需要传入的数据
                //    var seriesData3 = [1320, 1132, 601, 234, 120, 90, 20];//series需要传入的数据
                //    option = {
                //        tooltip: {
                //            trigger: 'axis'
                //        },
                //        grid: {
                //            top:'8%',
                //            left: '2%',
                //            right: '5%',
                //            bottom: '3%',
                //            containLabel: true
                //        },
                //        xAxis: {
                //            type : 'category', // category坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                //            boundaryGap : false, //
                //            axisLine: {
                //                show: true , //x轴的线
                //                lineStyle:{
                //                    color:'#00ffff' //轴线颜色
                //                }
                //            },
                //            axisLabel: {
                //                show: true,
                //                textStyle: {
                //                    fontSize: 14,//x轴文字大小
                //                    color:'#0f8dcc' //x轴文字颜色
                //                }
                //            },
                //            splitLine:{
                //                show:false, //分隔线
                //                lineStyle:{
                //                    color:'#25303b' //分隔线颜色
                //                }
                //            },
                //            splitArea:{
                //                show:false //分隔区域
                //            },
                //            data : xAxisData
                //        },
                //        yAxis: {
                //            type: 'value',
                //            axisLine: {
                //                show: true , //y轴的线
                //                lineStyle:{
                //                    color:'#00ffff' //轴线颜色
                //                }
                //            },
                //            axisLabel: {
                //                show: true,
                //                textStyle: {
                //                    fontSize: 14,//y轴文字大小
                //                    color:'#0f8dcc' //y轴文字颜色
                //                }
                //            },
                //            splitLine:{
                //                show:false, //分隔线
                //                lineStyle:{
                //                    color:'#25303b' //分隔线颜色
                //                }
                //            },
                //            splitArea:{
                //                show:false //分隔区域
                //            }
                //        },
                //        series: [
                //            {
                //                name:'入口车流',
                //                type: 'line',
                //                smooth: true, //平滑曲线显示，smooth为true时lineStyle不支持虚线
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default' //区域填充样式，目前仅支持'default'(实填充)
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,//折线点大小
                //                data: seriesData
                //            },
                //            {
                //                name:'出口车流',
                //                type: 'line',
                //                smooth: true,
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default'
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,
                //                data: seriesData2
                //            },
                //            {
                //                name:'总车流',
                //                type: 'line',
                //                smooth: true,
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default'
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,
                //                data: seriesData3
                //            }
                //        ]
                //    };
                //    // 使用刚指定的配置项和数据显示图表。
                //    myChart.setOption(option);
                //}
                //function sameDay() {
                //    var myChart = echarts.init(document.getElementById('sameDay'),'macarons');
                //    var symbolSize = 8;
                //    var xAxisData = ['18/7','19/7','20/7','21/7','22/7','23/7','24/7'];//x轴需要传入的数据
                //    var seriesData = [10, 12, 21, 54, 260, 830, 710];//series需要传入的数据
                //    var seriesData2 = [30, 182, 434, 791, 390, 30, 10];//series需要传入的数据
                //    var seriesData3 = [1320, 1132, 601, 234, 120, 90, 20];//series需要传入的数据
                //    option = {
                //        legend: {
                //            x:'right',
                //            textStyle:{
                //                color:'#789ec6'
                //            },
                //            data:['入口车流','出口车流','总车流']
                //        },
                //        tooltip: {
                //            trigger: 'axis'
                //        },
                //        grid: {
                //            top:'20%',
                //            left: '2%',
                //            right: '5%',
                //            bottom: '3%',
                //            containLabel: true
                //        },
                //        xAxis: {
                //            type : 'category', // category坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
                //            boundaryGap : false, //boundaryGap: [0.1, 0.1], 坐标轴两端空白策略，数组内数值代表百分比
                //            axisLine: {
                //                show: true , //x轴的线
                //                lineStyle:{
                //                    color:'#00ffff' //轴线颜色
                //                }
                //            },
                //            axisLabel: {
                //                show: true,
                //                textStyle: {
                //                    fontSize: 14,//x轴文字大小
                //                    color:'#0f8dcc' //x轴文字颜色
                //                }
                //            },
                //            splitLine:{
                //                show:false, //分隔线
                //                lineStyle:{
                //                    color:'#25303b' //分隔线颜色
                //                }
                //            },
                //            splitArea:{
                //                show:false //分隔区域
                //            },
                //            data : xAxisData
                //        },
                //        yAxis: {
                //            type: 'value',
                //            name:'万人次', //y轴坐标轴名称
                //            nameTextStyle:{ //坐标轴名称文字样式，默认取全局配置，颜色跟随axisLine主色，可设
                //                color:'#00ffff'
                //            },
                //            axisLine: {
                //                show: true , //y轴的线
                //                lineStyle:{
                //                    color:'#00ffff' //轴线颜色
                //                }
                //            },
                //            axisLabel: {
                //                show: true,
                //                textStyle: {
                //                    fontSize: 14,//y轴文字大小
                //                    color:'#0f8dcc' //y轴文字颜色
                //                }
                //            },
                //            splitLine:{
                //                show:false, //分隔线
                //                lineStyle:{
                //                    color:'#25303b' //分隔线颜色
                //                }
                //            },
                //            splitArea:{
                //                show:false //分隔区域
                //            }
                //        },
                //        series: [
                //            {
                //                name:'入口车流',
                //                type: 'line',
                //                smooth: true, //平滑曲线显示，smooth为true时lineStyle不支持虚线
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default' //区域填充样式，目前仅支持'default'(实填充)
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,//折线点大小
                //                data: seriesData
                //            },
                //            {
                //                name:'出口车流',
                //                type: 'line',
                //                smooth: true,
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default'
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,
                //                data: seriesData2
                //            },
                //            {
                //                name:'总车流',
                //                type: 'line',
                //                smooth: true,
                //                itemStyle: {
                //                    normal: {
                //                        areaStyle: {
                //                            type: 'default'
                //                        }
                //                    }
                //                },
                //                symbolSize: symbolSize,
                //                data: seriesData3
                //            }
                //        ]
                //    };
                //    // 使用刚指定的配置项和数据显示图表。
                //    myChart.setOption(option);
                //}
            },
            getData:function(){
                var that =this;
                // 左侧数据面板
                $.ajax({
                    data:{
                        dateType:dateutils.dateFmt(new Date(),"yyyyMMdd")
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"highWay/getCountFlow",
                    success:function(data){
                      $(".footLeft .table .dataNumber1").html(that.toThousands(data.data[2].dayData[0].CFCLZL));
                      $(".footLeft .table .dataNumber4").html(that.toThousands(data.data[2].dayData[0].DDCLZL));
                      $(".footLeft .table .dataNumber7").html(that.toThousands(data.data[2].dayData[0].CLZZ)); 
                      $(".footLeft .table .dataNumber2").html(that.toThousands(data.data[1].monthData[0].CFCLZL));
                      $(".footLeft .table .dataNumber5").html(that.toThousands(data.data[1].monthData[0].DDCLZL));
                      $(".footLeft .table .dataNumber8").html(that.toThousands(data.data[1].monthData[0].CLZZ));
                      $(".footLeft .table .dataNumber3").html(that.toThousands(data.data[0].yearData[0].CFCLZL));
                      $(".footLeft .table .dataNumber6").html(that.toThousands(data.data[0].yearData[0].DDCLZL));
                      $(".footLeft .table .dataNumber9").html(that.toThousands(data.data[0].yearData[0].CLZZ));
                      
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
                $.ajax({
                    data:{
                        dateType:dateutils.dateFmt(new Date(),"yyyyMMdd")
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"highWay/getFlowPercentage",
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                         that.swiperShow(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
                $.ajax({
                    data:{
                        dateType:dateutils.dateFmt(new Date(),"yyyyMMdd")
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"highWay/getCountFlowByDay",
                    success:function(data){
                         that.swiperShow2(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                });        
                $.ajax({
                    data:{
                        dateType:dateutils.dateFmt(new Date(),"yyyyMMdd")
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"highWay/getCountFlowAvgDay",
                    success:function(data){
                            
                        that.swiperShow3(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                });    
            },
             // 生成echarts
             getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                     var myChart = echarts.init(selectDom[i],'macarons');
                     
                     myChart.setOption(option)
                }
               
            },
            // 生成swiper
            creatSwiper:function(ele,dataOption,tabArr){
                var that= this;
                  var mySwiper = new Swiper(ele, {     
                    autoplay : 3000,
                    lazyLoading : true,
                    loop:true,
                    pagination : '.swiper-pagination',
                    paginationClickable: true,
                    autoplayDisableOnInteraction : false,
                    onSlideChangeEnd:function(swiper){
                        var id = $(swiper.slides[swiper.activeIndex]).data("id");                      
                        that.getEchart(id,dataOption[swiper.activeIndex]);                    
                    },
                    paginationClickable: true,
                    paginationBulletRender: function (swiper, index, className) {
                        return '<span class="' + className + '">' + tabArr[index] + '</span>';
                    }
                })
                 $(".swiper-container").mouseenter(function(){
                    mySwiper.stopAutoplay();
                }).mouseleave(function(){
                    mySwiper.startAutoplay();
                })
            },
            swiperShow:function(options){
                 var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年"+todayMonth+"月入口流量",todayYear+"年"+todayMonth+"月出口流量"];
                var legendArr = [["ETC","非ETC"],["货车","客车"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData1(options,legendArr)
                that.creatSwiper("#swiperBox1",dataOption,tabArr)     
            },
            assemblyData1:function(options,legendArr){
                var dataObj={
                    swiper1:{
                        xData:["ETC","非ETC"],
                        yData:[(options[1].percentageOfETC*100).toFixed(2),(100-(options[1].percentageOfETC*100).toFixed(2)).toFixed(2)],
                      
                    },
                    swiper2:{
                        xData:["货车","客车"],
                        yData:[(options[0].percentageOfTrucks*100).toFixed(2),(100-(options[0].percentageOfTrucks*100).toFixed(2)).toFixed(2)],
                    },
                }
               
                var dataOption=[
                    {
                        tooltip : {
                           trigger: 'axis'
                        },  
                        calculable : false,
                        series: echartsCss.getseriesPie(legendArr[1],dataObj.swiper2.yData)
                    },{
                        
                        tooltip : {
                           trigger: 'axis'
                        },      
                        calculable : false, 
                        series: echartsCss.getseriesPie(legendArr[0],dataObj.swiper1.yData)
                   
                    },{
                        tooltip : {
                           trigger: 'axis'
                        },
                        calculable : false,  
                        series: echartsCss.getseriesPie(legendArr[1],dataObj.swiper2.yData)
                    },{
                          tooltip : {
                           trigger: 'axis'
                        },
                        calculable : false,
                        series: echartsCss.getseriesPie(legendArr[0],dataObj.swiper1.yData)
                    }
                ]
                return dataOption;
            },
            swiperShow2:function(options){
                 var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年"+todayMonth+"月每日车流量",todayYear+"年"+todayMonth+"月收费站日均车流量"];
                var legendArr = [["入口","出口","总流量"],["入口","出口","总流量"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData2(options,legendArr)
                that.creatSwiper("#swiperBox2",dataOption,tabArr)     
            },
            assemblyData2:function(options,legendArr){
                var dataObj={
                    swiper1:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[],
                      
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[],
                    },
                }
               for(var i = 0;i<options[0].everyDayFLow.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].everyDayFLow[i].TJSJ_D)
                   
                    // 设置y轴
              
                    dataObj.swiper1.yData1.push((options[0].everyDayFLow[i].TOTALCFCLZL/1).toFixed(2)),
                    dataObj.swiper1.yData2.push((options[0].everyDayFLow[i].TOTALDDCLZL/1).toFixed(2)),
                    dataObj.swiper1.yData3.push((options[0].everyDayFLow[i].TOTALCLZZ/1).toFixed(2)) 
                }
                for(var i = 0;i<options[1].stationFLow.length;i++){
                    // 设置x轴
                    dataObj.swiper2.xData.push(options[1].stationFLow[i].ZDMC)                
                    // 设置y轴    
                    dataObj.swiper2.yData1.push((options[1].stationFLow[i].INFLOW/1).toFixed(2)),
                    dataObj.swiper2.yData2.push((options[1].stationFLow[i].OUTFLOW/1).toFixed(2)),
                    dataObj.swiper2.yData3.push((options[1].stationFLow[i].TOTALFLOW/1).toFixed(2)) 
                }
            
                var dataOption=[
                    {
                      tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[1],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(2),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[1][0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1][1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[1][2],"line",dataObj.swiper2.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(3),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[1],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(2),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[1][0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1][1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[1][2],"line",dataObj.swiper2.yData3)]
                    },{
                         tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                         color:echartsCss.getEchartColor(3),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3)]
                    }
                ]
                return dataOption;
            },
            swiperShow3:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年月均车流量",todayYear+"年收费站流量TOP5"];
                var legendArr = [["入口","出口","总流量"],["入口","出口"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData3(options,legendArr)
                that.creatSwiper("#swiperBox3",dataOption,tabArr)     
            },
            assemblyData3:function(options,legendArr){
                var dataObj={
                    swiper1:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[],
                      
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                     
                    },
                }
               for(var i = 0;i<options[1].avgFLowMap.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[1].avgFLowMap[i].dataStr)
                   
                    // 设置y轴
              
                    dataObj.swiper1.yData1.push((options[1].avgFLowMap[i].cfAvgFlowStr/1).toFixed(2)),
                    dataObj.swiper1.yData2.push((options[1].avgFLowMap[i].ddAvgFlowStr/1).toFixed(2)),
                    dataObj.swiper1.yData3.push((options[1].avgFLowMap[i].clAvgFlowStr/1).toFixed(2)) 
                }
                for(var i = 0;i<options[0].topFiveMap.length;i++){
                    // 设置x轴
                    dataObj.swiper2.xData.push(options[0].topFiveMap[i].ZDMC)                
                    // 设置y轴    
                    dataObj.swiper2.yData1.push((options[0].topFiveMap[i].TOTALCFLZL/1).toFixed(2)),
                    dataObj.swiper2.yData2.push((options[0].topFiveMap[i].TOTALDDCLZL/1).toFixed(2))
                  
                }
               
                var dataOption=[
                    {
                      tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[1],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[1][0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1][1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[1][2],"line",dataObj.swiper2.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(1),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[1],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[1][0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1][1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[1][2],"line",dataObj.swiper2.yData3)]
                    },{
                         tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                             y:  37, 
                            textStyle:{color: '#fff'}
                        },
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,
                        color:echartsCss.getEchartColor(1),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3)]
                    }
                ]
                return dataOption;
            }
        });


        return view;
    });


