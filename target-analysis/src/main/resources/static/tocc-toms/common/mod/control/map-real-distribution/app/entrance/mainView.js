/**
 * Created by mac-pc on 16/7/18.
 */
define([
    'jquery',
    'tocc-toms/common/BaseView',
    'bmap',
     '../utils/mapClusterUtil',
    'map_utils',
    'log',
    'tocc-toms/common/rightTool',
    'layer',
    'text!../../template/mapRealDistribution.html',
     '../carinfo/mainView',
    'cache',
    'wdatepicker',
    'tocc-toms/common/mod/control/map-search/app/utils/mapSearchUtils',
    'tocc-toms/common/mod/control/map-search/app/config/poiconfig',
    'easyui',
    'bmapui'
],
    function($, BaseView, bmap,MapClusterUtil,mapUtils,Log,rightTool,layer,realTpl,CarInfoMainView,Cache,wdatepicker,mapSearchUtils,poiconfig) {
        layer.config({
            path: '../../../../libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        });
        var view = BaseView.extend({
            el: ".frame-yxjk",
            events: {
               /* "click #nav li":"taxiStatus"*/
            },
            init: function() {
                this.$map = {};
                this.$tables = {};
                this.$defIndustyType="SP_WXQY,SP_KYQY,SP_HYQY,SP_JPQY,SP_KYZ,SP_HYZ,SP_ZXCTKD,011,012,020,030,080,090";
                this.$defClazz={
                    "010":"legend cluster-010",
                    "011":"legend cluster-011",
                    "012":"legend cluster-012",
                    "020":"legend cluster-020",
                    "030":"legend cluster-030",
                    "080":"legend cluster-080",
                    "090":"legend cluster-090",
                    "021":"legend cluster-021"
                };
                this.$bmCode = Cache.getItem("bmCode");
                this.$clcxView=new CarInfoMainView();
                this._templateFn(realTpl);
            },
            render: function(options) {
                options = options || {};
                this.$options=options;
                this.$areaName = options.areaName || {};
                this.$inscode = this.$options.industytype || this.$defIndustyType;
                this.loadJs();
                this.initUI();//初始化ui
                this.$("#map-tools").append(new rightTool({
                    map: this.$map,
                    warning:true,
                    draw:false,
                    indCode: this.$inscode
                }).render(
                ));
            },
            initUI: function() {
                //dom加载完毕
                var that= this;
                $(".tools-ctr").on("mouseover",function(){
                    $(this).parents().find(".tools-pop").show();
                }).siblings(".tools-pop").on("mouseleave",function(){
                    $(this).hide();
                });
                $(".left_panel").wySidepanel({
                    parent: $("body"),
                    hasHeader: true,
                    initialVisible: false,
                    scroll: 'y',
                    buttons: {
                        full: false,
                        max: false,
                        refresh: false,
                        close: true,
                        toggle: false
                        }
                    });
            },
            loadJs: function() {
                var _self = this;
                _self.$map = mapUtils.initMap("ptjkMap1",function(){
                    MapClusterUtil.cluster( _self.$options.industyType||_self.$defIndustyType, _self.$map,_self.$areaName,function(data){
                        _self.$clcxView.carDataInfoWindow(data,_self.$map);
                    });
                });
                //var timer = setInterval(function(){
                //    mapUtils.vehicleCluster( _self.$inscode, _self.$map,_self.$areaName);
                //    clearInterval(timer);
                //},300);
                _self.leftPanel(_self.$inscode);

            },
            leftPanel:function(incode){
                //左下角图例
                var that = this;
                var typeData=that.loadIndustyType();
                var tpl = that.mapTools2Template({data:typeData.data,originIndustyType:typeData.originIndustyType});
                var industyType=typeData.industyType;
                $("#left-bottom").html(tpl);
                this.addTabSwitchEvent();
                $("#menu_con").find("input[type='checkbox']").each(function(){
                    if(industyType&&industyType.indexOf($(this).data("id")+"")>=0){
                        $(this).attr("checked", true);
                    }
                });
                $("#all").attr("checked", true);

                $("#menu_con").find("input[type='checkbox']").on("click",function(){
                    var incodes1="";
                    if("all"==$(this).attr("id")){
                        var isChecked = $(this).is(":checked");
                        if(isChecked){
                            MapClusterUtil.cluster( industyType, that.$map,that.$areaName,function(data){
                                that.$clcxView.carDataInfoWindow(data,that.$map);
                            });
                            that.enterpriseLayer(that);

                            $("#menu_con").find("input[type='checkbox']").each(function(){
                                $(this).prop("checked", true);
                            });
                        }else{
                            $("#menu_con").find("input[type='checkbox']").each(function(){
                                $(this).prop("checked", false);
                            });
                            MapClusterUtil.removeCluster(that.$map);
                        }
                    }else{
                        $("#menu_con").find("input[type='checkbox']").each(function(){
                            if($(this).is(":checked")){
                                incodes1+=$(this).data("id")+",";
                            }else{
                                $("#all").attr("checked",false);
                            }
                        });

                        AllSelected();

                        if(!incodes1){
                            that.$options.industyType="";
                            MapClusterUtil.removeCluster(that.$map);
                        }else{
                            that.$options.industyType=incodes1.substring(0,incodes1.length-1);
                            MapClusterUtil.cluster( that.$options.industyType, that.$map,that.$areaName,function(data){
                                that.$clcxView.carDataInfoWindow(data,that.$map);
                            });

                            $("#menu_con").find("input[data-id^='SP']").each(function () {
                                var code = $(this).attr("data-id").split("|");
                                var isChecked = $(this).is(":checked");
                                for(var i = 0 ; i<code.length;i++) {
                                    // setTimeout(function () {
                                    if(isChecked){
                                        if("SP_ZXCTKD"==code[i]){
                                            mapSearchUtils.setTopicLayerVisible(that.$map,"bicycle_kejiekehuan",isChecked);
                                            continue;
                                        }
                                        mapSearchUtils.setLayerVisible(that.$map,code[i],isChecked,"1=1","ssfb");
                                    };
                                    // },100)
                                }
                            });
                        }
                    }
                });

                //第一次加载静态企业图层数据
                that.enterpriseLayer(that);

                //绑定静态企业选择事件
                $("#menu_con").find("input[data-id^='SP']").off("click").change(function () {

                    var code = $(this).attr("data-id").split("|");
                    var isChecked = $(this).is(":checked");
                    if(!isChecked){
                        $("#all").attr("checked",false);
                    }

                    AllSelected();

                    for(var i = 0 ; i<code.length;i++) {
                        //console.log(poiconfig.poiConfig[code[i]].config.locateIcon);
                        if/*("SP_KYQY"==code[i]){
                            mapSearchUtils.setLayerVisible(that.$map,"SP_KYZ",isChecked,"1=1","ssfb");
                            continue;
                        }else if("SP_HYQY"==code[i]){
                            mapSearchUtils.setLayerVisible(that.$map,"SP_WHTCC",isChecked,"1=1","ssfb");
                            continue;
                        }else if*/("SP_ZXCTKD"==code[i]){
                            mapSearchUtils.setTopicLayerVisible(that.$map,"bicycle_kejiekehuan",isChecked);
                            continue;
                        }
                        mapSearchUtils.setLayerVisible(that.$map,code[i],isChecked,"1=1","ssfb");
                    }
                });
                //全选选中
                function AllSelected(){
                    var t_str = "";
                    var t = $("#menu_con").find("input[type='checkbox']");
                    for(var i = 0;i<t.length;i++){
                        if("all"==t[i].id){
                            continue;
                        }
                        t_str+=t[i].checked+",";
                    }
                    if(t_str.indexOf("f")<0){
                        $("#all").prop("checked",true);
                    }
                }
            },
            //加载企业图层
            enterpriseLayer:function(that){
                $("#menu_con").find("input[data-id^='SP']").each(function () {
                    var code = $(this).attr("data-id").split("|");
                    for(var i = 0 ; i<code.length;i++) {
                        // setTimeout(function () {
                        if("SP_ZXCTKD"==code[i]){
                            mapSearchUtils.setTopicLayerVisible(that.$map,"bicycle_kejiekehuan",true);
                            continue;
                        }
                        mapSearchUtils.setLayerVisible(that.$map,code[i],true,"1=1","ssfb");
                        // },100)
                    }
                });
            },

            loadCluster:function(){

            },
            loadIndustyType:function(){
                var that=this;
                var industyTypeData=that.$bmCode&&that.$bmCode["industyType"];
                if(!industyTypeData){
                    setTimeout(function(){
                        industyTypeData=that.$bmCode["industyType"];
                    },100);
                }
                var industyType=that.$options.industyType;
                var orginIndustyType = "";
                if(industyType==''){
                    orginIndustyType = "realDistribution2";
                }
                if(!industyType){
                    industyType=that.$defIndustyType;
                }
                var data=new Array();
                var obj;
                for(var i=0;industyTypeData&&i<industyTypeData.length;i++){
                    if(industyType.indexOf(industyTypeData[i].code)>=0){
                        obj=new Object();
                        obj.code=industyTypeData[i].code;
                        obj.name=industyTypeData[i].text;
                        obj.clazz=that.$defClazz[industyTypeData[i].code];
                        data.push(obj);
                    }
                }
              return {
                  data:data,
                  industyType:industyType,
                  originIndustyType : orginIndustyType
              };
            },
            getCarNumber:function(state,callback){
                var that = this;
                $.ajax(window.AppConfig.NRemoteApiUrl + "rest/car/state/online", {
                    type: "POST",
                    data:{
                        runState:state,
                        industry:that.$inscode
                    },
                    dataType: "json",
                    success: function(data){
                        if (data || data.data) {
                            callback(data,state);
                        }
                    }
                });
            },
            //获取在线车辆的列表
            getCarsTable:function(){
                var that = this;
                var index = 0;
                $(".Online_inquiry").on('click',function(){
                    var state = $(this).attr("data-state");
                    $.ajax({
                        url :window.AppConfig.NRemoteApiUrl + "rest/car/state/operatorDropDown",
                        type:"post",
                        success:function(data){
                           if(data||data.data){
                               var tpl = that.showTableTemplate({drops:data.data});
                               layer.open({
                                   title:"车辆列表",
                                   type:1,
                                   area: ['1000px', '500px'], //宽高
                                   content:tpl
                               });
                               //详情弹窗表格调用
                               that.$tables = $("#panel_table").datagrid({
                                   nowrap: true,
                                   autoRowHeight: true,
                                   striped: true,
                                   collapsible: true,
                                   url :window.AppConfig.NRemoteApiUrl + "rest/car/state/online",
                                   queryParams:{
                                       industry:that.$inscode,
                                       runState:state
                                   },
                                   pagination:true,//显示分页
                                   fitConlumns:true,//列自适应宽度
                                   columns:[[
                                       {field:'companyName',title:'业户名称',align:'center'},
                                       {field:'companyLicenseNumber',title:'许可证号',align:'center'},
                                       {field:'plateNumber',title:'车牌号码',align:'center'},
                                       {field:'terminalTime',title:'最近上传GPS时间',align:'center'},
                                       {field:'runState',title:'车辆运行状态',align:'center'},
                                       {field:'platformName',title:'终端运营商名称',align:'center'},
                                       {field:'abnormalState',title:'GPS数据异常情况',align:'center'},
                                       {field:'plateColor',title:'车牌颜色',align:'center'}
                                   ]],
                                   loadFilter:function(data){
                                       var grid = $('#panel_table');
                                       var options = grid.datagrid('getPager').data("pagination").options;
                                       var pageNum = options.pageNumber;
                                       var pageSize = options.pageSize;
                                       index = (pageNum - 1) * pageSize + 1;
                                       if (data && data.data && data.returnFlag == "1") {
                                           data.rows = data.data.list;
                                           for(var i=0;i<data.data.list.length;i++){
                                               data.rows[i].runState = that.code("runState",data.rows[i].runState+"");
                                               data.rows[i].plateColor = that.code("plateColor",data.rows[i].plateColor);
                                               data.rows[i].abnormalState = that.code("abnormalState",data.rows[i].abnormalState+"");
                                               index++;
                                           }
                                           return data;
                                       }
                                   }
                               });
                               //分页汉化
                               var p = $('#panel_table').datagrid('getPager');
                               $(p).pagination({
                                   pageSize: 10,//每页显示的记录条数，默认为10
                                   pageList: [5, 10, 15],//可以设置每页记录条数的列表
                                   beforePageText: '第',//页数文本框前显示的汉字
                                   afterPageText: '页    共 {pages} 页',
                                   displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
                               });
                               $(".s-table").mCustomScrollbar({
                                   theme:"dark"
                               });
                               //导出
                               $("#tb-output").on("click",function(){
                                   var state_ = $("#runState").val(),
                                   companyName_ =$('#stbcompanyName').val(),//业户名称
                                   companyLicenseNumberLike_ = $('#stbcompanyLicenseNumberLike').val(),//许可证号
                                   plateNumber_ = $("#stbplateNumber").val(),//车牌号
                                   platformName_ = $("#stbplatformName").val()//运营商名称
                                   if(!state_) state_=state;
                                   var runState = "runState="+state_;
                                   var companyName = "companyName="+companyName_;
                                   var companyLicenseNumberLike = "companyLicenseNumber="+companyLicenseNumberLike_;
                                   var plateNumber = "plateNumber="+plateNumber_;
                                   var platformName = "platformName="+platformName_;
                                   var link = window.AppConfig.NRemoteApiUrl + "rest/car/state/expert?"
                                       +runState+"&"
                                       +companyName+"&"
                                       +companyLicenseNumberLike+"&"
                                       +plateNumber+"&"
                                       +platformName;
                                   window.open(link,"_blank")
                               });
                               $("#tb-search").on("click",function(){
                                   that.searchCarList()
                               });
                               $("#tb-refresh").on("click",function(){
                                   that.refreshList(that.$tables);
                               });
                               $("#tb-reset").on("click",function(){
                                   that.resetList()
                               });
                           }
                        }
                    });
                });
            },
            searchCarList:function(){
                    var data = {
                        companyName : $('#stbcompanyName').val(),//业户名称
                        companyLicenseNumberLike : $('#stbcompanyLicenseNumberLike').val(),//许可证号
                        plateNumber : $("#stbplateNumber").val(),//车牌号
                        runState : $("#runState").val(),//车辆运行状态
                        platformName : $("#stbplatformName").val()//运营商名称
                    };
                    $("#panel_table").datagrid('load',data);
            },
            refreshList:function(table){
                if(table){
                    table.datagrid("reload");
                }
            },
            resetList:function(){
                $("#runState").val("");
                $('#stbcompanyName').val("");
                $('#stbcompanyLicenseNumberLike').val("");
                $("#stbplateNumber").val("");
                $("#stbplatformName").val("");
            },

            addPanel: function(options) {
                /*if(this.$panelIds[options.id]){
                    return;
                }else{
                    this.$panelIds[options.id]=1;
                //}*/
                //options = options || {};
                //options.title = options.title || "平台运行监测";
                //options.id = options.id || new Date().getTime();
                //this.$tabs.addPanel(options.title, options.content,true, options.id,
                //    function(dom) {
                //        dom.find(".ui-tabs-panel").addClass("content-panel");
                //        options.callback && options.callback.call(options.callback, dom);
                //    });
            },
            /**
             * 出租车实时分布，左下角各功能
             * @param event
             */
            taxiStatus:function(event) {
                var _self = this;

                var va = $(event.target).closest("li").val();
                $("#tabsStatus").val(va);
                mapUtils.clusterTaxi( _self.$inscode, _self.$map,_self.$areaName);

            },

            addTabSwitchEvent : function () {
                $("#nav li").click(function () {
                    var index = $(this).index();
                    $(this).addClass("active").siblings().removeClass("active");
                    var tab = $(".tag").eq(index);
                    tab.css("display","block").siblings().css("display","none");
                });
            }




        });



        return view;
    });


