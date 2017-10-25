package com.linkcld.toms.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

/**
 * Created by pangkailang on 2017/10/23.
 * 读取field.properties配置文件的工具类
 */
public class ReadPropertiesUtil{
    //读取配置文件中数据,放入proMap中
    public static Map<String,String> PROMAP = new HashMap<>();
    static{
        Properties props = new Properties();
        InputStream in = null;
        try {
            in = ReadPropertiesUtil.class.getClassLoader().getResourceAsStream("filed.properties");
            props.load(in);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
        } finally {
            try {
                if(null != in) {
                    in.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Iterator it=props.entrySet().iterator();
        while(it.hasNext()){
            Map.Entry entry=(Map.Entry)it.next();
            String key = String.valueOf(entry.getKey());
            String value = String.valueOf(entry.getValue());
            PROMAP.put(key,value);
        }
    }
}


