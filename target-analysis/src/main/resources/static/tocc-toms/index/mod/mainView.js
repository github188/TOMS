/**
 * Created by mac-pc on 16/7/18.
 */
define([   
        'tocc-toms/common/BaseView',
        'map_utils',
        'dateutils',
        'cache',
        "mock",
        "tocc-toms/index/mod/specialLayerTool",
        "echarts",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        "Ecalendar"
    ],
    function (BaseView, mapUtils,dateutils, Cache,Mock,specialLayerTool,echarts,mapToolBox) {
        layer.config({
            path: '../../libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        });
        var view = BaseView.extend({
            el: "body",
            events: {
                /* "click #nav li":"taxiStatus"*/
            },
            init: function () {
                var that = this;
                this.$map = {};
                this.mapUtils = mapUtils;
            },
            render: function (options) {
                options = options || {};
                var that=this;
                this.$options = options;
                // 拦截接口，模拟数据
                //this.mockData();
                // 加载地图
                this.loadJs();
                this.getData();
                setInterval(function(){
                    that.getData();
                },60000);
                
                //setTimeout(function(){
                //    mapUtils.setFeatureLayerVisible(that.$map,'SP_HCZ',false,that);
                //    that.$map.hideOverlays('SP_ZXCTKD_layercontrol');
                //},2000);
            },
            // 模拟数据
            mockData:function(){
                // 火车
                Mock.mock(window.AppConfig.RemoteApiUrl+"train/getCountTrain",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=[
                       {
                        siteName:Mock.Random.county(),
                        checkOutNum:Mock.Random.integer(10000,100000),
                        checkInNum:Mock.Random.integer(10000,100000)
                       },{
                        siteName:Mock.Random.county(),
                        checkOutNum:Mock.Random.integer(10000,100000),
                        checkInNum:Mock.Random.integer(10000,100000)
                       }
                    ]
                    
                    return data;
                })
                // 班车
                Mock.mock(window.AppConfig.RemoteApiUrl+"shuttleBus/getCountShuttleBus",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=
                       {           
                        zzlNum:Mock.Random.integer(10000,100000)
                       }
                    
                    
                    return data;
                })
                Mock.mock(window.AppConfig.RemoteApiUrl+"shuttleBus/getShuttleFlow",function(){
                    var data = {};
                    data.returnFlag = "1";
                    data.data=
                       {
                        kklNum:Mock.Random.integer(10000,100000),  
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
                     //$('#trainLayer').trigger('click');
                     //$('#bicycleInput').trigger('click');

                     //mapUtils.setFeatureLayerVisible(that.$map,'SP_HCZ',false,that);
                     //that.$map.hideOverlays('SP_ZXCTKD_layercontrol');
                 });
                
            },
            // 获取页面显示数据
            getData:function(){
                var that=this;
                var option={
                    dateType:dateutils.dateFmt(new Date(),"yyyyMMdd")
                }
                var option1={
                    dateType:dateutils.dateFmt(new Date(new Date()),"yyyyMMdd")
                }
                var optionBus={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                   industry:"080",
                   areaCode:window.AppConfig.scode
                }
                var optionTaxi={
                   dateType:dateutils.dateFmt(new Date(),"yyyyMMdd"),
                   industry:"090",
                   areaCode:window.AppConfig.scode
                }
                // 火车
                $.ajax({
                    type:"post",
                    data:option,
                    url:window.AppConfig.RemoteApiUrl+"train/getCountTrain",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){
                            var CHECK_IN_NUMCount = 0
                            var CHECK_OUT_NUMCount = 0
                            for(var i = 0 ; i<result.data.length;i++){
                                CHECK_IN_NUMCount+=parseInt(result.data[i].CHECK_IN_NUM);
                                CHECK_OUT_NUMCount+=parseInt(result.data[i].CHECK_OUT_NUM);
                            }
                            $(".trainBox .numberTit").eq(0).html(that.toThousands(CHECK_OUT_NUMCount));
                            $(".trainBox .numberTit").eq(1).html(that.toThousands(CHECK_IN_NUMCount));
                        }
                       
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("铁路客运运量获取超时")
                　　　　}
                　　},
                    error:function(err){
                        console.log(err)
                        layer.msg("铁路客运运量获取失败")
                    }
                })
                // 班车
                $.ajax({
                    type:"post",
                    data:option1,
                    url:window.AppConfig.RemoteApiUrl+"shuttleBus/getCountShuttleBus",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var coachCount = 0
                            for(var i = 0 ; i<result.data.length;i++){
                                 coachCount+=parseInt(result.data[i].POST);
                            }
                            $(".coachBox .numberTit").eq(1).html(that.toThousands(parseInt(coachCount)));
                        }
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("班车客运运量获取超时")
                　　　　}
                　　},
                    error:function(err){
                        console.log(err)
                        layer.msg("班车客运运量获取失败")
                    }
                });
                $.ajax({
                    type:"post",
                    data:option1,
                    url:window.AppConfig.RemoteApiUrl+"shuttleBus/getShuttleFlow",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var KLL =  result.data[0]?parseInt(result.data[0].KLL):0;
                            $(".coachBox .numberTit").eq(0).html(that.toThousands(KLL));
                        }
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("班车客运周转量获取超时")
                　　　　}
                　　},
                    error:function(err){
                        console.log(err)
                        layer.msg("班车客运周转量获取失败")
                    }
                })
                // 航班
                // $.ajax({
                //    type:"post",
                //    data:option,
                //    url:window.AppConfig.RemoteApiUrl+"flight/getCountFlow",
                //    success:function(result){
                //        if((typeof result)=="string"){
                //            result=JSON.parse(result);
                //        }
                //        if(result.returnFlag=="1"){
                //            var outNum = result.data[0]?parseInt(result.data[0].OUTNUM):0;
                //            var inNum =  result.data[0]?parseInt(result.data[0].INNUM):0;
                //            $(".airplaneBox .numberTit").eq(0).html(that.toThousands(outNum));
                //            $(".airplaneBox .numberTit").eq(1).html(that.toThousands(inNum))
                //        }
                //    }
                //})
                //  航站楼
                $.ajax({
                   type:"post",
                   data:option,
                   url:window.AppConfig.RemoteApiUrl+"shuttleBus/getAirportTerminalFlow",
                   success:function(result){
                       if((typeof result)=="string"){
                           result=JSON.parse(result);
                       }
                       if(result.returnFlag=="1"){
                           var outNum = result.data[0]?parseInt(result.data[0].FSLNUM):0;
                           var inNum =  result.data[0]?parseInt(result.data[0].POSTNUM):0;
                           $(".airplaneBox .numberTit").eq(0).html(that.toThousands(outNum));
                           $(".airplaneBox .numberTit").eq(1).html(that.toThousands(inNum))
                       }
                   }
                })
                 // 高速
                 $.ajax({
                    type:"post",
                    data:option,
                    url:window.AppConfig.RemoteApiUrl+"highWay/getCountFlow",
                   timeOut:10000,
                   success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var CFCLZL =result.data[2].dayData[0]?parseInt(result.data[2].dayData[0].CFCLZL):0;
                            var DDCLZL =  result.data[2].dayData[0]?parseInt(result.data[2].dayData[0].DDCLZL):0;
                            $(".expresswayBox .numberTit").eq(0).html(that.toThousands(CFCLZL));
                            $(".expresswayBox .numberTit").eq(1).html(that.toThousands(DDCLZL))
                           
                        }
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("高速客运获取超时")
                　　　　}
                　　},
                    error:function(err){
                        console.log(err)
                        layer.msg("高速客运获取失败")
                    }
                })
                // 公交
                $.ajax({
                    type:"post",
                    data:optionBus,
                    url:window.AppConfig.RemoteApiUrl+"bus/getCountFlow",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var kyl = result.data[0]?parseInt(result.data[0].kyl):0;
                            var carCount = result.data[0]?parseInt(result.data[0].carCount):0;
                            var bcl = result.data[0]?parseInt(result.data[0].bcl):0;
                            //$(".cityBusBox .numberTit").eq(0).html(that.toThousands(kyl));
                            //$(".cityBusBox .numberTit").eq(1).html(that.toThousands(carCount));
                            //$(".cityBusBox .numberTit").eq(2).html(bcl);
                            $(".cityBusBox .numberTit").eq(0).html(that.toThousands(carCount));
                            $(".cityBusBox .numberTit").eq(1).html(bcl);
                        }
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("城市公交获取超时");
                　　　　}
                　　},
                    error:function(err){
                        console.log(err);
                        layer.msg("城市公交获取失败");
                    }

                })
                 // 出租车
                $.ajax({
                    type:"post",
                    data:optionTaxi,
                    url:window.AppConfig.RemoteApiUrl+"taxi/getOnlineByTaxi",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var zl = result.data[0]?parseInt(result.data[0].zl):0;
                            var sxl = (result.data[0]?result.data[0].sxl:0)*100;
                            var szl = (result.data[0]?result.data[0].szl:0)*100;

                            $(".taxiBox .numberTit").eq(0).html(that.toThousands(zl));
                            $(".taxiBox .numberTit").eq(1).html(parseInt(sxl).toFixed(2) + '%');
                            $(".taxiBox .numberTit").eq(2).html(parseInt(szl).toFixed(2) + '%');
                        }
                    },
                    complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("城市出租获取超时");
                　　　　}
                　　},
                    error:function(err){
                        console.log(err);
                        layer.msg("城市出租获取失败");
                    }
                })
                // 自行车
                $.ajax({
                    type:"post",
                    data:option,
                    url:window.AppConfig.RemoteApiUrl+"bike/bicycleIndex",
                    timeOut:10000,
                    success:function(result){
                        if((typeof result)=="string"){
                            result=JSON.parse(result);
                        }
                        if(result.returnFlag=="1"){ 
                            var ZS = result.data[0]?parseInt(result.data[0].ZS):0;
                            var CWS = result.data[0]?parseInt(result.data[0].CWS):0;
                            var KJS = result.data[0]?parseInt(result.data[0].KJS):0;
                            var kjyl 
                            (CWS===0)?kjyl=0:kjyl=((KJS/CWS)*100).toFixed(2);
                            $(".bicycleBox .numberTit").eq(0).html(that.toThousands(ZS));
                            $(".bicycleBox .numberTit").eq(1).html(that.toThousands(CWS));
                            $(".bicycleBox .numberTit").eq(2).html(kjyl + '%');
                        }
                    },
                   complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
                　　　　　 ajaxTimeoutTest.abort();
                　　　　　 layer.msg("公共自行车获取超时");
                　　　　}
                　　},
                    error:function(err){
                        console.log(err);
                        layer.msg("公共自行车获取失败");
                    }

                })
            },
            getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                    var myChart = echarts.init(selectDom[i],'macarons');

                    myChart.setOption(option)
                }
            }
        });


        return view;
    });


