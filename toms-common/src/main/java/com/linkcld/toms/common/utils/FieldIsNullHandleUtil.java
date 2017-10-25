package com.linkcld.toms.common.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by pangkailang on 2017/10/23.
 * 处理数据库查出来数据为空,但是要将字段设置为0的工具类
 */
public class FieldIsNullHandleUtil{
    public static Map fieldIsNullHandle(String flag){
        Map<String,String> proMap = new HashMap<>();//获取配置文件的map
        Map<String,Object> fieldMap = new HashMap<>();
        proMap = ReadPropertiesUtil.PROMAP;
        String proValue=proMap.get(flag);
        if(proValue!=null){
            String[] fields = proValue.split(",");
            for (int i = 0; i <fields.length ; i++) {
                fieldMap.put(fields[i],0);
            }
        }
        return fieldMap;
    }
}
