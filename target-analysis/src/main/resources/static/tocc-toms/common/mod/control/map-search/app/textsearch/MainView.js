define([
    'jquery',
    'tocc-toms/common/BaseView',
    '../utils/searchUtils',
    'text!../../template/mapRoutesTemplate.html',
    '../utils/routesUtils',
    '../utils/stationUtils',
    '../utils/poisearch',
    '../utils/textsearch',
    'bmap',
    'map_utils',
    'log',
    'bmapui'
],function($,BaseView,SearchUtils,MapRoutesTemplate,
           RoutesUtil,StationUtil,PoiSearch,TextSearch,bmap,mapUtils,Log) {
    var that;
    var view = BaseView.extend({
        events: {

        },
        init: function() {
            that=this;
            that.$el=null;
            that._templateFn(MapRoutesTemplate);
        },
        render: function(options) {
            that=this;
            that.init();
            that.initUI();
            that.loadJs();
        },
        initUI: function() {
            //dom加载完毕调用
            $(function(){
                $("#queryPanel").mCustomScrollbar({
                    theme: "dark"
                });
                $("#pageInfo").wyPaginator({
                    controlTemplate: "{FirstPage}{PreviousPage}{PageLinks}{NextPage}{LastPage}",
                    pageSize: 10,
                    nowPage: 1,
                    pageLinksNum:3,
                    pageChange: function (event, data) {
                        TextSearch.pageChange();
                    }
                });
                TextSearch.simpleQuery();
            });
        },
        loadJs: function() {
            StationUtil.event();
        }
    });
    return view;
});