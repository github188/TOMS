/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        'map_utils',
        'tocc-toms/roadNetworkHighway/mod/specialLayerTool',
        "echarts",
        "tocc-toms/common/utils/mapToolBox/mapToolBox",
        'libs/core/echart/3.7.1/macarons'

    ],
    function (BaseView,mapUtils,specialLayerTool,echarts,mapToolBox) {
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                that.footTabShow();
                this.$map = {};
                this.mapUtils = mapUtils;
                that.echarts()
            },
            render: function (options) {
                options = options || {};
                this.loadJs();
            },
            // 加载地图
            loadJs: function () {
                var that = this;
                that.$map = mapUtils.initMap("mapContainer", function () {
                    // 工具栏逻辑
                    mapToolBox.addMapToolEvent(that);
                    //工具栏 事件
                    specialLayerTool.addEvent(that,true,echarts);
                });

            },
            echarts:function () {

            },
            // 生成echarts
            getEchart:function(ele,option){
                var selectDom = document.querySelectorAll(ele)
                for(var i = 0;i<selectDom.length;i++){
                    var myChart = echarts.init(selectDom[i],'macarons');

                    myChart.setOption(option)
                }

            }

        });


        return view;
    });


