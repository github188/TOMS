/**
 * Created by zhouyx on 2016/12/7.
 */
define([
    'tocc-toms/common/BaseView',
    'text!../../template/VehicleOnlineTemplate.html',
    'css!../../resource/css/promptContent.css'
],function(BaseView,Tpl) {
    var that;
    var view = BaseView.extend({
        init:function(){
            that=this;
            that._templateFn(Tpl);
        },
        render:function(options){
            that=this;
            that.init();
            that.$pel=options.el;
            that.$threadFlag=true;
            that.$areaCode = options.areaCode;
            that.$indCode = options.indCode;
            that.$pel.append(that.vehicleOnlineContentTemplate());

            console.log(that.$indCode);

            var options={
                areaCode:that.$areaCode,
                indCode:that.$indCode
            };
            that.loadVehicleOnline(options);
            that.$onlineInterval=setInterval(function(){
                that.loadVehicleOnline(options);
            },window.AppConfig.internalFrequency||300000);

        },
        loadVehicleOnline:function(options){
            //获取动态数据加载车辆在线数据
            $.ajax(window.AppConfig.RemoteApiUrl + "rest/carStateStatics/vehicleOnline", {
                type: "POST",
                dataType: "json",
                data: {
                    regionFilter: options.areaCode,
                    indCode: options.indCode
                },
                success: function (data) {
                    if(data){
                        data=data.data;
                        var bczs=data.BCZS||0;
                        var zxbc=data.ZXBC||0;
                        var bxczs=data.BXCZS||0;
                        var zxbxc=data.ZXBXC||0;
                        var whzs=data.WHZS||0;
                        var zxwh=data.ZXWH||0;
                        $("#zs").html(bczs+bxczs+whzs);
                        $("#zxcl").html(zxbc+zxbxc+zxwh);
                        $("#bczs").html(bczs);
                        $("#zxbc").html(zxbc);
                        $("#bxczs").html(bxczs);
                        $("#zxbxc").html(zxbxc);
                        $("#whzs").html(whzs);
                        $("#zxwh").html(zxwh);

                    }
                }
            });
        }
    });
    return view;
});