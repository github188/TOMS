// 生成echarts的参数
define([
    'tocc-toms/common/utils/echartsCss',
],function(){
    var echartCss = {};
    var symbolSize = 8;
   
    echartCss.getxAxis=function(name,data,isFirst){
        // isFirst: 是否贴边(与边上有距离没)
        var _isFirst = (isFirst!=undefined)?isFirst:false;
      
        var xAxis = {
            type : 'category', // category坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
            name:name,
            // boundaryGap : true, //是否贴边
            barGap:"12%",
            axisLine: {
                show: true , //x轴的线
                lineStyle:{
                    color:'#00ffff' //轴线颜色
                }
            },
            axisLabel: {
                show: true,
                interval: 0,
                textStyle: {
                    fontSize: 14,//x轴文字大小
                    color:'#00ffff' //x轴文字颜色
                }
            },
            splitLine:{
                show:false, //分隔线
                lineStyle:{
                    color:'#25303b' //分隔线颜色
                }
            },
            splitArea:{
                show:false //分隔区域
            },
            data : data
        }
        xAxis.boundaryGap=_isFirst;
        return  xAxis
    };
    echartCss.getyAxis=function(name,data){
        var yAxis = {
            type: 'value',
            name:name,
            minInterval:1,
            axisLine: {
                show: true , //y轴的线
                lineStyle:{
                    color:'#00ffff' //轴线颜色
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    fontSize: 14,//y轴文字大小
                    color:'#00ffff' //y轴文字颜色
                }
            },
            splitLine:{
                show:false, //分隔线
                lineStyle:{
                    color:'#25303b' //分隔线颜色
                }
            },
            splitArea:{
                show:false //分隔区域
            },
            data:data
        }
        return  yAxis
    }
    echartCss.getseries=function(name,type,data,index){
        // name:数据名称，type:图形样式 ， data:数据，index，对应哪个y轴
       
        var series = {
            yAxisIndex: index,
            name:name,
            type: type,
            smooth: true, //平滑曲线显示，smooth为true时lineStyle不支持虚线
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default' //区域填充样式，目前仅支持'default'(实填充)
                    }
                },
                
            },
            symbolSize: symbolSize,//折线点大小
            symbol:'heart',
            barWidth:12,
            barBorderRadius: 25,
            barCategoryGap:'2%',
            data: data,
           
        }
        
        return  series
    }
    // 饼图数据生成
     echartCss.getseriesPie=function(name,data){
        var series = {
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
            
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
        for(var i = 0 ;i<name.length;i++){
            series.data.push(
                {value:data[i], name:name[i]+" "+data[i]+"%"}
            )
        }
    
        return  series
    }
    // 颜色随机
    echartCss.getEchartColor = function(index){
        var EchartColor = [
            [
                 "#9f19ec","#f8e40b","#09A32E","#C52F9A","#0A8A58"
            ],[
                "#09A32E","#9f19ec","#f8e40b","#0A8A58", "#C52F9A",
            ],[
                 "#f8e40b","#0A8A58","#9f19ec","#09A32E",
            ],[
                "#0A8A58","#9f19ec","#09A32E","#f8e40b","#C52F9A"
            ],[
               
                 "#0A8A58","#C52F9A","#9f19ec","#09A32E","#f8e40b"
            ]
        ] 
        return EchartColor[index]
    }
    return echartCss;
})