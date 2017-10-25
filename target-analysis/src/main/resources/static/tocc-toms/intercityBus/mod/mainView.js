/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/intercityBus/mod/specialLayerTool',
        "echarts",
         "dateutils",
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "swiper",
        'libs/core/echart/3.7.1/macarons',
       

    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,dateutils,echartsCss,Mock,mapToolBox) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                 that.footTabShow();
                this.$map = {};
                this.mapUtils = mapUtils;

            },
            render: function (options) {
                var that=this;
                options = options || {};
                // that.mockData()
                  // 统一请求参数
                var options={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                   industry:"080",
                   areaCode:window.AppConfig.scode
                }
                var options2={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMM"),
                   industry:"080",
                   areaCode:window.AppConfig.scode
                }
                that.getData(options,options2,that);
                // 加载地图
                this.loadJs();

            },
             // 数据模拟
            mockData:function(){
                 Mock.mock(window.AppConfig.RemoteApiUrl+"shuttleBus/getTop5ByMonth",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[{
                        postFlowRateTop5:[
                            {"SITENAME":"双屿站","FSL":143081},{"SITENAME":"牛山客运站","FSL":85470},{"SITENAME":"汽车南站","FSL":78143},{"SITENAME":"元觉","FSL":16734},{"SITENAME":"洞头站","FSL":16716}
                        ],
                        postSzlTop5:[
                            {"BUSID":"洞头-乐清","TICKET":23939},{"BUSID":"大门-汽车南站","TICKET":19373},{"BUSID":"温州-泰顺","TICKET":12121},{"BUSID":"温州-福鼎","TICKET":10782},{"BUSID":"洞头-动车南","TICKET":10455}
                        ],
                        siteFlowRateTop5:[
                            {"BUSID":"温州-梅头","SZL":113.7255},{"BUSID":"温州-瑞安快","SZL":110.7504},{"BUSID":"温州-瑞安普","SZL":107.9932},{"BUSID":"温州-马屿","SZL":107.6923},{"BUSID":"温州-珊溪","SZL":107.5206}
                        ]
                    }]
                    
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
             getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                     var myChart = echarts.init(selectDom[i],'macarons');
                     
                     myChart.setOption(option)
                }
               
            },
            getData:function(options,options2,that){
                var swiperData={};
                // 获取基本信息
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"shuttleBus/getShuttleBusDataByDay",
                    type:"post",
                    data:{
                         dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                        //  dateTypeMonth:201709
                         dateTypeMonth:dateutils.dateFmt(new Date(),"yyyyMM")
                    },
                    success:function(data){
                       $(".footDateil .table .dataNumber1").html(that.toThousands(data.data[0].ShuttleBusData[0].FSL));
                       $(".footDateil .table .dataNumber2").html(that.toThousands(data.data[0].ShuttleBusData[0].POST));
                       $(".footDateil .table .dataNumber3").html(that.toThousands(data.data[0].ShuttleBusData[0].ZZL.toFixed(2)));

                       var MonthFsl = (data.data[0].MonthFsl.length==0)?0:data.data[0].MonthFsl[0].FSL;
                       $(".footDateil .table .dataNumber4").html(that.toThousands(MonthFsl));
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"shuttleBus/getAirportTerminalFlow",
                    type:"post",
                    data:{
                         dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                    
                    },
                    success:function(data){
                    
                       $(".footDateil .table .dataNumber0").html(data.data[0].FSLNUM);
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                 // 获取第一个swiper数据
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"shuttleBus/getTop5ByMonth",
                    type:"post",
                    data:options2,
                    success:function(data){  
                       if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }                 
                        that.swiperShow1(data.data)
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                
               
                // 获取第三个swiper数据
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"/shuttleBus/getEveryMonthFslAndRegionFslByYear",
                    type:"post",
                   data:{
                         dateTypeYear:dateutils.dateFmt(new Date(),"yyyy"),
                    },
                    success:function(data){  
                        that.swiperShow3(data.data)

                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                

            },
             swiperShow1:function(options){
                 var that=this; 
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["班线流量TOP5","班线实载率TOP5"];
                var legendArr = [todayYear+"年"+todayMonth+"月",todayYear+"年"+todayMonth+"月"];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData(options,legendArr,"bar")
                that.creatSwiper("#swiperBox1",dataOption,tabArr)    
            },
           
            swiperShow3:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年每月客流量",todayYear+"年区域旅客客流量"];
                var legendArr = ["客流量","客流量"];
                var dataOption=that.assemblyData3(options,legendArr,"bar")
                that.creatSwiper("#swiperBox3",dataOption,tabArr) 
               
            },
            assemblyData:function(options,legendArr,type){
                 var dataObj={
                       
                        swiper2:{
                            xData:[],
                            yData:[]
                        },
                         swiper3:{
                            xData:[],
                            yData:[]
                        },
                       
                    }
                for(var i = 0;i<options[0].postFlowRateTop5.length;i++){
                    // 设置y轴
                    dataObj.swiper2.xData.push(options[0].postFlowRateTop5[i].TICKET)
                    // 设置x轴
                    dataObj.swiper2.yData.push(options[0].postFlowRateTop5[i].BUSID)

                }
                for(var i = 0;i<options[0].postSzlTop5.length;i++){
                    // 设置y轴
                    dataObj.swiper3.xData.push(options[0].postSzlTop5[i].SZL.toFixed(2))
                    // 设置x轴
                    dataObj.swiper3.yData.push(options[0].postSzlTop5[i].BUSID)

                }
             
                var dataOption=[
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.yData,true)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper3.xData)]  
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.yData,true)],
                        yAxis : [echartsCss.getyAxis("人")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.xData)]  
                           
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.yData,true)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper3.xData)]  
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.yData,true)],
                        yAxis : [echartsCss.getyAxis("人")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.xData)]  
                    },
                ]
                return dataOption;
            },
           
            assemblyData3:function(options,legendArr,type){
                 var dataObj={
                    swiper1:{
                        xData:[],
                        yData:[]
                    },
                    swiper2:{
                        xData:[],
                        yData:[]
                    },   
                    
                }
                for(var i = 0;i<options[0].everyMonthFsl.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].everyMonthFsl[i].MONTHTIME)
                    // 设置y轴
                    dataObj.swiper1.yData.push((options[0].everyMonthFsl[i].FSL))

                }
                for(var i = 0;i<options[0].regionFsl.length;i++){
                   // 设置x轴
                    dataObj.swiper2.xData.push(options[0].regionFsl[i].REGIONNAME)
                    // 设置y轴
                    dataObj.swiper2.yData.push((options[0].regionFsl[i].FSL))
                }
                 var dataOption=[
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
                        color:echartsCss.getEchartColor(2),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData,true)],
                        yAxis : [echartsCss.getyAxis("人")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.yData)]  
                            
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
                        color:echartsCss.getEchartColor(1),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人")],
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
                        color:echartsCss.getEchartColor(2),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData,true)],
                        yAxis : [echartsCss.getyAxis("人")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.yData)]  
                            
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
                        color:echartsCss.getEchartColor(1),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]  
                            
                    },

                ]
                return dataOption;
            }
        });


        return view;
    });


