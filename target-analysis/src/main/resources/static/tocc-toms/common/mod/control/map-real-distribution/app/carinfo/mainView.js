/**
 * Created by mac-pc on 16/7/18.
 */
define([
    'jquery',
    'tocc-toms/common/BaseView',
    'tocc-toms/common/mod/control/map-tools/app/entrance/mapTools',
    'bmap',
    'layer',
    'map_utils',
    'log',
    'http_utils',
    'text!tocc-toms/track-car/tpl/car.html',
/*    "text!../../template/mapRealDistribution.html",*/
    'bmapui',
    'tocc-toms/common/rightTool'
],
    function($,BaseView,MapTools, bmap,layer,mapUtils,Log,Http,realTpl,bui,rightTool) {
        layer.config({
            path: '../../../libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        });
        var tracks = new Array();
        var clcxTpl = $(realTpl).filter("#lk-clcx").html();

        var view = BaseView.extend({
            el: ".frame-clcx",
            clcxemplate: _.template(clcxTpl),//模版解析
            events: {
                "click .road-icon-3": "tarckOneCar",
                "click .search": "velicleSearch",
                "click .info-item": "evtInfoItem",
                "blur #clcxCarNo": "clcxCarNo"
            },
            init: function () {
                var _self = this;
                _self.$inscode = {};
                _self.$total = {};
                _self.$car = {};
                // 模板加载的信息，用变量储存，用来判断是否需要掉接口加载
                _self.$templateInfo = {
                    // 车辆信息
                    infoContent:"",
                    // 用户
                    userContent:"",
                    // 电子路单
                    wxpdzldContent:"",
                    // 线路信息
                    kydzldContent:"",
                    // 趟次牌信息
                    bcdzldContent:"",
                };
                this._templateFn(realTpl);
                this.$track = null;
                this.$infoWindow = null;
                 
            },
            render: function (options) {
                options = options || {};
                this.$inscode = options.indCode || {};
                this.$areaName = options.areaName || {};
                this.initMap(options);
                this.loadJs();
                this.initUI();//初始化ui
                this.getCityCode();

            },
            initMap:function(param){
                var _self=this;
                this.$map = mapUtils.initMap("ptjkMap2", function () {
                    _self.$("#map-tools").append(new rightTool({
                        map: _self.$map,
                        warning: true,
                        draw: false,
                        indCode: _self.$inscode
                    }).render({type:"hide"}));

                    //加载地图工具栏
                    var options={
                        map:_self.$map,
                        container:_self.el,
                        type:param.type
                    };
                    window.map=_self.$map;
                    _self.$MapTools=new MapTools();
                    _self.$MapTools.render(options);
                    //预先加载本功能模块需要用到的地图扩展组件，避免因为异步加载地图组件带来的问题
                    _self.initMapExtendTool(_self.$map);
                });
                this.$map.plugin("beyond.data.CarLbsService", _self.getOnLineCar);
            },
            //预先加载本功能模块需要用到的地图扩展组件，避免因为异步加载地图组件带来的问题
            initMapExtendTool: function(map){
                //加载车辆跟踪组件
                map.plugin("beyond.maps.CarTrackPlay", null);
            },
            initUI: function () {
                //dom加载完毕

                $("button").wyButton();
                $("#popsClcx").css({
                    backgroundColor: "#fff"
                }).wySidepanel({
                    parent: $(".frame-clcx"),
                    float: "left",
                    hasHeader: false,
                    initialVisible: true,
                    buttons: {
                        toggle: true
                    },
                    onHide: function () {
                    }
                });
                $(".pop-view").mCustomScrollbar({
                    theme: "dark"
                });
            },
            loadInfoData: function (carNo,carColor,industry) {
                var _self = this;
                _self.fetchInfoDom(carNo,carColor,industry);
            },
            fetchInfoDom: function (carNo,carColor,industry) {
                $(".info-content .infoContent").html(this.$templateInfo.carInfo);
                $(".info-content .userContent").html(this.$templateInfo.infoContent);
                $(".info-content .wxpdzldContent").html(this.$templateInfo.wxpdzldContent);
                $(".info-content .kydzldContent").html(this.$templateInfo.kydzldContent);
                $(".info-content .bcdzldContent").html(this.$templateInfo.bcdzldContent);
                this.getShowTemplate(carNo)
               

                $(".list-item").mCustomScrollbar({
                    theme: "dark"
                });
            },
           
            /**
             * 获取车辆趟次牌，modify by shilz
             * @param carNo
             * @param carColor
             */
            getPassagerLine:function (carNo,carColor){
                var that = this;
                this.ajaxData({
                    url: 'rest/queryCar/getPassagerLine', data: {carNo: carNo}, callback: function (data) {
                        //alert(data)
                        if(data!=null&&(data.BCLX_BZPZP || data.BCLX_BZPLP)&&that.bcDzldTemplate) {
                            data = that.initTempdate(data);
                            data.KYLX_QDQHMC = data.KYLX_QDQHMC||"";
                            data.CARNO = data.PLATE_NUMBER;
                            var html = that.bcDzldTemplate(data);
                            $(".info-content .bcdzldContent").html(html);
                        } else {
                            $(".info-content .bcdzldContent").html("暂无趟次牌信息");
                        }
                    }
                })
            },
            initTempdate: function(data) {
                var defts = {
                    TERMINALTIME:'',
                    UPDATEDTIME:'',
                    CARNO:'',
                    COLOR:'',
                    INDUSTRY:'',
                    CLSS:'',
                    CLLX:'',
                    XJYFW:'',
                    LWLKZT:'',
                    XJYYF:'',
                    JRPT:'',
                    YYZT:'',
                    DLYSZH:'',
                    DLYSZYXQQ:'',
                    DLYSZYXQZ:'',
                    JYYF:'',
                    YHDZ:'',
                    QFJG:'',
                    JYZK:'',
                    JYXKZH:'',
                    JYFZR:'',
                    JYXKZHYXQQ:'',
                    JYXKZHYXQZ:'',
                    JYFW:'',
                    YHSS:'',
                    DHHM:'',
                    TONNAGE:'',
                    BCLX_ID:'',
                    BCLX_PH:'',
                    BCLX_LX:'',
                    BCLX_QSSJ:'',
                    BCLX_JSSJ:'',
                    BCLX_FZJG:'',
                    BCLX_FZRQ:'',
                    BCLX_YHMC:'',
                    BCLX_JYXKZH:'',
                    KYLX_ID:'',
                    KYLX_XLID:'',
                    KYLX_PH:'',
                    KYLX_TYPE:'',
                    KYLX_ZT:'',
                    KYLX_QSSJ:'',
                    KYLX_JSSJ:'',
                    KYLX_FZJG:'',
                    KYLX_FZRQ:'',
                    KYLX_RFBC:'',
                    KYLX_TJBX:'',
                    KYLX_TKZD:'',
                    WXPLX_ID:'',
                    WXPLX_HWID:'',
                    WXPLX_WTLDID:'',
                    WXPLX_ZYDH:'',
                    WXPLX_JSYXX:'',
                    WXPLX_JSYDH:'',
                    WXPLX_YYYXM:'',
                    WXPLX_YYYDH:'',
                    WXPLX_ZHSJ:'',
                    WXPLX_ZHDD:'',
                    WXPLX_XHRQ:'',
                    WXPLX_XHDD:'',
                    WXPLX_HWMC:'',
                    WXPLX_HWLX:'',
                    WXPLX_DS:'',
                    WXPLX_SFWT:'',
                    WXPLX_WTDJ:'',
                    WXPLX_WTSM:'',
                    WXPLX_FSRQ:'',
                    BCQZ_TYPE:'',
                    BCQZ_STATUS:'',
                    BCQZ_QSSJ:'',
                    BCQZ_JSSJ:'',
                    BCQZ_BZPSL:'',
                    KYLX_PH:'',
                    KYLX_MC:'',
                    KYLX_JYQY:'',
                    KYLX_LXLXBH:'',
                    KYLX_LXLXMC:'',
                    KYLX_SFD:'',
                    KYLX_SFZ:'',
                    KYLX_ZDD:'',
                    KYLX_ZDZ:'',
                    KYLX_QDQHMC:'',
                    KYLX_ZDQHMC:'',
                    BCLX_BCZT:'',
                    BCLX_BZPZP:'',
                    BCLX_BZPLP:'',
                    BCLX_QSD:'',
                    BCLX_MDD:'',
                    BCLX_ZYTJD:'',
                    BCLX_KSSJ:'',
                    BCLX_JSSJ:'',
                    BCLX_ZYR:'',
                    WXPLX_DW:'',
                    BCLX_BCZKS:'',
                    BCLX_CYR:''}
                data = $.extend(false, defts, data);
                var bzpzlbm = {"1": "临时","2":"正式"};
                var bzpztbm = {'0':'业务审核不通过','1':'业务进行中','2':'业务申请中','3':'业务已注销','4':'业务已完成','9':'其他'};
                var xllxbm = {'1':'县内','2':'县际','3':'市际','4':'省际','5':'国际'};

                data.KYLX_TYPE = bzpzlbm[data.KYLX_TYPE]||data.KYLX_TYPE;
                data.KYLX_ZT = bzpztbm[data.KYLX_ZT]||data.KYLX_ZT;
                data.KYLX_LXLXMC = xllxbm[data.KYLX_LXLXMC]||data.KYLX_LXLXMC;
                data.BCLX_BCZT = bzpztbm[data.BCLX_BCZT]||data.BCLX_BCZT;
                return data;

            },
            openInfoFrm: function (options) {
                options = options || {};
                options.carNo = options.carNo || "";
                options.color = options.color || 2;
                var _self = this;
                var x = options.x || window.AppConfig.mapCenter.x;
                var y = options.y || window.AppConfig.mapCenter.y;
                var item = options.openItem;
                //如果已经打开了一个窗口 则要将其关闭
                if(!_self.$infoWindow){
                    self.$infoWindow = new beyond.maps.BInfoWindow({
                        isCustom: true,
                        content: this.infoBoxTemplate(options),
                        offsetY: 170,
                        offsetX: 5
                    });
                }
                var nmap=options.map||this.$map;
                self.$infoWindow.open(nmap, new beyond.geometry.MapPoint(x, y));
                $(".btn-close").off("click").on("click", function (){
                    if(item&&item.length>0){
                        item.removeClass('active');
                    }
                    if(_self.$track){
                        _self.$track.removeOneTrack();
                    }
                    nmap.clearInfoWindow();
                });
                this.bindInfoEvt(options.carNo, options.color);
                this.loadInfoData(options.carNo, options.color,options.industry);
            },

            bindInfoEvt: function (carNo,color) {
                var _self = this;
                $(".msg-scroller").mCustomScrollbar({
                    theme: "dark"
                });
                $(".tools-ctr").on("mouseover", function () {
                    $(this).parents().find(".tools-pop").show();
                }).siblings(".tools-pop").on("mouseleave", function () {
                    $(this).hide();
                });
             
                function changeUl(elm, ctr,carNo) {
                    $('#' + ctr).children().each(function (index, el) {
                        $(el).attr('id', ctr + index)
                    });
                    $('#' + elm).find("li").each(function (index, el) {
                        $(el).on('click', function () {
                            $(this).addClass("actived").siblings("li").removeClass("actived");
         
                            if(!_self.$templateInfo[$(this).data("address")]){
                                
                                _self.getShowTemplate(carNo,$(this).data("address"))
                              
                            }
                            $('#' + ctr + index).show().siblings().hide();
                        })
                    });
                }

                changeUl("changeInfo", "changeBox",carNo);
                changeUl("change-list", 'change-list-box',carNo);

                $(".titR-care").on("click", function () {

                });
                $(".titR-follow").on("click", function (evt) {
                    _self.openTarckCar($(this).data("carno"), $(this).data("color"));
                })
            },
            // 按需加载模板信息
            getShowTemplate:function(carNo,address){
                var _self = this;
                var  address = address||"infoContent"
                console.log(carNo,address)
                switch(address){
                    case "infoContent" : $.ajax({
                        type:"post",
                        data:{carNo: carNo},
                        async:false,
                        url:window.AppConfig.RemoteApiUrl+'rest/queryDetails/carInfo',
                        success:function(data){
                            _self.initTempdate(data);
                            _self.$templateInfo.carInfo=_self.carInfoTemplate(data)
                            $(".info-content .infoContent").html(this.$templateInfo.carInfo);
                        }
                        
                    })
                    break;
                    case "userContent" : $.ajax({
                        type:"post",
                        data:{carNo: carNo},
                        async:false,
                        url:window.AppConfig.RemoteApiUrl+'rest/queryDetails/companyInfo',
                        success:function(data){
                            _self.initTempdate(data);
                            _self.$templateInfo.carInfo=_self.carInfoTemplate(data)
                            $(".info-content .userContent").html(this.$templateInfo.carInfo);
                        }
                    })
                     break;
                    case "wxpdzldContent" : $.ajax({
                        type:"post",
                        data:{carNo: carNo},
                        async:false,
                        url:window.AppConfig.RemoteApiUrl+'rest/queryDetails/passCardInfo',
                        success:function(data){
                            _self.initTempdate(data);
                            _self.$templateInfo.carInfo=_self.carInfoTemplate(data)
                            $(".info-content .wxpdzldContent").html(this.$templateInfo.carInfo);
                        }
                    })
                     break;
                    case "kydzldContent" : $.ajax({
                        type:"post",
                        data:{carNo: carNo},
                        async:false,
                        url:window.AppConfig.RemoteApiUrl+'rest/queryDetails/electronicInfo',
                        success:function(data){
                            _self.initTempdate(data);
                            _self.$templateInfo.carInfo=_self.carInfoTemplate(data)
                            $(".info-content .kydzldContent").html(this.$templateInfo.carInfo);
                        }
                    })
                     break;
                    case "bcdzldContent" : $.ajax({
                        type:"post",
                        data:{carNo: carNo},
                        async:false,
                        url:window.AppConfig.RemoteApiUrl+'rest/queryDetails/lineInfo',
                        success:function(data){
                            _self.initTempdate(data);
                            _self.$templateInfo.carInfo=_self.carInfoTemplate(data)
                            $(".info-content .bcdzldContent").html(this.$templateInfo.carInfo);
                        }
                    })
                     break;
                }
            },
            loadJs: function () {

            },

            //请求数据
            getResponseList: function (options, pageNum, hasParam) {
                this.$result = null
                options = options || {};
                var that = this;
                var defaults;
                if (pageNum) {
                    if (that.$total % 10 == 0 && Math.floor(that.$total / 10) == pageNum) {
                        $(".no-more").attr("disabled", "disabled").html("已无更多");
                    } else if (that.$total % 10 != 0 && pageNum == (Math.floor(that.$total / 10) + 1)) {
                        $(".no-more").attr("disabled", "disabled").html("已无更多");
                    }
                    defaults = {
                        pageNum: pageNum
                    }
                } else {
                    defaults = {
                        pageSize: 10,//每页记录数
                        pageNum: 1//当前页
                    };
                }
                var defts = $.extend({}, defaults, options);

                this.$itemCollection.url = window.AppConfig.NRemoteApiUrl + options.url;
                Http.post({model: that.$itemCollection, data: defts}, function (returnInfo) {
                    if (returnInfo && returnInfo.returnFlag == "1") {//查询成功
                        this.$result = returnInfo.data;
                        Log.info("分页查询成功");
                        that.creatDom(this.$result.list, hasParam,that);
                        that.BindingEvents();
                        that.$total = this.$result.totalCount;
                        if($("#clcxOnOrOff").val() == 1){
                            $(".onLine").html(that.$total);
                        }
                        $(".no-data").attr("hidden","hidden");
                        if(returnInfo.data.totalCount == 0){
                            $(".no-data").removeAttr("hidden");
                        }
                        if(returnInfo.data.list.length < 10){
                            $(".no-more").attr("disabled", "disabled").html("已无更多");
                        }else{
                            $(".no-more").removeAttr("disabled").html("加载更多");
                        }

                    }
                });
            },


            /*
             车辆查询
             */
            velicleSearch: function () {
                var that = this;
                var carNo = $("#clcxCarNo").val();
                var company = $("#clcxCompany").val();
                var opt = {
                    "carNo": carNo,
                    "company": company,
                    "industryType": that.$inscode
                };
                that.selectValue(opt);
                that.page(opt, null, true);
            },

            /*
             追踪一辆车
             */
            tarckOneCar: function (event) {
                var car = $(event.target).closest(".info-item").data("sd") || {};//获取绑定在li标签的车辆数据
                this.openTarckCar(car.plateNumber, car.plateColor);
            },
            // openTarckCar: function (carNo, color) {
            //     mapUtils.openTrackWin({
            //         data: {
            //             carNo: carNo,
            //             win: 'now',
            //             color: color
            //         },
            //         title: "跟踪－" + carNo,
            //         type: 'tabs'
            //     });
            // },
            /*
             生成DOM
             tpl 模板

             data 模板需要的数据
             */
            creatDom: function (data, hasParam,_that) {
                var _self = _that||this;
                if (hasParam) {
                    this.$("#result-list").html(this.clcxemplate({list: data}));
                } else {
                    this.$("#result-list").append(this.clcxemplate({list: data}));
                }
                $(".info-item").on("click", function (event) {
                    var element = event.target;
                    if(_self.$track){
                        _self.$track.removeOneTrack();
                        _self.$map.clearInfoWindow();
                    }
                    if(element.nodeName == 'A') return;
                    //如果有追踪 则移除追踪
                    /*if($(this).hasClass('active')){
                        if(_self.$track) _self.$track.removeOneTrack();
                        return
                    }*/
                    var that = $(this);
                    $(this).addClass('active').siblings(".info-item").removeClass('active');
                    var car = $(this).data("sd") || {};
                    _self.$track = mapUtils.trackOneCar(_self.$map,car.plateNumber,function (data) {
                        Log.debug(data);
                        var result = data.getData() || {};
                        if(!result.longitude||!result.latitude){
                            layer.msg("未获取到该车辆的最新位置信息。");
                            return;
                        }
                        _self.openInfoFrm({
                            openItem:that,
                            carNo: car.plateNumber,
                            color: result.plateColor,
                            x: result.longitude,
                            y: result.latitude,
                            re: true
                        })
                    },2);
                    return false;
                });
            },

            /*
             分页查询
             */
            page: function (op, pageNum, hasParam) {
                //Log.debug(this.code());
                // var that = this;
                // var opt = {
                //     "url": "queryCar/pageCar",
                //     industry:that.$inscode,
                //     areaNames:that.$areaName
                // };
                // opt = $.extend({}, opt, op);
                // var isOnLine = $("#clcxOnOrOff").val();
                // opt.isOnLine = isOnLine;
                // this.getResponseList(opt, pageNum, hasParam);
            },

            //查询行政区划
            getCityCode:function(){
                var that = this;
                that.ajaxData({
                    noPage:true,
                    url:"rest/cityCode/getCityCode",
                    callback:function(result){
                        if(result){
                            var select = $("#clcxCity");
                            var data = _.groupBy(result,function(obj){
                                return obj.pcode;
                            });
                            result = data[that.$areaName] || {};
                            for(var i = 0;i < result.length;i++){
                                select.append("<option value="+result[i].code+">"+result[i].name+"</option>")
                            }
                        }
                        that.page();
                    }
                })
            },

            //下拉列表值
            selectValue:function(options){
                var that = this;
                var areaCode = $("#clcxCity").val();
                var isAttention = $("#clcxAttention").val();
                var isOnLine = $("#clcxOnOrOff").val();
                options.areaCode = areaCode;
                options.isOnLine = isOnLine;
                if(areaCode == 0){
                    options.areaCode = undefined;
                }
                if(isAttention == 1){
                    options.isAttention = undefined;
                }else if(isAttention == 2){
                    options.isAttention = 1;
                }else{
                    options.isAttention = 0;
                }
            },

            //是否在线
            getOnLineCar: function () {
                car = new beyond.data.CarLbsService();
                //car.setmap(this.$map);
                car.getLineCount(function (result) {
                    var data = result._data;
                    if (data) {
                        if (data.online == 0 || data.online == -1) {
                            $(".onLine").html("0");
                        } else {
                            $(".onLine").html(data.online);
                        }
                        if (data.offline == 0 || data.offline == -1) {
                            $(".offLine").html("0");
                        } else {
                            $(".offLine").html(data.offline);
                        }
                    }

                }, null);
            },

            //添加关注
            addAtttention: function (data, that) {
                var _self = this;
                _self.ajaxData({
                    noPage: true,
                    url: "rest/attention/addAttention",
                    data: data,
                    callback: function (result) {
                        if (result) {
                            layer.msg("关注成功！");
                            $(that).removeClass("attention").addClass("loseAttention selected").attr("data-id", result.id).html("取消");
                            $(that).attr("title","取消关注");
                        }
                    }
                })
            },

            //取消关注
            loseAttention: function (data, that) {
                var _self = this;
                _self.ajaxData({
                    noPage: true,
                    url: "rest/attention/loseAttention",
                    data: data,
                    callback: function (result) {
                        if (result) {
                            if (data.isAttention == 1) {
                                layer.msg("关注成功！");
                                $(that).removeClass("attention").addClass("loseAttention selected").attr("data-id", result.id).html("取消");
                                $(that).attr("title","取消关注");
                            } else {
                                layer.msg("取消关注成功！");
                                $(that).removeClass("loseAttention selected").addClass("attention").html("关注");
                                $(that).removeAttr("title");
                            }
                        }
                    }
                })
            },

            //绑定事件
            BindingEvents: function () {
                var _self = this;
                //点击关注
                $(".attention").off("click").on("click", function (event) {
                    $(this).parent(".btn-group").trigger("click", this);
                });

                //点击取消关注
                $(".loseAttention").off("click").on("click", function () {
                    $(this).parent(".btn-group").trigger("click", this);
                });

                $(".btn-group").unbind("click").bind("click", function (event, _se) {
                    var number = $(_se).closest(".items").find(".car-number");
                    var carNum = number.html();
                    var color = number.data("color");
                    var data = {};
                    data.plateNumber = carNum;
                    data.plateColor = color || undefined;
                    if ($(_se)[0] && $(_se)[0].className == "attention") {
                        data.isAttention = 1;
                        if ($(_se).data("id")) {
                            var id = $(_se).data("id");
                            data.id = id;
                            _self.loseAttention(data, _se);
                        } else {
                            _self.addAtttention(data, _se);
                        }
                    } else {
                        var id = $(_se).data("id");
                        data.id = id;
                        data.isAttention = 0;
                        _self.loseAttention(data, _se);
                    }
                });

                //点击加载更多
                $(".no-more").off("click").on("click", function () {

                    var num = $(this).data("num") + 1;

                    $(this).data("num", num);
                    var data = {};
                    var carNo =  $("#clcxCarNo").val();
                    var company = $("#clcxCompany").val();
                    _self.selectValue(data)
                    data.carNo = carNo;
                    data.company = company;
                    _self.page(data, num);
                });
                //视频弹窗--只需要更改触发按钮
                $("#a1").click(function(){
                    $('#call_police').fadeIn("slow");
                });
                $("#call_police_close").click(function(){
                    $('#call_police').fadeOut("slow");
                });
                //$(".road-icon-2").bind('click',function (event) {
                //    $("#messageBox").show();
                //});
                //$("#msgClose").on("click", function () {
                //    $("#messageBox").hide();
                //});
            },
            carDataInfoWindow:function(carData,mapItem){
                var _self=this;
                _self.openInfoFrm({
                    openItem:null,
                    map:mapItem,
                    carNo: carData.plateNumber,
                    color: carData.color,
                    x: carData.longitude,
                    y: carData.latitude,
                    re: true,
                    industry:carData.industry
                });
                $(".care.titR-follow").hide();
                setTimeout(function() {
                    mapItem.setCenter(new beyond.geometry.MapPoint(carData.longitude,carData.latitude));
                }, 200);
            }
            //车牌号验证
            //clcxCarNo:function(){
            //    $("#clcxCarNo").blur(function(){
            //        var reg=/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/;
            //        var carno = $("#clcxCarNo").val();
            //        if(!reg.test(carno))
            //        {
            //            $("#validation_tip").show();
            //        }else{
            //            $("#validation_tip").hide();
            //        }
            //    });
         //}

    });
        return view;
    })









