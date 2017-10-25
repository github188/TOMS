/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/intercityRailway/mod/specialLayerTool',
        "echarts",
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "dateutils",
        "swiper",
        'libs/core/echart/3.7.1/macarons'

    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,echartsCss,Mock,mapToolBox,dateutils) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                 that.footTabShow();
                this.$map = {};
                
                this.mapUtils = mapUtils;
                //that.mockData();
                that.getData();
            },

            render: function (options) {
                options = options || {};
                this.loadJs();
            },
            mockData:function(){

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
            getData:function(){
                var that= this;
                var dataYear  = dateutils.dateFmt(new Date(),"yyyy");
                var dataMonth = dateutils.dateFmt(new Date(),"yyyyMM");
                var dataday = dateutils.dateFmt(new Date(),"yyyyMMdd");
                var option={
                   dateTypeYear:dataYear,
                   dateTypeMonth:dataMonth,
                   dateTypeDay:dataday
                }
                // 左侧数据面板
                $.ajax({
                    data:option,
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"/train/getAllOutInByYearMonthDay",
                    success:function(data){
                      $(".footLeft .railwayTb .dataNumber1").html(that.toThousands(data.data.DAYCF));
                      $(".footLeft .railwayTb .dataNumber4").html(that.toThousands(data.data.DAYDD));
                      $(".footLeft .railwayTb .dataNumber7").html(that.toThousands(data.data.DAYTOTAL)); 
                      $(".footLeft .railwayTb .dataNumber2").html(that.toThousands(data.data.MONTHCF));
                      $(".footLeft .railwayTb .dataNumber5").html(that.toThousands(data.data.MONTHDD));
                      $(".footLeft .railwayTb .dataNumber8").html(that.toThousands(data.data.MONTHTOTAL));
                      $(".footLeft .railwayTb .dataNumber3").html(that.toThousands(data.data.YEARCF));
                      $(".footLeft .railwayTb .dataNumber6").html(that.toThousands(data.data.YEARDD));
                      $(".footLeft .railwayTb .dataNumber9").html(that.toThousands(data.data.YEARTOTAL));
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
                // 右侧数据图
                $.ajax({
                    data:{
                          dateType:dataMonth,
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"/train/getTrainTypeFlowRate",
                    success:function(data){
                       that.swiperShow(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
               
                 $.ajax({
                    data:{
                          dateType:dataMonth,
                          siteName:"绍兴,绍兴北,绍兴东"
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"train/getMonthEveryDayFlowRateByDay",
                    success:function(data){
                      that.swiperShow3(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                })
                $.ajax({
                    data:{
                          dateType:dataMonth,
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"train/getTop5ByMonth",
                    success:function(data){
                      that.swiperShow4(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }
                })

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
            // 第一个swiper逻辑
            swiperShow:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayMonth+"月车型流量分布",todayMonth+"月车型流量占比"];
                var legendArr = [["出发","到达","总流量"],["D字头","K字头","Z字头"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData1(options,legendArr)
                that.creatSwiper("#swiperBox1",dataOption,tabArr)             
            },
            assemblyData1:function(options,legendArr){
               var dataObj={
                    swiper1:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    },
                    swiper2:{
                        xData:[],
                        yData:[],
                    
                    },
                }
                for(var i = 0;i<options.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[i].CX)
                    dataObj.swiper2.xData.push(options[i].CX)                 
                    // 设置y轴
                    dataObj.swiper1.yData1.push(options[i].CF),
                    dataObj.swiper1.yData2.push(options[i].DD),
                    dataObj.swiper1.yData3.push(options[i].TOTAL),
                    dataObj.swiper2.yData.push(options[i].CXLLZB) 
                }
                var dataOption=[
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        calculable : false,
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        series: echartsCss.getseriesPie(dataObj.swiper2.xData,dataObj.swiper2.yData)
                    },
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                            y: 37, 
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData,true)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0][0],"bar", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"bar", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"bar",dataObj.swiper1.yData3)]
                    },
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                       
                        grid: {
                            top:55,
                            left: '4%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        calculable : false,     
                        series: echartsCss.getseriesPie(dataObj.swiper2.xData,dataObj.swiper2.yData)
                    },
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[0],
                            x: 'center',                                                 
                            y: 37, 
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData,true)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0][0],"bar", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[0][1],"bar", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[0][2],"bar",dataObj.swiper1.yData3)]
                    },
                ]
                return dataOption;
            },
            // 第二个swiper逻辑
            swiperShow2:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["今日站点流量","每月日均客流量"];
                var legendArr = ["出发","到达","总流量"];

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
                        yData3:[]
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    
                    },
                }
                 for(var i = 0;i<options[0].zdll.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].zdll[i].SITENAME)
                  
                    dataObj.swiper1.yData1.push(options[0].zdll[i].CF)
                    dataObj.swiper1.yData2.push(options[0].zdll[i].DD)
                    dataObj.swiper1.yData3.push(options[0].zdll[i].TOTAL)
               
                }
                  for(var i = 0;i<options[0].kll.length;i++){
                    // 设置x轴
                
                    dataObj.swiper2.xData.push(options[0].kll[i].MONTHTIME)                 
                    // 设置y轴
                 
                    dataObj.swiper2.yData1.push(options[0].kll[i].CF)
                    dataObj.swiper2.yData2.push(options[0].kll[i].DD)
                    dataObj.swiper2.yData3.push(options[0].kll[i].TOTAL)
                }
                var dataOption=[
                    {             
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper2.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper1.yData3)]
                    
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper2.yData3)]
                    },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper1.yData3)]
                    
                    }
                ];             
                return dataOption;
            },
            // 第三个swiper逻辑
            swiperShow3:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["绍兴","绍兴北","绍兴东"];
                var legendArr = ["出发","到达","总流量"];

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
                        yData3:[]
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    
                    },
                    swiper3:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    
                    },
                }
                for(var i = 0;i<options[0]["绍兴"].length;i++){
                    // 设置X轴
                      dataObj.swiper1.xData.push(options[0]["绍兴"][i].DAYTIME)
                    // 设置y轴
                     dataObj.swiper1.yData1.push(options[0]["绍兴"][i].CF)
                     dataObj.swiper1.yData2.push(options[0]["绍兴"][i].DD)
                     dataObj.swiper1.yData3.push(options[0]["绍兴"][i].TOTAL)
                }
                for(var i = 0;i<options[0]["绍兴北"].length;i++){
                    // 设置X轴
                      dataObj.swiper2.xData.push(options[0]["绍兴北"][i].DAYTIME)
                    // 设置y轴
                     dataObj.swiper2.yData1.push(options[0]["绍兴北"][i].CF)
                     dataObj.swiper2.yData2.push(options[0]["绍兴北"][i].DD)
                     dataObj.swiper2.yData3.push(options[0]["绍兴北"][i].TOTAL)
                }
                for(var i = 0;i<options[0]["绍兴东"].length;i++){
                    // 设置X轴
                      dataObj.swiper3.xData.push(options[0]["绍兴东"][i].DAYTIME)
                    // 设置y轴
                     dataObj.swiper3.yData1.push(options[0]["绍兴东"][i].CF)
                     dataObj.swiper3.yData2.push(options[0]["绍兴东"][i].DD)
                     dataObj.swiper3.yData3.push(options[0]["绍兴东"][i].TOTAL)
                }
                var dataOption= [{
                      tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:legendArr,
                        x: 'center',                                                 
                        y:  37, 
                        textStyle:{color: '#fff'}
                    },
                    calculable : false,
                    color:echartsCss.getEchartColor(3),
                    xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData)],
                    yAxis : [echartsCss.getyAxis("人次")],
                    series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper3.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper3.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper3.yData3)]  
                },{
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:legendArr,
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
                    yAxis : [echartsCss.getyAxis("人次")],
                    series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper1.yData3)]  
                },{
                     tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:legendArr,
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
                    color:echartsCss.getEchartColor(0),
                    xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                    yAxis : [echartsCss.getyAxis("人次")],
                    series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper2.yData3)]  
                },{
                     tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:legendArr,
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
                    xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData)],
                    yAxis : [echartsCss.getyAxis("人次")],
                    series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper3.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper3.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper3.yData3)]  
                },{
                     tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:legendArr,
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
                    yAxis : [echartsCss.getyAxis("人次")],
                    series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2),echartsCss.getseries(legendArr[2],"line",dataObj.swiper1.yData3)]  
                }]
                return dataOption;
            },
            // 第四个swiper逻辑
            swiperShow4:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["出发站点排名","到达站点排名","车次流量排名"];
                var legendArr = [["本月出发","同比","环比"],["本月到达","同比","环比"],["本月总量","本月出发","本月到达"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData4(options,legendArr)
                that.creatSwiper("#swiperBox4",dataOption,tabArr)
            },
            assemblyData4:function(options,legendArr){
                 var dataObj={
                    swiper1:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    
                    },
                    swiper3:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                        yData3:[]
                    
                    },
                }
                for(var i = 0;i<options[0].cfTop5.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].cfTop5[i].SITENAME)
                             
                    // 设置y轴
                    dataObj.swiper1.yData1.push(options[0].cfTop5[i].CF)
                    dataObj.swiper1.yData2.push(options[0].cfTop5[i].TB)
                    dataObj.swiper1.yData3.push(options[0].cfTop5[i].HB)
                  
                }
                 for(var i = 0;i<options[0].ddTop5.length;i++){
                    // 设置x轴              
                    dataObj.swiper2.xData.push(options[0].ddTop5[i].SITENAME)                         
                    // 设置y轴
                    dataObj.swiper2.yData1.push(options[0].ddTop5[i].DD)
                    dataObj.swiper2.yData2.push(options[0].ddTop5[i].TB)
                    dataObj.swiper2.yData3.push(options[0].ddTop5[i].HB)
                 }
                 for(var i = 0;i<options[0].cxTop5.length;i++){
                    // 设置x轴
                    dataObj.swiper3.xData.push(options[0].cxTop5[i].TRAINNO)                 
                    // 设置y轴
                    dataObj.swiper3.yData1.push(options[0].cxTop5[i].TOTAL)
                    dataObj.swiper3.yData2.push(options[0].cxTop5[i].CF)
                    dataObj.swiper3.yData3.push(options[0].cxTop5[i].DD)
                }
               var dataOption= [
                   {
                     tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[2],
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[2][0],"line", dataObj.swiper3.yData1),echartsCss.getseries(legendArr[2][1],"line", dataObj.swiper3.yData2),echartsCss.getseries(legendArr[2][2],"line",dataObj.swiper3.yData3)]  
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次"),echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1,0),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2,1),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3,1)]
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
                        color:echartsCss.getEchartColor(3),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("人次"),echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[1][0],"line", dataObj.swiper2.yData1,0),echartsCss.getseries(legendArr[1][1],"line", dataObj.swiper2.yData2,1),echartsCss.getseries(legendArr[1][2],"line",dataObj.swiper2.yData3,1)]
                   },{
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[2],
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[2][0],"line", dataObj.swiper3.yData1),echartsCss.getseries(legendArr[2][1],"line", dataObj.swiper3.yData2),echartsCss.getseries(legendArr[2][2],"line",dataObj.swiper3.yData3)]
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次"),echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1,0),echartsCss.getseries(legendArr[0][1],"line", dataObj.swiper1.yData2,1),echartsCss.getseries(legendArr[0][2],"line",dataObj.swiper1.yData3,1)]
                   }
               ];

               return dataOption;
            }

        });


        return view;
    });


