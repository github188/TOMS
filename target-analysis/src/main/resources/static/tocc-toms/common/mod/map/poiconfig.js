/**
 * Created by Administrator on 2015/11/24.
 */
define([], function () {
//以图层名称做为键值获取相关配置
//config：图层相关配置layerName：对应后台的图层名   label 显示图层名称
//title：查询显示的标题
//list:查询显示的列表
//data：英文字段和中文字段的映射关系，显示详情的时候使用此配置
//filter：查询前添加的过滤条件
    var poiConfig = {
        "SP_GJZD": {
            "config": {
                "layerName": "SP_GJZD",
                "label": "公交站",
                "icon": "",
                "locateIcon": "/control/map-search/resource/images/GJZ_1.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "list": "GJZDBM",
            "data": {
                "GJZDBM": {"label": "公交站点编码"}
            }
        },
        "SP_SD": {
            "config": {
                "layerName": "SP_SD",
                "label": "隧道",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/SD.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "list": "QDZH,ZDZH,ZH,LXMC,SSC,MC,X,Y",
            "data": {
                "QDZH": {"label": "起点桩号"},
                "ZDZH": {"label": "终点桩号"},
                "ZH": {"label": "桩号"},
                "LXMC": {"label": "路线名称"},
                "SSC": {"label": "所属处"},
                "MC": {"label": "隧道名称"}
            }
        },
    "SP_QBB": {
            "config": {
                "layerName": "SP_QBB",
                "label": "情报板",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/QBB.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "list": "GID,ID,SBMC,X,Y",
            "data": {
                "ID": {"label": "编码"},
                "SBMC": {"label": "名称"},
                "X": {"label": "经度"},
                "Y": {"label": "纬度"}
            }
        },
        "SP_HZL": {
            "config": {
                "layerName": "SP_HZL",
                "label": "航站楼",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/HZL.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "list": "GID,MC,IDJYQQ,JYFW,JYZT,X,Y",
            "data": {
                "MC": {"label": "名称"},
                "X": {"label": "经度"},
                "Y": {"label": "纬度"},
                "JYZT": {"label": "经营状态"}
            }
        },
        "SP_ZCZ": {
            "config": {
                "layerName": "SP_ZCZ",
                "label": "治超站",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/ZCZ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "list": "ZH,LXMC,MC,SSC,JKFX,X,Y",
            "data": {
                "ZH": {"label": "桩号"},
                "LXMC": {"label": "路线名称"},
                "MC": {"label": "治超站名称"},
                "SSC": {"label": "所属处"},
                "JKFX": {"label": "监控方向"}
            }
        },
        "SL_GJLX": {
            "config": {
                "layerName": "SL_GJLX",
                "label": "公交路线",
                "icon": "",
                "locateIcon": "/control/map-search/resource/images/GJZ_1.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            }
        },
        "SP_FWQ": {
            "config": {
                "layerName": "SP_FWQ",
                "label": "服务区",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/FWQ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE614"
            },
            "title": "MC",
            "list": "MC,DZ,X,Y,GID",
            "data": {
                "MC": {"label": "服务区名称"},
                "DZ": {"label": "地址"}
            },
            "filter": "QLLX=1"
        },
        "SP_JYZ": {
            "config": {
                "layerName": "SP_JYZ",
                "label": "加油站",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/JYZ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE60F"
            },
            "title": "MC",
            "list": "MC,DZ,X,Y,GID",
            "data": {
                "MC": {"label": "加油站名称"},
                "DZ": {"label": "地址"}
            },
            "filter": ""
        },
        "SP_KYZ": {
            "config": {
                "layerName": "SP_KYZ",
                "label": "客运站",
                "icon": "",
                "locateIcon": "tocc-toms/common/res/img/layerImg/KYZ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE610"
            },
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
            }
        },
        "SP_JC": {
            "config": {
                "layerName": "SP_JC",
                "label": "民航图层",
                "icon": "",
                "locateIcon": "tocc-toms/common/res/img/layerImg/JC.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE629"
            },
            "title": "MC",
            "list": "MC,DZ,X,Y,SCODE,GID",
            "data": {
                "MC": {"label": "名称"},
                "SCODE": {"label": "行政区划"},
                "DZ": {"label": "地址"}
            }
        },
        "SP_HCZ": {
            "config": {
                "layerName": "SP_HCZ",
                "label": "铁路图层",
                "icon": "",
                "locateIcon": "tocc-toms/common/res/img/layerImg/HCZ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE629"
            },
            "title": "MC",
            "list": "MC,DZ,X,Y,SCODE,GID",
            "data": {
                "MC": {"label": "名称"},
                "SCODE": {"label": "行政区划"},
                "DZ": {"label": "地址"}
            }
        },
        "SP_SFZ": {
            "config": {
                "layerName": "SP_SFZ",
                "label": "收费站",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/SFZ.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE615"
            },
            "title": "MC",
            "list": "MC,DZ,X,Y,GID",
            "data": {
                "MC": {"label": "收费站名称"},
                "DZ": {"label": "地址"}
            },

            "filter": ""
        },
        "SP_TCC": {
            "config": {
                "layerName": "SP_TCC",
                "label": "停车场",
                "icon": "",
                "locateIcon": "/control/map-search/resource/images/TCC.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE609"
            },
            "title": "MC",
            "list": "MC,DBCNAME,X,Y,GID",
            "data": {
                "MC": {"label": "停车场名称"},
                "MCYY": {"label": "停车场名称英语"},
                "MCPY": {"label": "地址英语"},
                "DH": {"label": "电话"},
                "YZBM": {"label": "邮政编码"}
            },
            "filter": ""
        },
        "SP_ZXCTKD": {
            "config": {
                "layerName": "S_SP_ZXCTKD",
                "label": "自行车停靠点站",
                "icon": "",
                "locateIcon": "tocc-toms/common/res/img/layerImg/ZXCTKD.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": "jt-uniE629"
            },
            "title": "MC",
            "list": "GID,MC,DZ,CJSJ,AVAILBIKE,CAPACITY,DZJGJZJL,Y,X,GEOMETRY",
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
                "distance": {"label": "公交站距离(米)"}
            }
        },
        "SP_ZXCKJKH": {
            "config": {
                "layerName": "SP_ZXCTKD",
                "label": "自行车可借可还停车点",
                "icon": "",
                "locateIcon": "",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "title": "name",
            "list": "GID,MC,DZ,CJSJ,AVAILBIKE,CAPACITY,DZJGJZJL,Y,X,GEOMETRY",
            "data": {
                "x": {"label": "经度"},
                "y": {"label": "纬度"},
                "MC": {"label": "自行车停靠点"},
                "DZ": {"label": "所在地址"},
                "AVAILBIKE": {"label": "可借车辆"},
                "CAPACITY": {"label": "车辆总数"},
                "DZJGJZJL": {"label": "公交站距离(米)"},
                "CJSJ": {"label": "时间"}
            },
            "filter": ""
        },
        "SP_CBQY": {
            "config": {
                "layerName": "SP_CBQY",
                "label": "船舶企业",
                "icon": "tocc-toms/common/res/img/layerImg/CBQY.png",
                "locateIcon": "",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "title": "MC",
            "list": "MC,DZ,FZR,LXDH,Y,X",
            "data": {
                "X": {"label": "经度"},
                "Y": {"label": "纬度"},
                "MC": {"label": "名称"},
                "DZ": {"label": "地址"},
                "FZR": {"label": "负责人"},
                "LXDH": {"label": "联系电话"}
            },
            "filter": ""
        },
        "SP_JKD": {
            "config": {
                "layerName": "SP_JKD",
                "label": "视频监控",
                "icon": "",
                "locateIcon": "/control/map-search/resource/images/monitor.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "title": "WZ",
            "list": "WZ,X,Y,PZ",
            "data": {
                "WZ": {"label": "视频监控位置"},
                "X": {"label": "经度"},
                "Y": {"label": "纬度"}
            },
            "filter": ""
        },
        "SP_DCSB": {
            "config": {
                "layerName": "SP_DCSB",
                "label": "地磁监控",
                "icon": "",
                "locateIcon": "/control/map-search/resource/images/licon_dc.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "title": "WZ",
            "list": "WZ,IP,X,Y,BM",
            "data": {
                "BM": {"label": "地磁设备编码"},
                "WZ": {"label": "地磁设备位置"},
                "IP": {"label": "地磁设备IP地址"},
                "X": {"label": "经度"},
                "Y": {"label": "纬度"}
            },
            "filter": ""
        },
        "SP_CLLJKD": {
            "config": {
                "layerName": "SP_CLLJKD",
                "label": "车流量监控",
                "icon": "",
                "locateIcon": "/tocc-toms/common/res/img/layerImg/CLLJKD.png",
                "offsetX": 0,
                "offsetY": 17,
                "class": ""
            },
            "title": "MC",
            "list": "GID,MC,BM,X,Y",
            "data": {
                "MC": {"label": "名称"},
                "BM": {"label": "编码"}
            },
            "filter": ""
        }
    };
    var poiConfigUtil = {
        getLayerLocateSymbol: function (layerName) {
            if (!layerName) {
                return;
            }
            var config = poiConfig[layerName].config;
            if (config) {
                var options = {
                    icon: window.AppConfig.RemoteApiUrl + config.locateIcon,//图标
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
        getShowLabelWidth: function (layerName) {
            var config = this.getLayerConfig(layerName).data;
            var max = 0;
            var temp;
            if (config) {
                for (var key in config) {
                    if (!config[key] || !config[key].label) {
                        continue;
                    } else {
                        temp = config[key].label.length;
                        if (max < temp) {
                            max = temp;
                        }
                    }
                }
                return max * 14;
            } else {
                alert("图层定位信息未配置，请先配置，图层名为：" + layername);
            }
        },
        getLayerLegend: function (layerName) {
            if (layerName != null && layerName != "") {
                return legendConfig.layerName;
            }
            return null;
        }
    };
    var legendConfig = {
        "SP_GJZD": {
            "title": "可借车辆",
            "legends": [
                {
                    color: "#f06b30",
                    text: "0%",
                    width: "100"
                },
                {
                    color: "#ff00ff"/*"#ef3f3f"*/,
                    text: "1-50%",
                    width: "100"
                },
                {
                    color: "#980000"/*"#b456cc"*/,
                    text: "51-100%",
                    width: "100"
                }
            ]
        }
    }
    return {
        poiConfig: poiConfig,
        poiConfigUtil: poiConfigUtil,
        legendConfig: legendConfig
    };

});