package com.linkcld.toms.anlaysis.config;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by Administrator on 2017/6/28.
 */
public class BaseController {

    /**
     * 判断 过滤的行政区划编码
     * @param areaCode
     * @return
     */
    public String regionFilter(String areaCode){
        if(StringUtils.isNotBlank(areaCode)){
            if("0000".equals(areaCode.substring(2, 6))){//省级
                return areaCode.substring(0, 2);
            }else if("00".equals(areaCode.substring(4, 6))){//市级
                return areaCode.substring(0, 4);
            }else{//县级
                return areaCode;
            }
        }
        return null;
    }

    /*public Object getCurrentUserInfo(){
        return sso.getuserinfo();
    }*/

}
