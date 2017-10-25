
define(['tocc-toms/common/mod/control/map-search/app/utils/searchUtils',
    'cookie',
    'bmapui',
],function(SearchUtils,Cookie,require,exports, module){
    var ctx=window.AppConfig.RemoteApiUrl;
    var searchres = {};
    /**声明cookie对象*/
    searchres.cookie=Cookie;
    /**声明历史查询记录cookie中对象名称*/
    searchres.historySearch="searchres.historySearch";
    /**声明保存历史记录数量*/
    searchres.historyNumber=10;
    /**声明查询结果点击事件*/
    searchres.event=function(){
        /**公交站图标点击事件*/
        $(".enters-ico-1").click(function(){
            var tab = {
                title: "公交站",
                content: ctx+"/control/map-search/page/station/station.html?layerName=SP_GJZD&key=",
                contentType:"iframe",
                data:{
                    name:"SP_GJZD"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**公交路线图标点击事件*/
        $(".enters-ico-2").click(function(){
            var tab = {
                title: "公交路线",
                content: ctx+"/control/map-search/page/routes/routes.html?layername=SL_GJLX&key=",
                contentType:"iframe",
                data:{
                    name:"SL_GJLX"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**自行车停靠点图标点击事件*/
        $(".enters-ico-3").click(function(){
            var tab = {
                title: "自行车停靠点",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_ZXCTKD&key=",
                contentType:"iframe",
                data:{
                    name:"SP_ZXCTKD"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**客运场站图标点击事件*/
        $(".kyz-enters-ico-4").click(function(){
            var tab = {
                title: "客运场站",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_KYZ&key=",
                contentType:"iframe",
                data:{
                    name:"SP_KYZ"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**货运场站图标点击事件*/
        $(".hyz-enters-ico-11").click(function(){
            var tab = {
                title: "货运场站",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_HYZ&key=",
                contentType:"iframe",
                data:{
                    name:"SP_HYZ"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**维修企业图标点击事件*/
        $(".enters-ico-10").click(function(){
            var tab = {
                title: "维修企业",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_WXQY&key=",
                contentType:"iframe",
                data:{
                    name:"SP_WXQY"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**货运企业图标点击事件*/
        $(".hyqy-enters-ico-11").click(function(){
            var tab = {
                title: "货运企业",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_HYQY&key=",
                contentType:"iframe",
                data:{
                    name:"SP_HYQY"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**客运企业图标点击事件*/
        $(".kyqy-enters-ico-4").click(function(){
            var tab = {
                title: "客运企业",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_KYQY&key=",
                contentType:"iframe",
                data:{
                    name:"SP_KYQY"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**驾培企业图标点击事件*/
        $(".enters-ico-9").click(function(){
            var tab = {
                title: "驾培企业",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_JPQY&key=",
                contentType:"iframe",
                data:{
                    name:"SP_JPQY"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /*/!**危货停车场图标点击事件*!/
        $(".enters-ico-5").click(function(){
            var tab = {
                title: "危货停车场",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_WHTCC&key=",
                contentType:"iframe",
                data:{
                    name:"SP_WHTCC"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });*/
       /* /!**停车场图标点击事件*!/
        $(".enters-ico-5").click(function(){
            var tab = {
                title: "停车场",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_TCC&key=",
                contentType:"iframe",
                data:{
                    name:"SP_TCC"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });*/
        /**加油站图标点击事件*/
        $(".enters-ico-6").click(function(){
            var tab = {
                title: "加油站",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_JYZ&key=",
                contentType:"iframe",
                data:{
                    name:"SP_JYZ"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**服务区图标点击事件*/
        $(".enters-ico-7").click(function(){
            /*  var encodedKey = encodeURIComponent(encodeURIComponent("太湖服务区"));*/
            //title相同只会出现一个
            var tab = {
                title: "服务区",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_FWQ&key=",
                contentType:"iframe",
                data:{
                    name:"SP_FWQ"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
        /**收费站图标点击事件*/
        $(".enters-ico-8").click(function(){
            //title相同只会出现一个
            var tab = {
                title: "收费站",
                content: ctx+"/control/map-search/page/poi/poiSearch.html?layername=SP_SFZ&key=",
                contentType:"iframe",
                data:{
                    name:"SP_SFZ"
                }
            };
            $(".search-rec").hide();
            $(".search-result").show();
            $(".search-remind").hide();
            SearchUtils.addTab(tab);
        });
    };

    var historyTemplate='<li class="history-items" layername="{{layername}}">'+
        '<img src="../../../control/map-search/resource/images/history-ico.png" alt="" class="history-items-ico" />'+
        '<span class="history-maintext">{{historyValue}}</span>'+
        '<span class="history-items-remind">{{historyArea}}</span>'+
        '</li>';
    /**
     * 根据数获取历史记录节点并添加至指定节点
     * @param data
     * @return html
     */
    searchres.fillNodeTemplate=function(data){
        if(data&&data.length>0){
            var l=data.length-1;
            if(l>10){
                l=10;
            }
            $(".rec-history").html("");
            for(var i=l;i>-1;i--){
                var node=historyTemplate;
                //var node=$("#history-res-children-node-template").html();
                node = node.replace("{{historyValue}}",data[i].value)
                    .replace("{{historyArea}}",'')
                    .replace("{{layername}}",data[i].layername);
                $(".rec-history").append(node);
            }
        }
    };
    /**
     * 清空cookie数据
     */
    searchres.clearCookie=function(){
        searchres.cookie.remove(searchres.historySearch);
    };
    /**
     *删除数组指定下标或指定对象
     */
    Array.prototype.remove=function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    }
    /**
     * 根据arry转换为id存入数据库
     * @param obj
     */
    searchres.setCookie=function(obj){
        var array=searchres.getCookieKey();
        if(array&&array.length>0){
            if(obj.value&&obj.layername){
                var flag=false;
                var removeItem;
                for(var i=0;i<array.length;i++){
                    if(obj.value === array[i].value && obj.layername === array[i].layername ){
                        /**依次往前移动一级*/
                        array.remove(array[i]);
                        break;
                    }
                }
                if(array.length === searchres.historyNumber){
                    array.remove(array[0]);
                }
                array.push(obj);
                searchres.cookie.set(searchres.historySearch,JSON.stringify(array));
            }
        }else{
            if(obj.value){
                array=new Array();
                array.push(obj);
                searchres.cookie.set(searchres.historySearch,JSON.stringify(array));
            }
        }

    };
    /**
     *根据传入用户唯一标示组装cookie key为唯一标示并返回key
     * @param userId
     * @return key
     */
    searchres.getCookieKey=function(){
        var json=searchres.cookie.get(searchres.historySearch);
        if(json){
            return eval(json);
        }
        return null;
    };

    /**
     * 根据传入参数value从Cookie中获取历史查询记录
     * @param key
     * @return json value
     */
    searchres.getHistorySearch=function(key){
        if(!key){
            key = searchres.getCookieKey();
        }
        return searchres.cookie.get(key);
    };

    //searchres.fillNodeTemplate(searchres.getCookieKey());

    return searchres;


});







