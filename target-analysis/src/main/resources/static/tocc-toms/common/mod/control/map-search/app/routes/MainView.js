define([
    'jquery',
    'tocc-toms/common/BaseView',
    '../utils/searchUtils',
    'text!../../template/mapRoutesTemplate.html',
    'text!../../template/mapCarTemplate.html',
    'text!../../template/mapStationTemplate.html',
    '../utils/routesUtils',
    '../utils/stationUtils',
    '../utils/textsearch',
    'control/map-search/app/utils/mapSearchUtils',
    'map_utils',
    'log',
    'bmapui'
],function($,BaseView,SearchUtils,MapRoutesTemplate,MapCarTemplate,MapStationTemplate,
           RoutesUtil,StationUtil,TextSearch,MapSearchUtils,mapUtils,Log) {
    var that;
    var view = BaseView.extend({
        events: {

        },
        init: function() {
            that=this;
            that.$el=null;
            that._templateFn(MapRoutesTemplate);
            that._templateFn(MapCarTemplate);
            that._templateFn(MapStationTemplate);
        },
        render: function(options) {
            that=this;
            that.init();
            that.initUI();
            that.$map=parent.window.map;
            that.loadJs();
        },
        initUI: function() {
            //dom加载完毕调用
            $(function(){
                $(".ui-scroll").mCustomScrollbar({
                    theme:"dark"
                });
                $("#pageInfo").wyPaginator({
                    controlTemplate: "{FirstPage}{PreviousPage}{PageLinks}{NextPage}{LastPage}",
                    pageSize: 10,
                    nowPage: 1,
                    pageLinksNum:3,
                    pageChange: function (event, data) {
                        RoutesUtil.page(data);
                    }
                });
                RoutesUtil.listBusRotesAndStation(that);
            });
        },
        loadJs: function() {

        }
    });
    return view;
});