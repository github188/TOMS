package com.linkcld.toms.anlaysis.config;

/**
 * Created by shitou on 2017/8/15.
 */
public class LbsUsbUrlConfig {
    public static String LBSUSB_URL = "http://172.16.100.253:28181/lbs-usb";
    public static String GETLASTDATA_URL = LBSUSB_URL+"/rest/lbsservice/car/getLastData";
    public static String QUERYLIST_URL = LBSUSB_URL+"/rest/lbsservice/car/queryList";
}
