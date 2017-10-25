/**
 * Created by mac-pc on 16/7/18.
 */
define([
    'jquery',
    'tocc-toms/common/BaseView',
    'bmap',
    'map_utils',
    'log'
],function($, BaseView, bmap,mapUtils,Log) {
        var view = BaseView.extend({
            el: ".frame-busmap",
            events: {
            },
            init: function() {

            },
            render: function(options) {
                options = options || {};
                this.loadJs();
                this.initUI();//初始化ui
            },
            initUI: function() {
                //dom加载完毕
            },
            addPanel: function(options) {

            }

        });
        return view;
    });