window.AppConfig = {
   
    VERSION: 1.0,
    // ormClientServer: false,
    RemoteApiUrl: '', //服务器地址
    title: '嘉兴市综合监管平台-电子围栏',
    mapUrl: "http://172.16.100.254:83/gisapi/rest/api/js/5.1/BF833A1145CB44669FB387DEA62AC464",//地图地址
    //  mapUrl: "http://172.19.128.166/gisapi/rest/api/js/5.1/BF833A1145CB44669FB387DEA62AC464",
    // lbsUrl: "http://172.16.100.253:28181/lbs-usb/",//如果lbs服务是本地独立的，那需要单独配置，否则用地图平台js里默认指定的lbs服务地址
    lbsUrl: "http://172.19.128.166:28080/lbs-usb/",//如果lbs服务是本地独立的，那需要单独配置，否则用地图平台js里默认指定的lbs服务地址
    mapCenter: {x: 120.750865, y: 30.762653},//地图中心点
    mapZoom: 8, //地图缩放
    configName:'',
    scode: 330621, //市级编码
    xcode: 330621, //县级编码
    pcode: null, //省级编码
    userInfo:null,
    bmapCode:null, //存储码表
    holidayCode:{
        // 春节
        dateType:"0101",past:"15",feture:"25",format:true,holiday:"春节"
        // 国庆节
        // date:1001,past:2,feture:2,format:false,holiday:"国庆节"
    }
};

var url = document.URL;
var temp1 = url.indexOf("/", 9);
var temp2 = url.indexOf("/", temp1 + 1);
var gisRootPath = url.substr(0, temp2 + 1);

window.AppConfig.NRemoteApiUrl = gisRootPath;
window.AppConfig.RemoteApiUrl = gisRootPath;

var config = {
    paths: {
        jquery: 'libs/core/jquery/jquery',
        // 模拟数据
        mock:"libs/core/mockJs/mock",
        underscore: 'libs/core/underscore/underscore',
        mscrollbar: 'libs/core/mCustomerScroll/jquery.mCustomScrollbar',
        jqueryui: 'libs/core/jqueryui/jquery-ui',
        uibase: 'libs/bmap/ui/base/base',
        bmapui: 'libs/bmap/ui/control/bmapUI',
        backbone: 'libs/core/backbone/backbone',
        bmap: window.AppConfig.mapUrl,
        map_utils: 'tocc-toms/common/mod/map/map',
        dateutils: 'libs/bmap/utils/date_utils',
        layer: 'libs/core/layer/layer',
        swiper:"libs/core/swiper/js/swiper.jquery",
        echarts:"libs/core/echart/3.7.1/echarts",
        // echarts主题
        macarons:"libs/core/echart/3.7.1/macarons",
        cache: 'libs/bmap/utils/cache',
        Ecalendar:"libs/core/Ecalendar/Ecalendar",
        cookie:"libs/core/cookie/1.0.2/cookie-debug"
    },
    map: {
        // 引入读取css插件
        '*': {
            'css': 'libs/core/requirejs/require-css/css.min'
        }
    },
    shim: {
      'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        /*'echarts': {
            deps: ['libs/core/echart/3.7.1/macarons']
        },*/
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
         'map_utils': {
            deps: ['jquery', 'bmap']
        },
        'layer': {
            deps: ['jquery']
        },
       
        'swiper':{
            deps: ['jquery',"css!libs/core/swiper/css/swiper.css"]
        },
        "Ecalendar":{
             deps: ['jquery',"css!libs/core/Ecalendar/Ecalendar.css"]
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'uibase': {
            deps: ['jqueryui', 'mscrollbar']
        },
        'bmapui': {
            deps: ['uibase', 'css!libs/bmap/ui/wyui.2.0.css', 'css!resource/icon/material/css/material.min.css']
        },
    }
};


require.config(config);
require.onError = function (err) {
    console.log('RequireJS loading error!: ', err.requireModules, err.message);
    console.log('RequireJS loading error!: ', err.requireModules, "\n\tsrc= ", err.originalError ? err.originalError.target.src : undefined, "\n\terr=", err);
}


define(['jquery', 'backbone', 'underscore'],
    function () {
        window.ByEvent.fireEvent("mainjsLoaded");
    }
);