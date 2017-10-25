/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        "echarts",
        'tocc-toms/springFestival/mod/specialLayerTool',
        "dateutils",
        'tocc-toms/common/utils/echartsCss',
        "mock",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "swiper",
        'libs/core/echart/3.7.1/macarons'

    ],
    function (BaseView,mapUtils,echarts,specialLayerTool,dateutils,echartsCss,Mock,mapToolBox) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                // that.mockData()
                this.$map = {};
                this.mapUtils = mapUtils;
                that.footTabShow();
                that.getData()
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
            mockData:function(){
                 Mock.mock(window.AppConfig.RemoteApiUrl+"holiday/springFestivalFlowRateIndexPanel",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                        {
                            "highWayIndex":[{"CFCLZL":20,"CLZZ":30,"DDCLZL":40}],"trainIndex":{"DAYTOTAL":34139,"DAYDD":17543,"DAYCF":16596},
                            "shuttleBusIndex":[{"POST":168,"CFBC":168,"ZZL":13.3233,"FSL":759,"DDBC":0}],
                            "trainIndex":[{"DAYCF":200,"DAYDD":180,"DAYTOTAL":380}]
                        }
                    ]
                    
                    return data;
                })
                Mock.mock(window.AppConfig.RemoteApiUrl+"holiday/springFestivalData",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                        {"taxiSzl":[{"total":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"totalLastYear":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}],"suttleBusFlowRate":[{"total":[0,1037,1133,1039,866,848,866,823,928,958,1110,848,836,963,792,866,963,1027,892,809,759,770,961,818,744,763,748,795,820,1041,2195,3005,2052,1765,1491,1601,1464,1522,1767,883],"totalLastYear":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}],"trainLateNum":[{"total":[118,0,0,316,83,79,60,65,0,0,0,0,82,0,65,0,0,65,113,316,77,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"totalLastYear":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}],"highWayFlowRate":[{"total":[185621,181689,270105,233444,120191,0,2,60864,96503,223592,220383,171844,178005,172201,78447,24571,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"totalLastYear":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}],"trainFlowRate":[{"total":[41695,0,0,45728,37940,35020,36628,38090,0,0,0,0,35386,0,37064,0,0,39029,0,37809,34139,26521,0,0,43444,35943,8131,36129,37669,44025,6672,60940,56331,61153,0,60999,57320,56540,69646,40723],"totalLastYear":[22578,0,0,16853,13177,21349,19835,5478,0,0,0,0,4368,0,0,0,0,16188,7418,17809,8037,5055,0,0,24079,8984,2154,15641,20352,18265,5464,23232,15009,18059,0,7976,12633,26125,21729,13699],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}],"BusSpeed":[{"total":[0.0,24.69,20.69,21.73,0.0,26.73,20.94,22.69,23.55,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"totalLastYear":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"dayNum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]}]}
                    ]
                    
                    return data;
                })
                Mock.mock(window.AppConfig.RemoteApiUrl+"holiday/FlowRateDistribution",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                        {
                        "SiteFlowDistribution":[{"SITENAME":"柯桥客运中心","FSL":958}],
                       "trainSiteFlowRate":[{"TOTAL":11154,"DD":4783,"ZDLLFB":9.38,"SITENAME":"苍南","CF":6371},{"TOTAL":7922,"DD":3588,"ZDLLFB":6.66,"SITENAME":"乐清","CF":4334},{"TOTAL":11011,"DD":4763,"ZDLLFB":9.26,"SITENAME":"瑞安","CF":6248},{"TOTAL":3460,"DD":1363,"ZDLLFB":2.91,"SITENAME":"绅坊","CF":2097},{"TOTAL":7732,"DD":1205,"ZDLLFB":6.5,"SITENAME":"温州","CF":6527},{"TOTAL":61776,"DD":26506,"ZDLLFB":51.95,"SITENAME":"温州南","CF":35270},{"TOTAL":2669,"DD":1409,"ZDLLFB":2.24,"SITENAME":"雁荡山","CF":1260},{"TOTAL":3338,"DD":1482,"ZDLLFB":2.81,"SITENAME":"永嘉","CF":1856},{"TOTAL":9853,"DD":4016,"ZDLLFB":8.29,"SITENAME":"鳌江","CF":5837}],
                        "highWayFlowTop5":[{"CLZZTOTAL":18615,"ZDMC":"柯桥"},{"CLZZTOTAL":18504,"ZDMC":"绍兴"},{"CLZZTOTAL":8082,"ZDMC":"嵊州"},{"CLZZTOTAL":7681,"ZDMC":"诸暨浣东"},{"CLZZTOTAL":7424,"ZDMC":"杨汛桥"}]
                        }
                    ]
                    
                    return data;
                })
               
            },
            getData:function(){
                var that= this;
                // 第一个面板
                 $.ajax({
                    data:{
                           dateType:dateutils.dateFmt(new Date(new Date()),"yyyyMMdd")
                        //  dateType:"20170801"
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"holiday/springFestivalFlowRateIndexPanel",
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }    
                        $(".text1").html(data.data[0].trainIndex?data.data[0].trainIndex.DAYCF:0);
                        $(".text2").html(data.data[0].trainIndex?data.data[0].trainIndex.DAYDD:0);
                        $(".text3").html(data.data[0].trainIndex?data.data[0].trainIndex.DAYTOTAL:0);
                        $(".text4").html(data.data[0].shuttleBusIndex[0].CFBC);
                        $(".text5").html(data.data[0].shuttleBusIndex[0].DDBC);
                        $(".text6").html(data.data[0].shuttleBusIndex[0].POST);
                        $(".text7").html(data.data[0].highWayIndex[0].CFCLZL);
                        $(".text8").html(data.data[0].highWayIndex[0].DDCLZL);
                        $(".text9").html(data.data[0].highWayIndex[0].CLZZ);
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
                 // 第二个面板
                 $.ajax({
                    data:{
                           dateType:dateutils.dateFmt(new Date(new Date()),"yyyyMMdd")
                        //  dateType:"20170715"
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"holiday/toDayUnimpededStatus",
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }
                        var color1 =addColorClass(data.data[0].busSpeedByDay.STATUS)
                        $(".colorText1").html(data.data[0].busSpeedByDay.LINESPEED+"km/h").addClass(color1).parent().find(".stateColor").html(data.data[0].busSpeedByDay.STATUS).addClass(color1);
                        var color2 =addColorClass(data.data[0].TaxiUseRateByDay.STATUS)
                        $(".colorText2").html((data.data[0].TaxiUseRateByDay.SZL*100).toFixed(2)+"%").addClass(color2).parent().find(".stateColor").html(data.data[0].TaxiUseRateByDay.STATUS).addClass(color2);
                        var color3 =addColorClass(data.data[0].bicycleUseRateByDay.STATUS)
                        $(".colorText3").html((data.data[0].bicycleUseRateByDay.SYL*100).toFixed(2)+"%").addClass(color3).parent().find(".stateColor").html(data.data[0].bicycleUseRateByDay.STATUS).addClass(color3);

                     
                      

                        function addColorClass(type){
                            if(!type) return;
                            switch(type){
                                case "通畅" : return "green" ;break;
                                case "低" : return "rose" ;break;
                                case "中" : return "org" ;break;
                            }
                            
                        }
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
                // 右侧数据图
                // 第一个swiper
                $.ajax({
                    data:{
                           dateType:dateutils.dateFmt(new Date(new Date()),"yyyyMMdd")

                        //  dateType:"20170725"
                    },
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"holiday/FlowRateDistribution",
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
                 // 第二个swiper
                $.ajax({
                    data:window.AppConfig.holidayCode,
                    type:"post",
                    url:window.AppConfig.RemoteApiUrl+"holiday/springFestivalData",
                    success:function(data){
                        if((typeof data)=="string"){
                            data=JSON.parse(data);
                        }    
                        console.log(data)
                       that.swiperShow2(data.data)
                  
                    },
                    error:function(err){
                        console.log(err)
                    }
                });
            },
              // 第一个swiper逻辑
            swiperShow:function(options){
                var that=this;
                // 获取时间生成抬头
                var todayYear = (new Date()).getFullYear();
                var todayMonth = (new Date()).getMonth()+1;
                var tabArr = ["铁路站点流量分布","客运站点流量分布","高速收费站流量TOP5"];
                var legendArr = [["出发","到达","总流量"],["客流量"],["车流量"]];

                // 根据返回数据组合生成echart数据对象
                var dataOption=that.assemblyData1(options,legendArr)
                that.creatSwiper("#swiperBox1",dataOption,tabArr)             
            },
            assemblyData1:function(options,legendArr){
                 var dataObj={
                    swiper1:{
                        xData:[],
                        yData:[],
                    },
                    swiper2:{
                        xData:[],
                        yData:[],
                    
                    },
                     swiper3:{
                        xData:[],
                        yData:[],
                    
                    },
                }
                for(var i = 0;i<options[0].trainSiteFlowRate.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].trainSiteFlowRate[i].SITENAME)
                    // 设置y轴
                    dataObj.swiper1.yData.push(options[0].trainSiteFlowRate[i].ZDLLFB)   
                }
                for(var i = 0;i<options[0].SiteFlowDistribution.length;i++){
                    // 设置x轴
                    dataObj.swiper2.xData.push(options[0].SiteFlowDistribution[i].SITENAME)
                    // 设置y轴
                    dataObj.swiper2.yData.push(options[0].SiteFlowDistribution[i].FSL)   
                }
                for(var i = 0;i<options[0].highWayFlowTop5.length;i++){
                    // 设置x轴
                    dataObj.swiper3.xData.push(options[0].highWayFlowTop5[i].ZDMC)
                    // 设置y轴
                    dataObj.swiper3.yData.push(options[0].highWayFlowTop5[i].CLZZTOTAL)   
                }
                var dataOption=[
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[2],
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData,true)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[2],"bar", dataObj.swiper3.yData)]
                    },
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
                        series: echartsCss.getseriesPie(dataObj.swiper1.xData,dataObj.swiper1.yData)
                    },
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[1],
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
                        color:echartsCss.getEchartColor(0),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData,true)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[1],"bar", dataObj.swiper2.yData)]
                    },
                    {
                        tooltip : {
                           trigger: 'axis'
                        },
                        legend: {
                            data:legendArr[2],
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData,true)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[2],"bar", dataObj.swiper3.yData)]
                    },
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
                        series: echartsCss.getseriesPie(dataObj.swiper1.xData,dataObj.swiper1.yData)
                    },
                ]
                return dataOption
            },
            swiperShow2:function(options){
                var that=this;
                var todayYear = (new Date()).getFullYear();
                var tabArr = ["铁路客运量","班车客运量","高速车流量","列车晚点数","公交运行速率","出租车实载率"];
                var legendArr = [(todayYear-1)+"年",(todayYear)+"年"];

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
                    },
                    swiper2:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                    
                    },
                     swiper3:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                    
                    },
                    swiper4:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                    },
                    swiper5:{
                        xData:[],
                        yData1:[],
                        yData2:[],
                    
                    },
                     swiper6:{
                        xData:[],
                        yData1:[],
                        yData2:[],       
                    },
                }
                for(var i = 0;i<options[0].trainFlowRate[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper1.xData.push(options[0].trainFlowRate[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper1.yData1.push(options[0].trainFlowRate[0].total[i])
                    dataObj.swiper1.yData2.push(options[0].trainFlowRate[0].totalLastYear[i])      
                }
                for(var i = 0;i<options[0].suttleBusFlowRate[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper2.xData.push(options[0].suttleBusFlowRate[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper2.yData1.push(options[0].suttleBusFlowRate[0].total[i])
                    dataObj.swiper2.yData2.push(options[0].suttleBusFlowRate[0].totalLastYear[i])      
                }
                for(var i = 0;i<options[0].highWayFlowRate[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper3.xData.push(options[0].highWayFlowRate[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper3.yData1.push(options[0].highWayFlowRate[0].total[i])
                    dataObj.swiper3.yData2.push(options[0].highWayFlowRate[0].totalLastYear[i])      
                }
                for(var i = 0;i<options[0].trainLateNum[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper4.xData.push(options[0].trainLateNum[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper4.yData1.push(options[0].trainLateNum[0].total[i])
                    dataObj.swiper4.yData2.push(options[0].trainLateNum[0].totalLastYear[i])      
                }
                for(var i = 0;i<options[0].BusSpeed[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper5.xData.push(options[0].BusSpeed[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper5.yData1.push(options[0].BusSpeed[0].total[i])
                    dataObj.swiper5.yData2.push(options[0].BusSpeed[0].totalLastYear[i])      
                }
                for(var i = 0;i<options[0].taxiSzl[0].dayNum.length;i++){
                    // 设置x轴
                    dataObj.swiper6.xData.push(options[0].taxiSzl[0].dayNum[i])
                    // 设置y轴
                    dataObj.swiper6.yData1.push(options[0].taxiSzl[0].total[i].toFixed(4)*100)
                    dataObj.swiper6.yData2.push(options[0].taxiSzl[0].totalLastYear[i].toFixed(4)*100)      
                }

                  var dataOption=[
                      {
                          tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper6.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper6.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper6.yData2)]
                      },
                      {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2)]
                      },
                      {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(5),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper2.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper2.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper2.yData2)]
                      },
                      {
                         tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(2),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper3.xData)],
                        yAxis : [echartsCss.getyAxis("辆")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper3.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper3.yData2)]
                      },
                      {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(1),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper4.xData)],
                        yAxis : [echartsCss.getyAxis("班")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper4.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper4.yData2)]
                      },
                      {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(0),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper5.xData)],
                        yAxis : [echartsCss.getyAxis("km/h")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper5.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper5.yData2)]
                      },
                      {
                          tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper6.xData)],
                        yAxis : [echartsCss.getyAxis("%")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper6.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper6.yData2)]
                      },
                      {
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:legendArr,
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
                        color:echartsCss.getEchartColor(4),
                        xAxis : [echartsCss.getxAxis("",dataObj.swiper1.xData)],
                        yAxis : [echartsCss.getyAxis("人次")],
                        series: [echartsCss.getseries(legendArr[0],"line", dataObj.swiper1.yData1),echartsCss.getseries(legendArr[1],"line", dataObj.swiper1.yData2)]
                      },
                  ]
                  return dataOption
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
            }
        });


        return view;
    });


