package com.linkcld.toms.anlaysis.bus.service;

import com.linkcld.toms.common.dao.BusMapper;
import com.linkcld.toms.common.dao.TaxiMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("busServiceImpl")
public class BusServiceImpl implements  BusService{

    @Autowired
    private BusMapper busMapper;

    @Autowired
    private TaxiMapper taxiMapper;

    /**
     * 查询公交站点数，线路数，车辆数
     * @param map
     * @return
     */
    @Override
    public List<Map> getBusDataBase(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        String area_code = String.valueOf(map.get("areaCode"));
        area_code = getCode(area_code);
        map.put("areaCode",area_code);
        //查询公交站点，线路数
        List<Map> busDataBase = busMapper.getBusDataBase(map);
        //查询公交车辆数
        List<Map> busCar = busMapper.getBusCar(map);
        //查询公交运行班次
        List<Map> resultListByBc = new ArrayList<Map>();
        if (dateType.length()<=4){ //按年份查询
            resultListByBc = busMapper.getCountFlowByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultListByBc = busMapper.getCountFlowByMonth(map);
        }else{//按天查询
            resultListByBc = busMapper.getCountFlowByDay(map);
        }
        Map maps=new HashMap();
        Map item;
        if(busDataBase!=null){
            for(int i=0;i<busDataBase.size();i++){
                item=busDataBase.get(i);
                if("routenum".equals(item.get("CODE"))){
                    maps.put("routesNum",item.get("VALUE"));
                }else if("stationnum".equals(item.get("CODE"))){
                    maps.put("stationNum",item.get("VALUE"));
                }else{
                    maps.put(item.get("CODE"),item.get("VALUE"));
                }
            }
        }
        int carCount = 0;
        if(busCar!=null){
            carCount = busCar.size();
        }
        maps.put("carCount",carCount);
        String bcl = "0";
        if(resultListByBc.size()>0){
            bcl =  String.valueOf(resultListByBc.get(0).get("POST_NUM"));
        }
        maps.put("bcl",bcl);

        resultList.add(maps);
        return resultList;
    }

    /**
     * 查询公交客流量，运行班次,车辆数
     * @param map
     * @return
     */
    @Override
    public List<Map> getCountFlows(Map map) {
        //查询班次
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        String area_code = String.valueOf(map.get("areaCode"));
        area_code = getCode(area_code);
        map.put("areaCode",area_code);
        //查询班次
        if (dateType.length()<=4){ //按年份查询
            resultList = busMapper.getCountFlowByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = busMapper.getCountFlowByMonth(map);
        }else{//按天查询
            resultList = busMapper.getCountFlowByDay(map);
        }
        Map maps = new HashMap();
        if(resultList.size()>0){
            maps.put("bcl",resultList.get(0).get("POST_NUM"));
        }else{
            maps.put("bcl",0);
        }
        //查询车辆数
        List<Map> busCar = busMapper.getBusCar(map);
        if(busCar.size()>0){
            maps.put("carCount",busCar.size());
        }else{
            maps.put("carCount",0);
        }
        //查询客运量
        List<Map> ysResult = new ArrayList<Map>();
        /*if (dateType.length()<=4){ //按年份查询  柯桥屏蔽
            ysResult = busMapper.getBusYsByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            ysResult = busMapper.getBusYsByMonth(map);
        }else{//按天查询
            ysResult = busMapper.getBusYsByDay(map);
        }*/
        if(ysResult.size()>0){
            maps.put("kyl",resultList.get(0).get("GJKL"));
        }else{
            maps.put("kyl",0);
        }
        List<Map> dataList = new ArrayList<Map>();
        dataList.add(maps);
        return dataList;
    }

    /**
     * 查询公交运行速度，运行班次,运行里程
     * @param map
     * @return
     */
    @Override
    public Map getCountFlow2(Map map) {
        //查运行速度
        List<Map> resultList = new ArrayList<Map>();
        List<Map> resultList2 = new ArrayList<Map>();
        Map mapAll = new HashMap();
        String dateType = map.get("dateType").toString();
        //查询班次
        if (dateType.length()<=4){ //按年份查询

        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            dateType = dateType.substring(0,4);
            map.put("dateType",dateType);
            resultList = busMapper.getSpeedByMonth(map);//运行速度
            resultList2 = busMapper.getShiftAndMileageByMonth(map);//运行班次和运行里程
        }else{//按天查询
            dateType = dateType.substring(0,6);
            map.put("dateType",dateType);
            resultList = busMapper.getSpeedByDay(map);
            resultList2 = busMapper.getShiftAndMileageByDay(map);
        }
        mapAll.put("speed",resultList);
        mapAll.put("shiftAndMileage",resultList2);
        return mapAll;
    }

    public static String getCode(String areaCode){
        String code ="";
        if (areaCode.indexOf("00") > 0) {
            code = areaCode.replace("00", "");
        } else if (areaCode.indexOf("0000") > 0) {
            code = areaCode.replace("0000", "");
        }else{
            code =  areaCode;
        }
        return code;
    }

    @Override
    public Map<String,String> getStaticData() {
        Map<String,String> map = new HashMap<>();
        map=busMapper.getStaticData();
        return map;
    }

    @Override
    public List<Map> getLineData(Map map) {
        List<Map> result =busMapper.getBusCar(map);
       /* List<Map> list = new ArrayList<Map>();
        for(int i=0;i<result.size();i++){
            Map gpsMap=result.get(i);
            String plateNo=String.valueOf(gpsMap.get("PLATE_NUMBER"));
            Map maps = new HashMap();
            maps.put("plateNo",plateNo);
           *//* List<Map> lineMap = busMapper.getBusLine(maps);
            Map resultMap = new HashMap();
            if(lineMap.size()>0){
                resultMap.put("xlmc",lineMap.get(0).get("MC"));
            }else{
                resultMap.put("xlmc","");
            }*//*
            resultMap.put("plateNumber",gpsMap.get("PLATE_NUMBER"));
            resultMap.put("plateColor",gpsMap.get("PLATE_COLOR"));
            resultMap.put("terminalTime",gpsMap.get("TERMINAL_TIME"));
            resultMap.put("lon",gpsMap.get("GPSLON"));
            resultMap.put("lat",gpsMap.get("GPSLON"));
            resultMap.put("industry",gpsMap.get("INSDUTY_TYPE"));
            resultMap.put("onlineStatus",gpsMap.get("ONLINE_STATUS"));
            resultMap.put("vehicleStatus",gpsMap.get("VEHICLE_STATUS"));
            resultMap.put("runState",gpsMap.get("STATE"));
            resultMap.put("speed",gpsMap.get("SPEED"));
            list.add(resultMap);
        }*/
        return result;
    }

    /**
     * 获取公交车路线
     * @param map
     * @return
     */
    public List<Map> getBusLine(Map map) {
        List<Map> result = busMapper.getBusLine(map);
        return result;
    }

    /**
     * 获取公交周，月客流量
     * @param map
     * @return
     */
    @Override
    public Map getBusFlowByWeekAndMonth(Map map) {
        Map dataMap = new HashMap();
        String dateType = map.get("dateType").toString();
        //将当天时间转化为周，月
        String dateMonth = dateType.substring(0,6);
        map.put("dateType",dateMonth);
        //月客流量
        List resultList1 = busMapper.getFlowByNowMonth(map);
        //获取当前月第一天
        List dateList =compareDate(dateType);
        List<Map> dataMonth = new ArrayList<Map>();
        //根据时间集合去数据里面找是否包含时间的数据
        for(int i=0;i<dateList.size();i++){
            boolean contains = false;
            String days = dateList.get(i).toString();
            for(int j=0;j<resultList1.size();j++){
                Map dataMaps = (Map) resultList1.get(j);
                String dataDays = dataMaps.get("TJSJ_D").toString();
                if(dataDays.equals(days)){//说明有匹配日期数据
                    dataMonth.add(dataMaps);
                    contains = true;
                }
            }
            if(!contains){ //说明该天没有匹配到数据
                Map newMap = new HashMap();
                newMap.put("POST_NUM",0);
                newMap.put("TJSJ_D",days);
                dataMonth.add(newMap);
            }
        }
        //周客流量
        List resultList2 = busMapper.getFlowByWeek(map);
        dataMap.put("month",dataMonth);
        dataMap.put("week",resultList2);
        return dataMap;
    }
    //比较当前时间和当月第一天，判断当前时间与第一天相差多少天
    public List compareDate(String nowDay){
        List dateList = new ArrayList();
        String days = nowDay.substring(nowDay.length()-2,nowDay.length());
        if("01".equals(days)){//说明当前时间就是第一天
            dateList.add("01");
        }else{
           //判断当天日期是不是以0开头的  01，02......
            int days1 = Integer.parseInt(days.substring(days.length()-1,days.length()));
           if(days.startsWith("0")){
               for(int i=1;i<=days1;i++){
                   dateList.add("0"+i);
               }
           } else{
               days1 = Integer.parseInt(days);
               for(int i=1;i<=days1;i++){
                   boolean b = (i <= 9) ? dateList.add("0" + i) : dateList.add("" + i);
               }
           }
        }
        return dateList;
    }

}
