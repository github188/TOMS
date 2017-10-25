define([],function() {


    /**
     * 打开一个窗口
     * @param tab
     */
    function addTab(tab){
        var active = $(".result-panel-bottom").attr("active");
        if(active == "1"){
            $(".result-panel-bottom").click();
        }
        $('#tab').wyTabview("add", tab);
    }
    /**判断是否包含特殊字符*/
    function containSpecial(s)
    {
        var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
        return !( containSpecial.test(s));
    }

    /**
     * 从访问连接中获取参数
     * @param paras
     * @returns {*}
     */
    function request(paras){
        var url = location.href;
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
        var paraObj = {}
        for (i=0; j=paraString[i]; i++){
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if(typeof(returnValue)=="undefined"){
            return "";
        }else{
            return returnValue;
        }
    }
    return {
        addTab:addTab,
        containSpecial:containSpecial,
        request:request
    };
});