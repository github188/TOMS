package com.linkcld.toms.common.utils;

/**
 * Created by shilz on 2016/12/12.
 */
public class RegionUtil {
    /**
     * 清除行政区划末尾的00
     * @param code
     * @return
     */
    public static  String removeZero(String code){
        if(code.indexOf("0000")>-1){
            code = code.replace("0000","");
        }else if(code.indexOf("00")>-1){
            code = code.replace("00","");
        }
        return code;
    }
}
