package com.linkcld.toms.common.config;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

/**
 * Created by Administrator on 2016/12/22.
 */
public class MonitorAppContants {
    private static Logger logger = Logger.getLogger(MonitorAppContants.class.getName());

    static {
        Properties prop = new Properties();
        try {


            InputStream inStream = MonitorAppContants.class
                    .getResourceAsStream("/beyond/monitorApp.properties");
            BufferedReader bf = new BufferedReader(new InputStreamReader(inStream, "GBK"));
            prop.load(bf);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            logger.error("加载monitorApp.properties文件出错");
        }
        PROVINCENAME = prop.getProperty("province.name").trim();
        PROVINCECODE = prop.getProperty("province.code").trim();
        ENCODE = prop.getProperty("encode").trim();
        FOREIGNURL = prop.getProperty("foreign.url").trim();
        FOREIGNTOKEN = prop.getProperty("foreign.token").trim();

        LBSAPIPATH = prop.getProperty("lbs.api.path").trim();
        LBSAPITOKEN = prop.getProperty("lbs.api.token").trim();

        GETLASTDATAURL = prop.getProperty("lbs.api.getlastData.url").trim();
        QUERYLIATURL = prop.getProperty("lbs.api.queryList.url").trim();
        if(prop.getProperty("lbs.api.queryList.url")!=null){
            ROLE_MONITOR_ISADD = Boolean.parseBoolean(prop.getProperty("role.monitor.isadd"));
        }
        if(prop.getProperty("industry")!=null){
            ANALYSE_INDUSTRY = prop.getProperty("industry");
        }
    }

    public static String PROVINCENAME;
    public static String PROVINCECODE;
    public static String ENCODE;
    public static String FOREIGNURL;
    public static String FOREIGNTOKEN;

    public static String LBSAPIPATH;
    public static String LBSAPITOKEN;

    public static String GETLASTDATAURL;
    public static String QUERYLIATURL;
    public static boolean ROLE_MONITOR_ISADD;
    public static String ANALYSE_INDUSTRY ;

}
