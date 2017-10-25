/**
 * Created by zwt on 2016/9/18.
 */
define([
    'backbone',
    'tocc-toms/common/BaseView',
    'text!monitor/template/rightTool/rightTool.html',
    'jquery',
    'easyui',
    'layer',
    'cache',
    'dateutils',
    'wdatepicker'
],function(BackBone,bv,tpl,$,easyUI,layer,Cache,dateUtils){
    layer.config({
        path: '../../../libs/core/layer/'//layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    var view = bv.extend({
        events: {
            'click #viewImg':"_changeTypeVector",
            'click #map-tools-type' : "_changeTypeImage",
            'click .map-tools-draw':"_mapDraw",
            'click #map-tools-ranging':"_ranging",
            'click #map-tools-plan':"_plan",
            'click #map-tools-zoomIn':"_zoomIn",
            'click #map-tools-zoomOut':"_zoomOut",
            'mouseover #right-tools-ctr':"_showpop",
            'mouseleave .tools-pop':"_hidepop",
            'click #right-tools-ctr':"_showcall_police",
            'click #map-tools-warning':"_mapToolsWarningshow",
            'click #call_police_close':"_mapToolsWarninghide",
            'click #search':"search",
            'click #reset':"reset",
            'click .refresh':'refresh'
        },
        init: function(options) {
            options = options || {};
            this.$map = options.map;
            this.$mapType = true;
            this._templateFn(tpl);
            this.ellipse = null;
            this.$warning = options.warning;
            this.$draw = options.draw;
            this.$drawOver = options.drawOver;
            this.$canDraw = options.candraw;
            this.$sound = options.sound;
            this.$warnNum = 0;
            this.$tables = {};
            this.$inscode = options.indCode || {};
            this.$bmCode = Cache.getItem("bmCode") || this.loadBmCode(Cache);
        },
        render: function(options) {
            var that = this;
            if(!options||!options.type){
                options=new Object();
                options.type='show';
            }
            this.$el.html(this.rightToolsTemplate(options));
            var warning = this.$warning;
            var draw = this.$draw;
            setTimeout(function(){
                if(!warning){$("#map-tools-warning").remove();}
                if(!draw){$(".map-tools-draw-ctr").remove();}
            },1);
            if (this.$warning) {
                //获取一周内报警数量
                this.getWeekWarnCount(true);
                if (window.AppConfig.warnFreshTime > 0) {
                    setInterval(function() {
                        that.getWeekWarnCount();
                    }, window.AppConfig.warnFreshTime);
                }
            }

            return  this.$el;
        },
        _showpop:function(){
            $(".tools-pop").show()
        },
        _hidepop:function(){
            $(".tools-pop").hide();
        },
        _changeTypeVector: function() {
            //this.$mapType=!this.$mapType;
            //this.$mapType?this.$map.setMapType(beyond.maps.MapType.IMAGE):this.$map.setMapType(beyond.maps.MapType.VECTOR);
            this.$map.setMapType(beyond.maps.MapType.VECTOR);
        },
        _changeTypeImage:function(){
            this.$map.setMapType(beyond.maps.MapType.IMAGE);
        },
        _mapDraw : function (){
            var evt = event||arguments[0];
            var obj = evt.srcElement ? evt.srcElement:event.target;
            var type = $(obj).parent().attr('data-type');
            var that = this;
            var ellipse = null;
            if(type=='standcar'&&!that.$canDraw()) return;
            this.$map.setMouseTool(DrawType.QUERY_CIRCLE,function(center_,radius_,unit_)
            {
                //that.$map.removeOverlay("query_circle");
                //单位默认是米
                ellipse = new beyond.maps.BCircle({
                    "center":center_,
                    "radius": radius_,
                    "unit":unit_,
                    "strokeColor": "#a3b1cc",
                    "strokeOpacity": 0.9,
                    "strokeWeight": 1,
                    "fillColor": "#4673cc",
                    "fillOpacity": 0.2,
                    "isShowStatus":false
                });
                that.$map.addOverlay(ellipse,"query_circle");
                that.$map.setMouseTool(DrawType.PAN);
                ellipse.addEventListener("drawEnd",that._editCircleEnd(center_, radius_, unit_,ellipse,type));
            });
        },
        //打开查询窗口
        _editCircleEnd : function (center_, radius_,unit_,ellipse_,type_) {
            var that = this;
            var map = this.$map;
            var dtype = type_||{};
            var ellipse = ellipse_||{};
            var marker=new beyond.maps.Marker({
                position:center_,//位置
                icon:'css/imgs/dw_byond.png',//图标
                width:20,//宽度
                height:34,//高度
                editEnable:false,
                offsetX:0,
                offsetY:30
            });
            that._getAddress(center_,function(address){
                //单位默认是米
                var infoWindow = new beyond.maps.BInfoWindow({
                    isCustom:true,
                    content:that._openInfo(radius_,address,dtype),
                    offsetY:34
                });
                infoWindow.open(map,center_);
                map.addOverlay(marker);
                map.setCenter(marker.getPosition());
                that._bindInfoEvt(center_,radius_,address,marker,ellipse,dtype);
            });
        },
        //获取地名
        _getAddress:function(center_,callback){
            if(!center_) return;
            var center = center_.toGeo();
            var x = center.x,
                y = center.y;
            var geocoder = new beyond.data.GeocodeService();
            geocoder.regeo(function(json){
                var data = json.getData();
                if (data) {
                    callback(data.formattedAddress);//返回地址描述
                } else {
                    callback("未知位置");
                }
            }, x, y);
        },
        _openInfo : function(radius_,address_,dtype_){
            var type = dtype_;
            var r = parseInt(radius_)+1;
            var html = '<div class="windowInfo">'+
                '<div class="w_tit" title="'+address_+'">'+address_+'<i class="zmdi zmdi-close"></i></div>'+
                '<div class="w_content">'+
                '<div class="w_radius">附近<span>'+r+'</span>米</div>'+
                '<div>'+
                '<div id="dateInfo"></div>'+
                '<i class="iconfont">&#xe604;</i>'+
                '</div>'+
                '<div class="w_radius">前后<input type="text" id="timeRange" value="5"/>分钟</div>'+
                '</div>'+
                '<div class="btn-group" id="w_bts">'+
                '<button type="button" class="check">查询</button>'+
                '<button type="button" class="rest">取消</button>'+
                '</div></div>';
            var html2 = '<div class="windowInfo-small">'+
                '<div class="w_content">'+
                '<div class="w_radius">附近<span>'+r+'</span>米</div>'+
                '<div>'+
                '<div class="btn-group" id="w_bts">'+
                '<button type="button" class="check">查询</button>'+
                '<button type="button" class="rest">取消</button>'+
                '</div>'+
                '</div>';
            switch (type){
                case 'lostfound':return html;
                    break;
                case 'standcar':return html2;
                    break;
                default :return 1;
            }
        },
        _bindInfoEvt:function(center_,radius_,address_,marker_,ellipse_,type_){
            var _self = this;
            var map = this.$map;
            var data = {};
            var type = type_;
            if(type == 'lostfound'){
                $('.w_tit').find('i').click(function(){
                    map.clearInfoWindow();
                    map.removeOverlay(marker_);
                    map.removeOverlay(ellipse_);
                });
                $("#dateInfo").click(function(){
                    WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',skin:'twoer'})
                }).siblings('i').click(function(){
                    WdatePicker({el:'dateInfo',dateFmt:'yyyy-MM-dd HH:mm:ss',skin:'twoer'})
                });
                $("#w_bts").find('.check').on('click',function(){
                    var time = $("#dateInfo").html();
                    var range = $('#timeRange').val();
                    if(!time||!range){
                        layer.msg("请输入一个有效的时间");
                        return;
                    };
                    var reg = new RegExp("^[0-9]*$");
                    if(!reg.test(range)){
                        layer.msg("请输入一个合法的数数字");
                        return false;
                    }
                    data = {
                        address:address_,
                        date:time,
                        range:range,
                        radius:radius_,
                        center:center_,
                        marker:marker_,
                        ellipse:ellipse_
                    };
                    _self._getCheckInfo(data,type);
                    map.clearInfoWindow();
                    //map.removeOverlay(ellipse_);
                });
                $("#w_bts").find('.rest').on('click',function(){
                    map.clearInfoWindow();
                    map.removeOverlay(marker_);
                    map.removeOverlay(ellipse_);
                })
            }else if(type == 'standcar'){
                $("#w_bts").find('.check').on('click',function(){
                    data = {
                        address:address_,
                        radius:radius_,
                        center:center_,
                        marker:marker_,
                        ellipse:ellipse_
                    };
                    _self._getCheckInfo(data,type);
                    map.clearInfoWindow();
                    //map.removeOverlay(ellipse_);
                });
                $("#w_bts").find('.rest').on('click',function(){
                    map.clearInfoWindow();
                    map.removeOverlay(marker_);
                    map.removeOverlay(ellipse_);

                })
            }
        },
        //进行查询
        _getCheckInfo : function(data,type_){
            this.$drawOver(data,type_);
        },
        _ranging : function (){
            this.$map.setMouseTool(DrawType.MEASURE);
        },
        _plan : function (){
            this.$map.setMouseTool(DrawType.MEASAREA);
        },
        _zoomIn: function(){
            this.$map.setMouseTool(DrawType.RECT_ZOOMIN)
        },
        _zoomOut: function(){
            this.$map.setMouseTool(DrawType.RECT_ZOOMOUT)
        },
        _mapToolsWarningshow:function(){
            $("#call_police").fadeIn("slow");//点击报警，弹框
            $("#warn_Type").html("");
            this.$bmCode = this.$bmCode || {};
            var data = this.$bmCode['warnType'];
            if (!data || data.length <= 0) {
                data = data || [];
                data.push({code: 0, text: '超速'});
                data.push({code: 1, text: '驶入'});
                data.push({code: 2, text: '驶出'});
                data.push({code: 3, text: '异常聚焦'});
            }
            $("#warn_Type").html("<option value=-1>请选择</option>");
            for(var i = 0;i < data.length;i++){
                $("#warn_Type").append("<option value="+data[i].code+">"+data[i].text+"</option>")
            }
            this.getPage();
        },
        _mapToolsWarninghide:function(){
            $("#call_police").fadeOut("slow");
        },

        getPage:function(options){
            var that = this;
            var index = 0;
            that.$tables = $("#warning_table").datagrid({
                nowrap : true,
                autoRowHeight : true,
                striped : true,
                collapsible : false,
                fitConlumns: true, //列自适应宽度
                url :window.AppConfig.RemoteApiUrl + '/rest/warn/getPage',
                queryParams:{
                    industry:this.$inscode
                },
                loadFilter:function(data){
                    var grid = $('#warning_table');
                    var options = grid.datagrid('getPager').data("pagination").options;
                    var pageNum = options.pageNumber;
                    var pageSize = options.pageSize;
                    index = (pageNum - 1) * pageSize+1;
                    if(data && data.data && data.returnFlag == "1"){
                        data = data.data;
                        for(var i = 0;i<data.rows.length;i++){
                            var type = _.filter(that.$bmCode['warnType'],function(dat){
                                return dat.code == data.rows[i].type+"";
                            });
                            var color = _.filter(that.$bmCode['plateColor'],function(dat){
                                return dat.code == data.rows[i].plateColor+"";
                            });
                            var date  = new Date(data.rows[i].startTime );
                            data.rows[i].startTime = dateUtils.dateFmt(date,'yyyy-MM-dd hh:mm:ss');
                            var date2 = data.rows[i].endTime;
                            if (date2) {
                                date2 = dateUtils.dateFmt(new Date(date2),'yyyy-MM-dd hh:mm:ss')
                            }
                            data.rows[i].endTime = date2;
                            data.rows[i].type = type[0].text;
                            data.rows[i].plateColor = color[0].text;
                            data.rows[i].COMPANYNAME = that.addTitleHtml(data.rows[i].COMPANYNAME);
                            data.rows[i].businessScopeName = that.addTitleHtml(data.rows[i].businessScopeName);
                            data.rows[i].pubDesc = that.addTitleHtml(data.rows[i].pubDesc);

                            data.rows[i].sid = index;
                            index ++;
                        }
                        return data;
                    }else{
                        return data;
                    }
                },
                columns:[
                    {field:'sid',title:'序号',formatter: remarkFormater},
                    {field:'plateNumber',title:'车牌号码',align:'right',formatter: remarkFormater},
                    {field:'plateColor',title:'车牌颜色',formatter: remarkFormater},
                    {field:'COMPANYNAME',title:'业户名称',formatter: remarkFormater},
                    {field:'businessScopeName',title:'经营范围', width: fixWidth(0.1),formatter: remarkFormater},
                    {field:'type',title:'报警类型',formatter: remarkFormater},
                    {field:'pubDesc',title:'问题描述',formatter: remarkFormater},
                    {field:'startTime',title:'开始时间',align:'right',formatter: remarkFormater},
                    {field:'endTime',title:'结束时间',align:'right',formatter: remarkFormater}
                ],
                pagination : true,
                rownumbers : false
            });
            //列宽
            function fixWidth(percent) {
                return document.documentElement.clientWidth * percent; //这里你可以自己做调整
            };
            /*tip*/
            function remarkFormater(value, row, index) {
                if(!value){
                    return value;
                }
                var content = '';
                var abValue = value; //鼠标移到的对应列的value值
                content = '<span title="' + value + '">' + abValue + '</span>'; //格式化一个<a>标签，重新给单元格附上一个新的格式
                return content
            };
            //$(".pagination-page-list").attr("disabled","disabled");
            //铃铛报警时间查询
            $("#start_Time").on('click',function(){
                WdatePicker({el:'start_Time',dateFmt:'yyyy-MM-dd HH:mm:ss',skin:'twoer'})
            });
            $("#end_Time").on('click',function(){
                WdatePicker({el:'end_Time',dateFmt:'yyyy-MM-dd HH:mm:ss',skin:'twoer'})
            });

            $(".datagrid-htable").attr("id","tableExcel");
            //$(".datagrid-view2 .datagrid-htable").width($(".datagrid-view2 .datagrid-header-inner").css("width")) ;
            $(".datagrid").css("padding-bottom",10);
            this.$tables.datagrid("reload");
        },
        addTitleHtml: function(text) {
            if (text) {
                text = "<span title='"+ text +"'>"+text+"</span>";
            }
            return text;
        },
        //获取编码
        loadBmCode: function(Cache,callback) {
            /**
             * 加载字典表数据至缓存中
             */
            var that = this;
            $.ajax(window.AppConfig.NRemoteApiUrl + "common/codelibrary/getCodeMapData", {
                type: "POST",
                dataType: "json",
                success: function(data){
                    if (data || data.data) {
                        that.$bmCode = data.data;
                        Cache.setItem("bmCode", data.data);
                        callback && callback();
                    }
                }
            });
        },

        //查询
        search:function(){
            var data = {};
            var warnType =  $("#warn_Type").val();
            if(warnType != "-1"){
                data.type = warnType;
            }
            var endTime = $("#endT_ime").val();
            var startTime = $("#start_Time").val();
            if(endTime){
                data.endTime = new Date(endTime);
            }
            if(startTime){
                data.startTime = new Date(startTime);
            }
            $("#warning_table").datagrid("load",data);
        },

        //重置
        reset:function(){
            $("#warn_Type").val("-1");
            $("#end_Time").val("");
            $("#start_Time").val("");
        },
        //查询一周内报警数量
        getWeekWarnCount:function(first){
            var industry = this.$inscode;
            var that = this;
            var url = window.AppConfig.RemoteApiUrl + "/rest/warn/getWeekCount";
            if(industry!=null){
                url+="?industry="+industry;
            }
            $.ajax({
                url:url ,
                type: "get",
                success:function(data){
                    that.playSound(data.data)
                    that.$warnNum = data.data;
                    $("#map-tools-warning .tools.alarm_hover").html(data.data);
                    //alert(data.data)
                },
                error:function(data){

                }
            });
        },
        playSound: function(num) {
            $("#Player").remove();
            if (num > this.$warnNum) {
                if (this.$sound) {
                    $("body").append('<audio  id="Player" autoplay ><source src="../resource/aud/baojing.mp3" type="audio/mpeg"></audio>');
                }
            }

        },
        refresh:function(){
            //this.$tables.datagrid("reload");
            this.search();
        }
    });

    return view;
})