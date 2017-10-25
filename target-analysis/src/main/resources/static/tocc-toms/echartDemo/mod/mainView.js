/**
 * Created by mac-pc on 16/7/18.
 */
define([
       
        'tocc-toms/common/BaseView',
        "echarts",
        'libs/core/echart/3.7.1/macarons'
    ],
    function (BaseView,echarts) {
        layer.config({
            path: '../../libs/core/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        });
        var view = BaseView.extend({
            el: "body",
            events: {
              
            },
            init: function () {
                var that=this;
                // 统一请求参数
               that.echarts();
            },
            render: function (options) {
                options = options || {};
               
            },
            echarts:function () {

                var myChart = echarts.init(document.getElementById('main'),'macarons');
                var symbolSize = 20;
                var data = [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40]];
                option = {
                    title: {
                        text: 'Click to Add Points'
                    },
                    tooltip: {
                        formatter: function (params) {
                            var data = params.data || [0, 0];
                            return data[0].toFixed(2) + ', ' + data[1].toFixed(2);
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        min: -60,
                        max: 20,
                        type: 'value',
                        axisLine: {onZero: false}
                    },
                    yAxis: {
                        min: 0,
                        max: 40,
                        type: 'value',
                        axisLine: {onZero: false}
                    },
                    series: [
                        {
                            id: 'a',
                            type: 'line',
                            smooth: true,
                            symbolSize: symbolSize,
                            data: data
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
            

        });


        return view;
    });


