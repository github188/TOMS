define([],function() {
    function request() {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        return paraObj;
    }
    //模版解析分解
    function _templateFn(baseTpl,obj) {
        var _self = obj,
            tplObj = {};
        if (baseTpl) {
            var tlps = $(baseTpl);
            tlps.each(function(index, item) {
                var tpl = $(item).html();
                var name = $(item).attr("id");
                if (tpl && name) {
                    tplObj[name] = tpl;
                }
            })
        }
        tplObj && _addTplMethod(tplObj,_self);
    }
    //添加模版方法
    function _addTplMethod(tplObj,obj) {
        var _self = obj;
        for(var key in tplObj) {
            var funcName = _fmtTplName(key);
            funcName = funcName + "Template";
            _self[funcName] = _.template(tplObj[key]);
        }
    }

    //下划线转驼峰式
    function _fmtTplName(name) {
        name = name.replace(/\-(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
        return name;
    }

    return {request:request,
        _templateFn:_templateFn,
        _addTplMethod:_addTplMethod};
});
