define([
    'jquery',
    'tocc-toms/common/BaseView',
    '../utils/searchUtils',
    'text!../../template/mapRoutesTemplate.html',
    '../utils/routesUtils',
    '../utils/stationUtils',
    '../utils/poisearch',
    'bmap',
    'map_utils',
    'log',
    'bmapui'
],function($,BaseView,SearchUtils,MapRoutesTemplate,
           RoutesUtil,StationUtil,PoiSearch,bmap,mapUtils,Log) {
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
         /*   that.$el=options.container;
            $(that.$el).append(that.mapRoutesLineTemplate());*/
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
                        PoiSearch.pageChange();
                    }
                });
                PoiSearch.simpleQuery();
            });
        },
        loadJs: function() {
            StationUtil.event();
        }
    });
    return view;
});