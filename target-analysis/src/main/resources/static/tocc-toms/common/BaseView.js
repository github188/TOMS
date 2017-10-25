/**
 * Created by mac-pc on 16/3/3.
 */
define(['bmap','map_utils','layer',],
    function(bmp,mapUtils,layer) {
        var view = Backbone.View.extend({
            initialize: function() {
               
                this.$tplNames = [];
                this.$ajaxData = [];
                this.$pageParam = {};
                this.$sortParam = {};//排序字段
                this.$lastParm = {};//最后一次查询条件
                this.$baseTpl = {};
                this.$urlData = this.request();
             
                var options = arguments.length > 0 ? arguments[0] : {};
                layer.config({
                    path: './libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
                });
                this.init(options);
            },

            authors: function() {
                this.$authorCode = window.AppConfig.pageAuth;
                if (this.$authorCode) {
                    if (this.$sysCode) {
                        this.$authors = orm_client.getAuthors(this.$sysCode);
                    }
                    if (this.$authors && this.$authors.length > 0) {
                        $(".author").hide();
                        for (var i = 0; i < this.$authors.length; i ++) {
                            $(".author."+this.$authors[i].code).show();
                        }
                    }
                }
            },

            init: function() {
                var that = this;
            },

              request: function(paramUrl) {
                var url = paramUrl || location.href;
                if (url.indexOf("?") <= 0) {
                    return {};
                }
                var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
                var paraObj = {};
                for (i = 0; i <=paraString.length; i++) {
                    var j = paraString[i] || 'wanglltest=';
                    paraObj[j.substring(0, j.indexOf("="))] = decodeURIComponent(j.substring(j.indexOf("=") + 1, j.length));
                }
                if (paraObj instanceof String) {
                    paraObj = eval("("+paraObj+")");
                }
                return paraObj;
            },
            
            //ajax请求封住
            ajaxData: function(options) {
                var that = this;
                options = options || {};
                var data = options.noPage ? {} : {
                    pageNum:1,
                    pageSize:10,
                    onPage: 1
                };
                options.callback = options.callback || function() {};
                options.data = options.data || {};
                data = $.extend(true, data, this.$pageParam, this.$sortParam, this.$lastParm, options.data);
                this.$itemCollection.url = window.AppConfig.NRemoteApiUrl + options.url;
                var defaults = {
                    model: this.$itemCollection,
                    data: data
                };
                //var defts = $.extend(true, defaults, options);
                Http.post(defaults, function(result) {
                    if (this.$pageParam) {
                        if (result && result.returnFlag && result.returnFlag === "1") {
                            if (result.data) {
                                //保存列表分页信息
                                that.$page = {
                                    nowPage: result.data.pageNo,
                                    pageSize: result.data.pageSize,
                                    recordTotal: result.data.totalCount
                                }
                                var rst = result.data.list || [];
                                that.$ajaxData = rst;
                                options.callback && options.callback.call(options.callback, rst ,result);

                            }
                        }
                    } else {
                        if (result && result.returnFlag && result.returnFlag === "1") {
                            if (result.data) {
                                that.$ajaxData = result.data;
                                options.callback && options.callback.call(options.callback, result.data ,result);
                            }
                        }
                    }
                }, options.error);
            },
           

            initUI: function() {

            },
            
            //查询 分析规则表信息
            selectFenceInfo:function(callback){
                $.ajax({
                    type: 'post',
                    url: window.AppConfig.NRemoteApiUrl + 'ruleInfo/all',
                    dataType: 'json',
                    success: function (data) {
                        //将返回的数据放入回调
                        callback && callback(data);
                    },
                    error: function () {
                        console.log("请求分析规则表 数据失败");
                    }
                });
            },
            creatFenceOption:function(ele){
                if(!ele){
                    console.log("请将选择器作为参数传入")
                    return;
                }
                this.selectFenceInfo(function(data){
                    
                    if(!data) return;
                    for(var i = 0;i<data.length;i++){
                        var optionTpl = '<option value="'+data[i].id+'">'+data[i].name+'</option>'
                        $(ele).append(optionTpl)
                    }
                })

            },
            //请求 车辆在线表的入嘉对应行业的在线车辆数据
            queryVehicleOnline: function(industyType,callback){
                $.ajax({
                    type: 'post',
                    url: window.AppConfig.NRemoteApiUrl + 'vehicleOnline/selectJXExceptionVehicle',
                    data: {
                        'scode':window.AppConfig.scode
                    },
                    dataType: 'json',
                    success: function (data) {
                        if(data.length == 0)
                            data = null;
                        callback && callback(data);
                    },
                    error: function () {
                        console.log("请求失败");
                    }
                });
            },
            //请求 车辆在线表的入厦对应行业的在线车辆数据
            queryXMVehicleOnline: function(industyType,callback){
                $.ajax({
                    type: 'post',
                    url: window.AppConfig.NRemoteApiUrl + 'vehicleOnline/queryXMExceptionVehicle',
                    data: {
                        'scode':window.AppConfig.scode
                    },
                    dataType: 'json',
                    success: function (data) {
                        if(data.length == 0)
                            data = null;
                        callback && callback(data);
                    },
                    error: function () {
                        console.log("请求失败");
                    }
                });
            },
            //获取编码所对应的值
            code: function(id, code) {
                code = code + "";
                var rest = _.findWhere(this.$bmCode[id], {code: code});
                if (rest && rest.text) return rest.text;
            },
            topHeight : function(){
                $(".indexBottom").css("left" , $(".mapTpl").width()/2);
                $(".indexBottom").css("top" , $(".mapTpl").height()-3);
            },
            //模版解析分解
            _templateFn: function(baseTpl) {
                var _self = this,
                    tplObj = {};
                this.$baseTpl = baseTpl || this.$baseTpl;
                if (this.$baseTpl) {
                    var tlps = $(this.$baseTpl);
                    tlps.each(function(index, item) {
                        var tpl = $(item).html();
                        var name = $(item).attr("id");
                        if (tpl && name) {
                            tplObj[name] = tpl;
                        }
                    })
                }
                tplObj && this._addTplMethod(tplObj);
            },
            //添加模版方法
            _addTplMethod: function(tplObj) {
                for(var key in tplObj) {
                    var funcName = this._fmtTplName(key);
                    funcName = funcName + "Template";
                    this[funcName] = _.template(tplObj[key]);
                    this.$tplNames.push(funcName);
                }
            },
            readJson:function(func){
                if(parent&&parent.lcdMapCode!=null){
                    func(parent.lcdMapCode)
                }else{
                    $.ajax({
                        type: "POST",
                        url: window.AppConfig.NRemoteApiUrl+'common/codelibrary/getCodeMapData',
                        async:false,
                        success:function(data){
                            try{
                                parent.lcdMapCode = data;
                            }catch(err){

                            }
                            if(func){
                                func(data)
                            }
                        },
                        error:function(){
                            layer.msg("获取编码失败")
                        }
                    })
                }
            },
            // 数据转码
            loadInfo:function(data){
                var that = this;
                var jsonFomat = Cache.getItem("bmCode") == 'undefined' ?  that.readJson(function(results){
                    that.jsonNumber=results;
                    Cache.setItem("bmCode", results);
                }) :  Cache.getItem("bmCode");
                jsonFomat =  Cache.getItem("bmCode") || that.jsonNumber;
                for(var i in data){
                    if(data[i]=="null"){
                        data[i]=" ";
                        continue;
                    }
                    try{

                        for(var j in jsonFomat[i]){
                            if(data[i]==jsonFomat[i][j].code){
                                data[i]=jsonFomat[i][j].text
                            }
                        }
                    }catch(err){

                    }
                }
                return data;

            },
            //下划线转驼峰式
            _fmtTplName: function(name) {
                name = name.replace(/\-(\w)/g, function(all, letter){
                    return letter.toUpperCase();
                });
                return name;
            },
            //事件装配和解析
            _eventFn: function() {

            },
            //参数配置中心
            config: function(options) {

            },
            //注册组件
            registerPlugin: function() {

            },
           
           

            //创建查询条件
            createQueryCondition:function(data){
                var sendDate = {
                    "rules":[],
                    "groups":[
                        {
                            "groups": [],
                            "rules":[

                            ],
                            "op": "and"
                        }
                    ],
                    "op":"and"
                }

                for(var i=0;i<data.length;i++){
                    if(data[i].value!=null&&data[i].value!=""){
                        var opt= {
                            "field": data[i].name,
                            "value": data[i].value,
                            "op": "equal"
                        }
                        sendDate.groups[0].rules.push(opt)
                    }

                }
                return sendDate;
            },
            //处理参数，转义
            processParameter:function (data) {
                return encodeURI(encodeURI(data));
            },
            // 导出exel
            evtExpertExcel: function() {
                this.expertExcelModel(this.$url, this.$lastParm);
            },
            expertExcelModel: function(url, options) {
                var param = "?";
                for (var key in options) {
                    if (options[key]) {
                        param += key + "=" + options[key] + "&";
                    }
                }
                location.href = window.AppConfig.RemoteApiUrl + url + param;
            },

            expertExcelModel_old: function (url, options, encode) {
                var that = this;
                var param = "rest/operatorStatistical/netOnline/export?";
                if (url) {
                    param = url + "?";
                }
                for (var key in options) {
                    if (options[key]) {
                        param += key + "=" + that.encodeUrl(options[key]) + "&";
                    }
                }
                location.href = window.AppConfig.RemoteApiUrl + param;
            },
            encodeUrl: function (key) {
                return encodeURIComponent(encodeURIComponent(key)); 
            },
            // 数字三个打个逗号
            toThousands:function(num){
                var num = (num || 0).toString();
                // result = '';  
                // while (num.length > 3) {  
                //     result = ',' + num.slice(-3) + result;  
                //     num = num.slice(0, num.length - 3);  
                // }  
                // if (num) { result = num + result; }  
                var result= num.split('').reverse().join('').replace(/(\d{3})\B/g,'$1,').split('').reverse().join('')
                return result;  
            },
            // 底部收缩功能
            footTabShow:function(){
                $(".mapFoot .downArrow img").on("click",function(){
                   var bottom= $(".mapFoot").css("bottom")   
                   bottom=="0px"?bottom="-252px": bottom="0px"
                    $(".mapFoot").animate({"bottom":bottom})
                   var imgSrc = $(this).data("src")
                   console.log(imgSrc)
                   imgSrc=="../../resource/image/common/downArrow.png"?imgSrc="../../resource/image/common/upArrow.png":imgSrc="../../resource/image/common/downArrow.png"
                   $(this).data("src",imgSrc)
                   $(this).prop("src",imgSrc)
                })
            }
         
           
          
         
          
          

          
        });
        return view;
    });