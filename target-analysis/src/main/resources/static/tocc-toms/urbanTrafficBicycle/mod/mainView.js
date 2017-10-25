
/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/urbanTrafficBicycle/mod/specialLayerTool',
        "echarts",
        'dateutils',
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "swiper",
        'libs/core/echart/3.7.1/macarons',
        
    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,dateutils,echartsCss,Mock,mapToolBox) {
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
                this.$map = {};
                this.mapUtils = mapUtils;
            },
            render: function () {
                var that=this;
                // 统一请求参数
                var options={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                   areaCode:window.AppConfig.scode
                }
                var options2={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMM"),
                  
                   areaCode:window.AppConfig.scode
                }
                 var options3={
                   dateType:dateutils.dateFmt(new Date(),"yyyy"),
                  
                   areaCode:window.AppConfig.scode
                }
             
                // that.mockData();
                that.getData(options,options2,options3,that);
                that.loadJs();
            },
            // 模拟数据
            mockData:function(){
                Mock.mock(window.AppConfig.RemoteApiUrl+"bike/bicycleIndex",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                       {
                         "KJS":Mock.Random.integer(5000,10000),
                         "KHS":Mock.Random.integer(5000,10000),
                         "SYL":Mock.Random.integer(20,95),
                         "ZS":Mock.Random.integer(500,2000),
                         "CWS":Mock.Random.integer(10000,20000)
                       }
                    ]
                    
                    return data;
                })
                 Mock.mock(window.AppConfig.RemoteApiUrl+"bike/bicycleTops",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data={
                        znh:[
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":1,
                            "SITE_NAME":"B景秀湾花园"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":2,
                            "SITE_NAME":"银都花苑"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":3,
                            "SITE_NAME":"金迅达大厦"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":4,
                            "SITE_NAME":"水心过境路口"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":5,
                            "SITE_NAME":"特警支队"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":6,
                            "SITE_NAME":"超时"
                        }
                        ],
                         znj:[
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":7,
                            "SITE_NAME":"B景秀湾花园2"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":6,
                            "SITE_NAME":"银都花苑2"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":5,
                            "SITE_NAME":"金迅达大厦2"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":4,
                            "SITE_NAME":"水心过境路口2"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":3,
                            "SITE_NAME":"特警支队2"
                        },
                        {
                            "TJSJ_D":"20170920",
                            "USABLE_NUM":2,
                            "SITE_NAME":"超时2"
                        }
                        ]

                    };
                    
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
                    specialLayerTool.addEvent(that,false,'');
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
            // 第一个swiper逻辑
            swiperShow:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年"+todayMonth+"月最难借车点TOP5",todayYear+"年"+todayMonth+"月最难还车点TOP5"];
                var legendArr = ["平均空位数","平均空位数"];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData2(options,legendArr)
                that.creatSwiper("#swiperBox1",dataOption,tabArr)       
            
                
            },
            // 第二个swiper逻辑
            swiperShow2:function(options){
                 var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年"+"最难借TOP5",todayYear+"年"+"最难还TOP5"];
                var legendArr = ["平均空位数","平均空位数"];
                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData2(options,legendArr)
                that.creatSwiper("#swiperBox2",dataOption,tabArr)    
                
               
            },
            // 第三个swiper逻辑
            swiperShow3:function(options){
                 var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年"+todayMonth+"月自行车日平均使用率",todayYear+"年自行车月平均使用率"];
                var legendArr = ["日平均使用率","月平均使用率"];
                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData3(options,legendArr,"line")
                that.creatSwiper("#swiperBox3",dataOption,tabArr)    
                
               
            },
            getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                     var myChart = echarts.init(selectDom[i],'macarons');
                     
                     myChart.setOption(option)
                }
               
            },
            getData:function(options,options2,options3,that){
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bike/bicycleIndex",
                    type:"post",
                    data:options,
                    success:function(data){
                         if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        $(".footDateil .table .dataNumber1").html(data.data[0].KJS)
                        $(".footDateil .table .dataNumber2").html(data.data[0].KHS)
                        $(".footDateil .table .dataNumber3").html(data.data[0].ZS)
                        $(".footDateil .table .dataNumber4").html(data.data[0].CWS)
                        $(".footDateil .table .dataNumber5").html(data.data[0].RJCL)
                        

                    },
                    error:function(err){
                        console.log(err)

                    }
                }),
                // swiper1
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bike/bicycleTops",
                    type:"post",
                    data:options2,
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        that.swiperShow(data.data)
                      

                    },
                    error:function(err){
                        console.log(err)

                    }
                })
                // swiper2
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bike/bicycleTops",
                    type:"post",
                    data:options3,
                    success:function(data){
                         if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        that.swiperShow2(data.data)
                    },
                    error:function(err){
                        console.log(err)

                    }
                })
                 // swiper3
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bike/bicycleUseRate",
                    type:"post",
                    data:options,
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        that.swiperShow3(data.data)
                    },
                    error:function(err){
                        console.log(err)

                    }
                })
            },
            // ehart组装数据
             assemblyData2:function(options,legendArr){
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
                for(var i = 0;i<5;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options.znj[i].USABLE_NUM)
                    dataObj.swiper2.xData.push(options.znh[i].USABLE_NUM)
                    
                    // 设置y轴
                    dataObj.swiper1.yData.push(options.znj[i].SITE_NAME),
                    dataObj.swiper2.yData.push(options.znh[i].SITE_NAME)
                }
                var dataOption=[{
                    tooltip : {
                     trigger: 'axis'
                    },
                    legend: {
                        data:[legendArr[1]],
                        x: 'center',                                                 
                        y:  37, 
                        symbol:'rectangle',
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
                    xAxis : [echartsCss.getxAxis("",dataObj.swiper2.yData,true)],
                    yAxis : [echartsCss.getyAxis("个")],
                    series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.xData)]
                },{
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
                        color:echartsCss.getEchartColor(3),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.yData,true)],
                        yAxis : [echartsCss.getyAxis("个")],
                        series: [echartsCss.getseries(legendArr[0],"bar", dataObj.swiper1.xData)]
                },{
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.yData,true)],
                        yAxis : [echartsCss.getyAxis("个")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.xData)]
                },{
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
                            color:echartsCss.getEchartColor(3),
                            xAxis : [echartsCss.getxAxis("",dataObj.swiper1.yData,true)],
                            yAxis : [echartsCss.getyAxis("个")],
                            series: [echartsCss.getseries(legendArr[0],"bar", dataObj.swiper1.xData)]
                }];
                return dataOption
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
                for(var i = 0;i<options.sylByDay.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options.sylByDay[i].TJSJ_D)
                   
                    
                    // 设置y轴
                    dataObj.swiper1.yData.push((options.sylByDay[i].SYL_NUM*100).toFixed(2))
                   
                }
                for(var i = 0;i<options.sylByMonth.length;i++){
                    // 设置x轴
                
                    dataObj.swiper2.xData.push(options.sylByMonth[i].TJSJ_M)
                    
                    // 设置y轴
                   
                    dataObj.swiper2.yData.push((options.sylByMonth[i].SYL_NUM*100).toFixed(2))
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
                        color:echartsCss.getEchartColor(0),
                        xAxis : [echartsCss.getxAxis("月",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData)]
                    },
                    {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[legendArr[0]],
                            x: 'center',                                                 
                            y:  37, 
                            textStyle:{color: '#fff'},
                            
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
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
                         color:echartsCss.getEchartColor(0),
                        xAxis : [echartsCss.getxAxis("月",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData)]  
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
                        xAxis : [echartsCss.getxAxis("日",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]
                    },
                ]
                return dataOption;
                    
            }

        });


        return view;
    });


