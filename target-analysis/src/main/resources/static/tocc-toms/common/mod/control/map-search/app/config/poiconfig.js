

/**
 * Created by Administrator on 2015/11/24.
 */


define([],function(){
//以图层名称做为键值获取相关配置
//config：图层相关配置layerName：对应后台的图层名   label 显示图层名称
//title：查询显示的标题
//list:查询显示的列表
//data：英文字段和中文字段的映射关系，显示详情的时候使用此配置
//filter：查询前添加的过滤条件
var poiConfig = {
    "SP_GJZD":{
        "config":{"layerName": "SP_GJZD", "label": "公交站", "icon": "", "locateIcon":"/control/map-search/resource/images/GJZ_1.png","offsetX":0,"offsetY":17,"class":""},
        "list": "GJZDBM",
        "data": {
            "GJZDBM": {"label": "公交站点编码"}
        }
    },
    "SP_SD":{
        "config":{"layerName": "SP_SD", "label": "隧道", "icon": "", "locateIcon":"/map/roadnetwork/resource/imgs/sd.png","offsetX":0,"offsetY":17,"class":""},
        "list": "X,Y,ZH,SSC,MC,QDZH,ZDZH,LXMC",
        "data": {
            "QDZH": {"label": "起点桩号"},
            "ZDZH": {"label": "终点桩号"},
            "ZH": {"label": "桩号"},
            "LXMC": {"label": "路线名称"},
            "SSC": {"label": "所属处"},
            "MC": {"label": "隧道名称"}
        }
    },
    "SP_ZCZ":{
        "config":{"layerName": "SP_ZCZ", "label": "治超站", "icon": "", "locateIcon":"/map/roadnetwork/resource/imgs/zcz.png","offsetX":0,"offsetY":17,"class":""},
        "list": "X,Y,ZH,SSC,JKFX,MC,LXMC",
        "data": {
            "ZH":{"label":"桩号"},
            "LXMC":{"label":"路线名称"},
            "MC": {"label": "治超站名称"},
            "SSC": {"label": "所属处"},
            "JKFX": {"label": "监控方向"}
        }
    },
    "SL_GJLX":{
        "config":{"layerName": "SL_GJLX", "label": "公交路线", "icon": "", "locateIcon":"/control/map-search/resource/images/GJZ_1.png","offsetX":0,"offsetY":17,"class":""}
    },
    "SP_FWQ": {
        "config": {"layerName": "SP_FWQ", "label": "服务区", "icon": "", "locateIcon":"/control/map-search/resource/images/FWQ.png","offsetX":0,"offsetY":17,"class":"jt-uniE614"},
        "title": "MC",
        "list": "X,Y,DZ,MC,GID",
        "data": {
            "MC": {"label": "服务区名称"},
            "DZ": {"label": "地址"},
            "MCYY": {"label": "服务区名称英语"},
            "DZYY": {"label": "地址英语"},
            "DH": {"label": "电话"} ,
            "SCODE": {"label": "市级行政区划编号"} ,
            "XCODE": {"label": "县级行政区划编号"}
        },
        "filter": "QLLX=1"
    },
    "SP_JYZ": {
        "config": {"layerName": "SP_JYZ", "label": "加油站", "icon": "", "locateIcon": "/control/map-search/resource/images/JYZ.png","offsetX":0,"offsetY":17,"class":"jt-uniE60F"},
        "title": "MC",
        "list": "X,Y,MC,DZ,GID",
        "data": {
            "MC": {"label": "加油站名称"},
            "DZ": {"label": "地址"},
            "MCYY": {"label": "加油站名称英语"},
            "DZYY": {"label": "地址英语"},
            "DH": {"label": "电话"},
            "YZBM": {"label": "邮政编码"}
        },
        "filter": ""
    },
    "SP_KYZ": {
        "config": {"layerName": "SP_KYZ", "label": "客运场站", "icon": "", "locateIcon": "/control/map-search/resource/images/KYCZ.png","offsetX":0,"offsetY":17,"class":"jt-uniE610"},
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,JYFZR,DZ,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_HYZ": {
        "config": {
            "layerName": "SP_HYZ",
            "label": "货运场站",
            "icon": "",
            "locateIcon": "control/map-search/resource/images/driving_transport.png",
            "offsetX": 0,
            "offsetY": 0,
            "class": ""
        },
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,DZ,JYFZR,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_SFZ": {
        "config": {"layerName": "SP_SFZ", "label": "收费站", "icon": "", "locateIcon": "/control/map-search/resource/images/SFZ.png","offsetX":0,"offsetY":17,"class":"jt-uniE615"},
        "title": "MC",
        "list": "X,Y,MC,DZ,GID",
        "data": {
            "MC": {"label": "收费站名称"},
            "DZ": {"label": "地址"},
            "MCYY": {"label": "收费站名称英语"},
            "DZYY": {"label": "地址英语"},
            "DH": {"label": "电话"},
            "YZBM": {"label": "邮政编码"}
        },

        "filter": ""
    },
    "SP_TCC": {
        "config": {"layerName": "SP_TCC", "label": "停车场", "icon": "", "locateIcon": "/control/map-search/resource/images/TCC.png","offsetX":0,"offsetY":17,"class":"jt-uniE609"},
        "title": "MC",
        "list": "X,Y,MC,DZ,GID",
        "data": {
            "MC": {"label": "停车场名称"},
            "DZ": {"label": "地址"},
            "MCYY": {"label": "停车场名称英语"},
            "DZYY": {"label": "地址英语"},
            "DH": {"label": "电话"},
            "YZBM": {"label": "邮政编码"}
        },
        "filter": ""
    },
    "SP_ZXCTKD": {
        "config": {"layerName": "S_SP_ZXCTKD", "label": "自行车停靠点站", "icon": "", "locateIcon": "tocc-toms/common/res/ZXCTKD.png","offsetX":0,"offsetY":17,"class":"jt-uniE629"},
        "title": "MC",
        "list": "X,Y,ID,MC,DZ,GID",
        "data": {
            "x": {"label": "经度"},
            "y": {"label": "纬度"},
            "capacity": {"label": "总车辆数"},
            "availbike": {"label": "可借车辆数"},
            "unavailbike": {"label": "可还车辆数"},
            "availbikeRate": {"label": "可借车辆率"},
            "unavailbikeRate": {"label": "可还车辆率"},
            "address": {"label": "所在地址"},
            "createtime": {"label": "更新时间"},
            "distance":{"label": "公交站距离(米)"}
        }
    },
    "SP_ZXCTKD": {
        "config": {"layerName": "S_SP_ZXCTKD", "label": "自行车站点数据", "icon": "", "locateIcon": "tocc-toms/common/res/ZXCTKD.png","offsetX":0,"offsetY":17,"class":"jt-uniE629"},
        "title": "MC",

        "list": "MC,DZ,KHSL,SL,KJSL,DH,QYMC,FWSJ,UPDATE_TIM,X,Y,GID",
        "data": {
            "DH": {"label": "电话"},
            "DZ": {"label": "地址"},
            "SL": {"label": "车位数量"},
            "KHSL": {"label": "可还数量"},
            "KJSL": {"label": "可借数量"},
            "QYMC": {"label": "企业名称"},
            "FWSJ": {"label": "服务时间"},
            "UPDATE_TIM": {"label": "更新时间"},
            "X": {"label": "经度"},
            "Y": {"label": "纬度"}
        },
        "sortObject":['X','Y','DZ','DH','SL','KJSL','KHSL','QYMC','FWSJ','UPDATE_TIM'],
    },
    "SP_ZXCKJKH": {
        "config": {"layerName": "SP_ZXCKJKH", "label": "自行车可借可还停车点", "icon": "", "locateIcon": "","offsetX":0,"offsetY":17,"class":""},
        "title": "name",
        "list": "x,y,capacity,availbike,unavailbike,availbikeRate,unavailbikeRate,address,distance,createtime",
        "data": {
            "x": {"label": "经度"},
            "y": {"label": "纬度"},
            "capacity": {"label": "总车辆数"},
            "availbike": {"label": "可借车辆数"},
            "unavailbike": {"label": "可还车辆数"},
            "availbikeRate": {"label": "可借车辆率"},
            "unavailbikeRate": {"label": "可还车辆率"},

            "createtime": {"label": "更新时间"},
            "address": {"label": "所在地址"},
            "distance":{"label": "公交站距离(米)"}
        },
        "filter": ""
    },
    "SP_GJZD": {
        "config": {"layerName": "SP_GJZD", "label": "公交站", "icon": "", "locateIcon": "/control/map-search/resource/images/GJZ_1.png","offsetX":0,"offsetY":17,"class":"jt-uniE629"},
        "title": "MC",
        "list": "X,Y,ID,MC,BM,SCODE,XCODE,PCODE",
        "data": {
            "MC": {"label": "名称"},
            "X": {"label": "经度"},
            "Y": {"label": "纬度"}
        },
        "filter": ""
    },
    //企业配置
    "SP_JPQY": {
        "config": {
            "layerName": "SP_JPQY",
            "label": "驾培企业",
            "icon": "",
            "locateIcon": "/control/map-search/resource/images/driving.png",
            "offsetX": 0,
            "offsetY": 0,
            "class": ""
        },
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,DZ,JYFZR,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_WXQY": {
        "config": {
            "layerName": "SP_WXQY",
            "label": "维修企业",
            "icon": "",
            "locateIcon": "/control/map-search/resource/images/maintenance.png",
            "offsetX": 0,
            "offsetY": 0,
            "class": ""
        },
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,DZ,JYFZR,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_HYQY": {
        "config": {
            "layerName": "SP_HYQY",
            "label": "货运企业",
            "icon": "",
            "locateIcon": "/control/map-search/resource/images/driving_transport.png",
            "offsetX": 0,
            "offsetY": 0,
            "class": ""
        },
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,DZ,JYFZR,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_KYQY": {
        "config": {
            "layerName": "SP_KYQY",
            "label": "客运企业",
            "icon": "",
            "locateIcon": "/control/map-search/resource/images/KYCZ.png",
            "offsetX": 0,
            "offsetY": 0,
            "class": ""
        },
        "title": "MC",
        "list": "MC,JYXKZH,QXJXZQH,JYFW,DZ,JYFZR,DH,JYZT,YXQQ,YXQZ,GID",
        "data": {
            "MC": {"label": "名称", "type": "string"},
            "JYXKZH": {"label": "经营许可证号", "type": "string"},
            "QXJXZQH": {"label": "行政区划", "type": "string"},
            "JYFW": {"label": "经营范围", "type": "string"},
            "JYFZR": {"label": "负责人", "type": "string"},
            "DZ": {"label": "地址", "type": "string"},
            "DH": {"label": "负责人电话", "type": "string"},
            "JYZT": {"label": "经营状态", "type": "string"},
            "YXQQ": {"label": "有效期起", "type": "date"},
            "YXQZ": {"label": "有效期止", "type": "date"}
        },
        "sortObject":['MC','JYXKZH','QXJXZQH','JYFW','JYFZR','DZ','DH','JYZT','YXQQ','YXQZ'],
        "filter": ""
    },
    "SP_GJZD": {
        "config": {"layerName": "SP_GJZD", "label": "公交站", "icon": "", "locateIcon": "/control/map-search/resource/images/GJZ_1.png","offsetX":0,"offsetY":17,"class":"jt-uniE629"},
        "title": "MC",
        "list": "X,Y,ID,MC,BM,SCODE,XCODE,PCODE",
          "data": {
            "MC": {"label": "名称"},
            "X": {"label": "经度"},
            "Y": {"label": "纬度"}
        },
        "filter": ""
    },
    "SP_WX": {
        "config": {"layerName": "SP_WX", "label": "维修点", "icon": "", "locateIcon": "/control/map-search/resource/images/maintenance.png","offsetX":0,"offsetY":17,"class":"jt-uniE609"},
        "title": "NAME",
        "list": "DISPLAY_X,DISPLAY_Y,NAME,PY,DBCADDRESS,GID",
        "data": {
            "NAME": {"label": "维修点名称"},
            "PY": {"label": "维修点英文名称"},
            "DBCADDRESS": {"label": "维修点地址"},
            "DISPLAY_X": {"label": "经度"},
            "DISPLAY_Y": {"label": "纬度"}
        },
        "filter": ""
    },
    "SP_PH": {
        "config": {"layerName": "SP_PH", "label": "普货", "icon": "", "locateIcon": "/control/map-search/resource/images/General_cargo.png","offsetX":0,"offsetY":17,"class":"jt-uniE609"},
        "title": "MC",
        "list": "X,Y,MC,SSC,GID",
        "data": {
            "MC": {"label": "货物名称"},
            "SSC": {"label": "货物位置"},
            "X": {"label": "经度"},
            "Y": {"label": "纬度"}
        },
        "filter": ""
    },
    "SP_JX": {
        "config": {"layerName": "SP_JX", "label": "驾培学校", "icon": "", "locateIcon": "/control/map-search/resource/images/driving.png","offsetX":0,"offsetY":17,"class":"jt-uniE609"},
        "title": "MC",
        "list": "MC,WZ,DZYX,DZ,LXDH,GZSJ,GID",
        "data": {
            "MC": {"label": "名称"},
            "DZ": {"label": "地址"},
            "LXDH": {"label": "联系电话"},
            "GZSJ": {"label": "经营时间"},
            "WZ": {"label": "网址"},
            "DZYX": {"label": "邮箱"}
        },
        "filter": ""
    },
    "SP_WHTCC": {
        "config": {"layerName": "SP_WHTCC", "label": "危货停车场", "icon": "", "locateIcon": "/control/map-search/resource/images/driving_transport.png","offsetX":0,"offsetY":17,"class":"jt-uniE609"},
        "title": "MC",
        "list": "X,Y,MC,DZ,GID",
        "data": {
            "MC": {"label": "危货停车场名称"},
            "DZ": {"label": "危货停车场地址"},
            "X": {"label": "经度"},
            "Y": {"label": "纬度"}
        },
        "filter": ""
    }
};

var poiConfigUtil = {
    getLayerLocateSymbol: function (layerName) {
        if (!layerName) {
            return;
        }
        if(!poiConfig[layerName]){
            return;
        }
        var config = poiConfig[layerName].config;
        if (config) {
            var options = {
                icon: window.AppConfig.RemoteApiUrl  + config.locateIcon,//图标
                //width: 20,//宽度
                //height: 34,//高度
                offsetX: config.offsetX,
                offsetY: config.offsetY
            };
            return options;

        } else {
            alert("图层定位信息未配置，请先配置，图层名为：" + layername);
        }
        return null;
    },
    getLayerDetailFields: function (layerName) {
        if (!layerName) {
            return;
        }
        var config = poiConfig[layerName].data;
        if (config) {
            var datail = ""
            for (var key in config) {
                datail += key + ","
            }
            return datail;
        } else {
            alert("图层定位信息未配置，请先配置，图层名为：" + layername);
        }
        return null;
    },
    getLayerConfig: function (layerName) {
        if (!layerName) {
            return;
        }
        var config = poiConfig[layerName];
        if (config) {
            return config;
        } else {
            alert("图层定位信息未配置，请先配置，图层名为：" + layername);
        }
        return null;
    },
    //获取显示字段的最大长度
    getShowLabelWidth:function(layerName){
        var config = this.getLayerConfig(layerName).data;
        var  max = 0;
        var temp;
        if (config) {
            for (var key in config) {
                if(!config[key]||!config[key].label){
                    continue;
                }else{
                    temp = config[key].label.length;
                    if(max<temp){
                        max = temp;
                    }
                }
            }
            return max*14;
        } else {
            alert("图层定位信息未配置，请先配置，图层名为：" + layername);
        }
    }
}
    return {
        poiConfig:poiConfig,
        poiConfigUtil:poiConfigUtil
    };

});