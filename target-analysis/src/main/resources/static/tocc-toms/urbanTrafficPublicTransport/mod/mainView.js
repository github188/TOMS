
/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/urbanTrafficPublicTransport/mod/specialLayerTool',
        "echarts",
        'dateutils',
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        'tocc-toms/common/utils/searchToolBox/searchToolBox',
        "swiper",
        'libs/core/echart/3.7.1/macarons',
        
    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,dateutils,echartsCss,Mock,mapToolBox,MapSearch) {
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
                 var options={
                    map:that.$map,
                    container:that.el,
                    type:'taxi'
                };
                /*that.$MapSearch=new MapSearch();
                that.$MapSearch.render(options);*/
            },
            render: function (options) {
                var that=this;
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
                // that.mockData();
                that.getData(options,options2,that);
                that.loadJs();
            },
            // 模拟数据
            mockData:function(){
                Mock.mock(window.AppConfig.RemoteApiUrl+"bus/getBusDataBase2",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                       {
                        avgStateLength:Mock.Random.integer(100,150),
                        avgLength:Mock.Random.integer(50,100),
                        allLength:Mock.Random.integer(14000,15000),
                        coverRange:Mock.Random.integer(90,100)+"%",
                        
                       }
                    ]
                    
                    return data;
                })
                 Mock.mock(window.AppConfig.RemoteApiUrl+"bus/getBusFlowByWeekAndMonth",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data={
                        "week":[{"TJSJ_D":"03","POST_NUM":153607},{"TJSJ_D":"04","POST_NUM":169545},{"TJSJ_D":"05","POST_NUM":142021},{"TJSJ_D":"06","POST_NUM":135614},{"TJSJ_D":"07","POST_NUM":134508},{"TJSJ_D":"08","POST_NUM":138206},{"TJSJ_D":"09","POST_NUM":62583}],
                        "month":[{"TJSJ_D":"01","POST_NUM":196665},{"TJSJ_D":"02","POST_NUM":149567},{"TJSJ_D":"03","POST_NUM":153607},{"TJSJ_D":"04","POST_NUM":169545},{"TJSJ_D":"05","POST_NUM":142021},{"TJSJ_D":"06","POST_NUM":135614},{"TJSJ_D":"07","POST_NUM":134508},{"TJSJ_D":"08","POST_NUM":138206},{"TJSJ_D":"09","POST_NUM":62583}]

                }
                    
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
                var tabArr = [todayYear+"年"+todayMonth+"月日均运行速度",todayYear+"年"+todayMonth+"月日运行班次",todayYear+"年"+todayMonth+"月日运行里程"];
                var legendArr = ["日均运行速度","日运行班次","日运行里程"];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData(options,legendArr,"line","日")
                that.creatSwiper("#swiperBox1",dataOption,tabArr)    

            },
            // 第二个swiper逻辑
            swiperShow2:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = [todayYear+"年月均运行速度",todayYear+"年月运行班次",todayYear+"年月运行里程"];
                var legendArr = ["月均运行速度","月运行班次","月运行里程"];
                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData(options,legendArr,"bar","月")
                that.creatSwiper("#swiperBox2",dataOption,tabArr)    
            },
              // 第三个swiper逻辑
            swiperShow3:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["近7日客流量","本月客流量"];
                var legendArr = ["客流量","客流量"];
                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData2(options,legendArr,"line","日")
                that.creatSwiper("#swiperBox3",dataOption,tabArr)    
            },
            getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                     var myChart = echarts.init(selectDom[i],'macarons');
                     
                     myChart.setOption(option)
                }
               
            },
            getData:function(option,options2,that){
                var swiperData={};
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bus/getCountFlow2",
                    type:"post",
                    data:option,
                    success:function(data){
                        swiperData.busFlowData = data.data
                        if(that){
                            that.swiperShow(swiperData.busFlowData)
                        }
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bus/getCountFlow2",
                    type:"post",
                    data:options2,
                    success:function(data){
                        swiperData.busFlowData2 = data.data
                        if(that){
                            that.swiperShow2(swiperData.busFlowData2)
                        }
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                 // 获取第三个swiper数据
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bus/getBusFlowByWeekAndMonth",
                    type:"post",
                    data:{
                        industry:"080",
                        dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                    },
                    success:function(data){  
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        console.log(data)
                        swiperData.busFlowData3 = data.data
                        if(that){
                            that.swiperShow3(swiperData.busFlowData3)
                        }
                        
                       
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                // 数据展示
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bus/getBusDataBase",
                    type:"post",
                    data:option,
                    success:function(data){
                      
                       $(".footDateil .table .dataNumber1").html(data.data[0].carCount)
                       $(".footDateil .table .dataNumber2").html(data.data[0].bcl)
                       $(".footDateil .table .dataNumber3").html(data.data[0].routesNum)
                       $(".footDateil .table .dataNumber4").html(data.data[0].stationNum)
                     
                    },
                    error:function(err){
                        console.log(err)
                    }

                })
                $.ajax({
                    url:window.AppConfig.RemoteApiUrl+"bus/getStaticData",
                    type:"post",
                    data:option,
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                       $(".footDateil .table .dataNumber5").html(data.data.BUS_LEN)
                       $(".footDateil .table .dataNumber6").html(data.data.BUS_AVER_LEN)
                       $(".footDateil .table .dataNumber7").html(data.data.SITE_AVER_LEN)
                       $(".footDateil  .dataNumber8").html(data.data.SITE_500_COVERAGE)
                  
                     
                    },
                    error:function(err){
                        console.log(err)
                    }

                })

            },
            // ehart组装数据
            assemblyData:function(options,legendArr,type,unit){
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
                        }
                    }
                    for(var i = 0;i<options.shiftAndMileage.length;i++){
                        // 设置x轴
                        options.shiftAndMileage[i].TJSJ_D?dataObj.swiper1.xData.push(options.shiftAndMileage[i].TJSJ_D): dataObj.swiper1.xData.push(options.shiftAndMileage[i].TJSJ_M)
                        options.shiftAndMileage[i].TJSJ_D?dataObj.swiper2.xData.push(options.shiftAndMileage[i].TJSJ_D): dataObj.swiper2.xData.push(options.shiftAndMileage[i].TJSJ_M)
                        options.shiftAndMileage[i].TJSJ_D?dataObj.swiper3.xData.push(options.shiftAndMileage[i].TJSJ_D): dataObj.swiper3.xData.push(options.shiftAndMileage[i].TJSJ_M)
                     
                        // 设置y轴
                        dataObj.swiper2.yData.push(options.shiftAndMileage[i].POST_NUM);
                        dataObj.swiper3.yData.push(options.shiftAndMileage[i].DAILY_LC);

                    }
                    for(var i = 0;i<options.speed.length;i++){
                        // 设置y轴
                        dataObj.swiper1.yData.push(options.speed[i].LINE_SPEED);

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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper3.xData)],
                            yAxis : [echartsCss.getyAxis("km")],
                            series: [echartsCss.getseries(legendArr[2],"line", dataObj.swiper3.yData)]
                        },
                       {
                            tooltip : {    
                                trigger: 'axis',
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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper1.xData)],
                            yAxis : [echartsCss.getyAxis("km")],
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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper2.xData)],
                            yAxis : [echartsCss.getyAxis("班")],
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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper3.xData)],
                            yAxis : [echartsCss.getyAxis("km")],
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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper1.xData)],
                            yAxis : [echartsCss.getyAxis("km")],
                            series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]
                        }
                        ]
                    return  dataOption;
            },
            // ehart组装数据
            assemblyData2:function(options,legendArr,type,unit){
                 // 根据返回数据组合生成echart数据对象
                    var dataObj={
                        swiper1:{
                            xData:[],
                            yData:[]
                        },
                        swiper2:{
                            xData:[],
                            yData:[]
                        }
                    }
                    for(var i = 0;i<options.week.length;i++){
                        // 设置x轴
                       dataObj.swiper1.xData.push(options.week[i].TJSJ_D)
                     
                     
                        // 设置y轴
                       dataObj.swiper1.yData.push(options.week[i].POST_NUM);
                       
                    }
                     for(var i = 0;i<options.month.length;i++){
                        // 设置x轴
                       dataObj.swiper2.xData.push(options.month[i].TJSJ_D)
                     
                        // 设置y轴
                       dataObj.swiper2.yData.push(options.month[i].POST_NUM);
                       
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
                            color:echartsCss.getEchartColor(1),
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper2.xData)],
                            yAxis : [echartsCss.getyAxis("人次")],
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
                            color:echartsCss.getEchartColor(2),
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper1.xData)],
                            yAxis : [echartsCss.getyAxis("人次")],
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
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper2.xData)],
                            yAxis : [echartsCss.getyAxis("人次")],
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
                            color:echartsCss.getEchartColor(2),
                            xAxis : [echartsCss.getxAxis(unit,dataObj.swiper1.xData)],
                            yAxis : [echartsCss.getyAxis("人次")],
                            series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData)]
                        },
                        
                        ]
                    return  dataOption;
            }

        });


        return view;
    });


