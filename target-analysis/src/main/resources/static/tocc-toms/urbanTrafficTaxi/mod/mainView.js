
/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
         "swiper",
        'tocc-toms/urbanTrafficTaxi/mod/taxiLayerTool',
        "echarts",
        'dateutils',
       'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        'libs/core/echart/3.7.1/macarons',
        
    ],
    function (BaseView,mapUtils,swiper,taxiLayerTool,echarts,dateutils,echartsCss,Mock,mapToolBox) {
        layer.config({
            path: '../../libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        });
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                that.footTabShow();
            },
            render: function (options) {
                var that=this;
                // 统一请求参数
                var options={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                   industry:"090",
                   areaCode:window.AppConfig.scode
                }
                var options2={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMM"),
                   industry:"090",
                   areaCode:window.AppConfig.scode
                }
                that.loadJs();
                // that.mockData();
                that.getData(options,options2,that);
            },
            // 模拟数据
            mockData:function(){
                // Mock.mock(window.AppConfig.RemoteApiUrl+"bus/getBusDataBase2",function(){
                //     var data = {};
                //     data.returnFlag = "1";
                //     data.data=[
                //        {
                //         zl:Mock.Random.integer(10000,150000),
                //         sxl:Mock.Random.integer(50,100),
                //         sxCount:Mock.Random.integer(5000,10000),
                //         kcCount:Mock.Random.integer(5000,10000),
                //         zcCount:Mock.Random.integer(5000,10000),
                       
                //        }
                //     ]
                    
                //     return data;
                // })
            },
            // 加载地图
            loadJs: function () {
                var that = this;
                that.$map = mapUtils.initMap("mapContainer", function () {
                    // 工具栏逻辑
                    mapToolBox.addMapToolEvent(that);
                    //工具栏 事件
                    taxiLayerTool.addEvent(that,false,'');
                });

            },
            getEchart:function(ele,option){
               var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                     var myChart = echarts.init(selectDom[i],'macarons');
                     
                     myChart.setOption(option)
                }
               
            },
            getData:function(options,options2,that){
               $.ajax({
                   data:options,
                   url:window.AppConfig.RemoteApiUrl+"taxi/getOnlineByTaxi",
                   type:"post",
                   success:function(data){
                        $(".footDateil .table .dataNumber1").html(data.data[0].zl)
                        $(".footDateil .table .dataNumber2").html(data.data[0].sxl)
                        $(".footDateil .table .dataNumber3").html(data.data[0].sxCount)
                        $(".footDateil .table .dataNumber5").html(data.data[0].ccCount)
                        $(".footDateil .table .dataNumber7").html(data.data[0].zcCount)   
                   },
                   error:function(err){
                       console.log(err)
                   }
               })
               $.ajax({
                   data:options,
                   url:window.AppConfig.RemoteApiUrl+"taxi/getOnlineByTaxi2",
                   type:"post",
                   success:function(data){
                        $(".footDateil .table .dataNumber4").html(data.data[0].TASK_AMOUNT)        
                        $(".footDateil .table .dataNumber6").html(data.data[0].LC_HB)
                        $(".footDateil .table .dataNumber8").html(data.data[0].TASK_NUM) 
                        that.swiperShow(data.data)
                   },
                   error:function(err){
                       console.log(err)
                   }
               })
               $.ajax({
                   data:options2,
                   url:window.AppConfig.RemoteApiUrl+"taxi/getOnlineByTaxi2",
                   type:"post",
                   success:function(data){
                       that.swiperShow2(data.data)
                   },
                   error:function(err){
                       console.log(err)
                   }
               })

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
                var tabArr = [todayYear+"年"+todayMonth+"月单车日均营收",todayYear+"年"+todayMonth+"月单车每趟里程",todayYear+"年"+todayMonth+"月单车日均趟次"];
                var legendArr = ["日营收","日均趟里程","日营运趟数"];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData(options,legendArr)
                that.creatSwiper("#swiperBox1",dataOption,tabArr) 
              
            },
            swiperShow2:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年单车月均营收",todayYear+"年单车每趟里程",todayYear+"年单车月均趟次"];
                var legendArr = [["单车月均营收","同比","环比"],"月均趟里程","月营运趟数"];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData2(options,legendArr)
                that.creatSwiper("#swiperBox2",dataOption,tabArr) 
            },
            // ehart组装数据
            assemblyData:function(options,legendArr,type){
               
                 // 根据返回数据组合生成echart数据对象
                  var dataObj={
                    swiper1:{
                        xData:[],
                        yData:[]
                    },
                    swiper2:{
                        xData:[],
                        yData:[]
                    },
                    swiper3:{
                        xData:[],
                        yData:[]
                    },
                    
                }
                for(var i = 0;i<options.length;i++){
                    // 设置y轴
                    dataObj.swiper1.xData.push(options[i].TJSJ_D);
                    dataObj.swiper2.xData.push(options[i].TJSJ_D);
                    dataObj.swiper3.xData.push(options[i].TJSJ_D);
                    dataObj.swiper1.yData.push(options[i].TASK_AMOUNT);
                    dataObj.swiper2.yData.push(options[i].LC_HB);
                    dataObj.swiper3.yData.push(options[i].TASK_NUM);
                }
                var dataOption=[
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[2]],
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper3.xData)],
                        yAxis : [echartsCss.getyAxis()],
                        series: [echartsCss.getseries(legendArr[2],"line", dataObj.swiper3.yData)]
                        
                    },
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[0]],
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis()],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]
                    },
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[1]],
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis()],
                        series: [echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData)]
                    },
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[2]],
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper3.xData)],
                        yAxis : [echartsCss.getyAxis()],
                        series: [echartsCss.getseries(legendArr[2],"line", dataObj.swiper3.yData)]
                    },
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[0]],
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis()],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]
                    }
                    ]
                return  dataOption; 
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
                        yData:[]
                    },
                    swiper3:{
                        xData:[],
                        yData:[]
                    },
                    
                }
                for(var i = 0;i<options.length;i++){
                    // 设置y轴
                    dataObj.swiper1.xData.push(options[i].TJSJ_M);
                    dataObj.swiper2.xData.push(options[i].TJSJ_M);
                    dataObj.swiper3.xData.push(options[i].TJSJ_M);
                    dataObj.swiper1.yData1.push(options[i].TASK_AMOUNT);
                    dataObj.swiper1.yData2.push(options[i].TASK_TB);
                    dataObj.swiper1.yData3.push(options[i].TASK_HB);
                    dataObj.swiper2.yData.push(options[i].LC_HB);
                    dataObj.swiper3.yData.push(options[i].TASK_NUM);
                }
                var dataOption=[
                {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[legendArr[2]],
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
                    xAxis : [echartsCss.getxAxis("月",dataObj.swiper3.xData,true)],
                    yAxis : [echartsCss.getyAxis("趟")],
                    series: [echartsCss.getseries(legendArr[2],"bar", dataObj.swiper3.yData)]
                },
                {
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
                    color:echartsCss.getEchartColor(2),
                    xAxis : [echartsCss.getxAxis("月",dataObj.swiper1.xData,true)],
                    yAxis : [echartsCss.getyAxis("人次"),echartsCss.getyAxis("%")],
                    series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1,0),echartsCss.getseries(legendArr[0][1],"bar", dataObj.swiper1.yData2,1),echartsCss.getseries(legendArr[0][2],"bar", dataObj.swiper1.yData3,1)]
                },
                {
                   tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[legendArr[1]],
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
                    xAxis : [echartsCss.getxAxis("月",dataObj.swiper2.xData,true)],
                    yAxis : [echartsCss.getyAxis("km")],
                    series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.yData)]
                },
                {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[legendArr[2]],
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
                    xAxis : [echartsCss.getxAxis("月",dataObj.swiper3.xData,true)],
                    yAxis : [echartsCss.getyAxis("趟")],
                    series: [echartsCss.getseries(legendArr[2],"bar", dataObj.swiper3.yData)]
                },
                {
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
                    color:echartsCss.getEchartColor(2),
                    xAxis : [echartsCss.getxAxis("月",dataObj.swiper1.xData,true)],
                    yAxis : [echartsCss.getyAxis("人次"),echartsCss.getyAxis("%")],
                    series: [echartsCss.getseries(legendArr[0][0],"line", dataObj.swiper1.yData1,0),echartsCss.getseries(legendArr[0][1],"bar", dataObj.swiper1.yData2,1),echartsCss.getseries(legendArr[0][2],"bar", dataObj.swiper1.yData3,1)]
                },
                ]
                return  dataOption; 
            }

        });


        return view;
    });


