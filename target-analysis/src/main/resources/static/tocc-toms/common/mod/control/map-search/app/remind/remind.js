define(function(require, exports, module){
    var $ = require('jquery');
    require('bmap');
    var searchremind = {};
    /**获取featureService业务逻辑类*/
    searchremind.featureService = new beyond.data.SearchService();
    /**查询条件参数*/
    searchremind.queryParams={
        pageSize:10,
        pageNum:1,
        needGeometry:true
    };
    /**全文检索回调函数*/
    searchremind.showResult=function(result) {
        var html='<li class="{{remindClass}}" layername="{{layername}}">'+
            '<i class="iconfont">&#xf004c;</i>'+
        '<span class="remind-maintext">{{remindMainText}}</span>'+
        '</li>';
        var data = null;
        var obj = null;
        if (result.getReturnFlag() === '1') {
            $(".remind-ul-list").remove();
            data = result.getData();
            if (data != null && data.length > 0) {
                var arr = [];
                var isExist=new Array();
                for (var i = 0; i < data.length; i++) {
                    obj = data[i];
                    if(!isExist[obj.TYPE+"_"+obj.NAME]){
                        var node =html;
                        node = node.replace("{{remindClass}}","remind-ul-list");
                        node = node.replace("{{remindMainText}}", obj.NAME);
                        node = node.replace("{{layername}}",obj.TYPE);
                        $(".search-remind-ul").append(node);
                        isExist[obj.TYPE+"_"+obj.NAME]="1";
                    }
                }
                if( data&&data.length>0){
                    $(".search-remind").show();
                }
            }else{
                $(".search-remind").hide();
            }
        } else{
            $(".search-remind").hide();
        }
    };

    /**全文检索查询*/
    searchremind.fullSearch=function(){
        searchremind.queryParams.key=$(".search-panel-inp").val();
        searchremind.featureService.fullSearch(searchremind.showResult, searchremind.queryParams);
    };
    return {
        fullSearch:searchremind.fullSearch
    };
});