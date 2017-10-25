package com.linkcld.toms.anlaysis.holiday.service;

import com.linkcld.toms.common.dao.*;
import com.linkcld.toms.common.utils.FieldIsNullHandleUtil;
import org.apache.commons.collections4.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("holidayServiceImpl")
public class HolidayServiceImpl implements HolidayService {
    @Autowired
    private HolidayMapper holidayMapper;
    @Autowired
    private TrainMapper trainMapper;
    @Autowired
    private ShuttlebusMapper shuttlebusMapper;
    @Autowired
    private HighWayMapper highWayMapper;
    @Autowired
    private BusMapper busMapper;
    @Autowired
    private TaxiMapper taxiMapper;
    @Autowired
    private IBicycleMapper bicycleMapper;

    /**
     * 客流量指标面板(铁路、客运、高速)
     */
    @Override
    public List<Map> springFestivalFlowRateIndexPanel(Map map) {
        List<Map> resultlist = new ArrayList<>();
        Map resultMap = new HashMap();
        resultMap.put("trainIndex",trainMapper.getFlowRateByDay(map));
        resultMap.put("shuttleBusIndex",shuttlebusMapper.getShuttleBusDataByDay(map));
        resultMap.put("highWayIndex",highWayMapper.getCountFlowByDay(map));
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 日运输畅通情况（公交日运行速率、出租车日实载率、自行车日使用率）
     */
    @Override
    public List<Map> toDayUnimpededStatus(Map map) {
        List<Map> resultlist = new ArrayList<>();
        Map resultMap = new HashMap();
        Map busSpeedByDay = busMapper.busSpeedByDay(map);
        Map TaxiUseRateByDay = taxiMapper.TaxiUseRateByDay(map);
        Map bicycleUseRateByDay2 = bicycleMapper.bicycleUseRateByDay2(map);

        if(null==busSpeedByDay){
            busSpeedByDay = FieldIsNullHandleUtil.fieldIsNullHandle("busSpeedByDay");
        }
        double bus = Double.parseDouble(String.valueOf(busSpeedByDay.get("LINESPEED")));
        if(bus<12){
            busSpeedByDay.put("STATUS","堵塞");
        }else if(bus>=12 && bus<=18){
            busSpeedByDay.put("STATUS","一般");
        }else if(bus>18){
            busSpeedByDay.put("STATUS","通畅");
        }

        if(null==TaxiUseRateByDay){
            TaxiUseRateByDay = FieldIsNullHandleUtil.fieldIsNullHandle("TaxiUseRateByDay");
        }
        double taxi = Double.parseDouble(String.valueOf(TaxiUseRateByDay.get("SZL")));
        if(taxi<40){
            TaxiUseRateByDay.put("STATUS","低");
        }else if(taxi>=40 && taxi<=60){
            TaxiUseRateByDay.put("STATUS","中");
        }else if(taxi>60){
            TaxiUseRateByDay.put("STATUS","高");
        }

        if(null==bicycleUseRateByDay2){
            bicycleUseRateByDay2 = FieldIsNullHandleUtil.fieldIsNullHandle("bicycleUseRateByDay2");
        }
        double bicycle = Double.parseDouble(String.valueOf(bicycleUseRateByDay2.get("SYL")));
        if(bicycle<40){
            bicycleUseRateByDay2.put("STATUS","低");
        }else if(bicycle>=40 && bicycle<=60){
            bicycleUseRateByDay2.put("STATUS","中");
        }else if(bicycle>60){
            bicycleUseRateByDay2.put("STATUS","高");
        }

        resultMap.put("busSpeedByDay",busSpeedByDay);
        resultMap.put("TaxiUseRateByDay",TaxiUseRateByDay);
        resultMap.put("bicycleUseRateByDay",bicycleUseRateByDay2);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 铁路站点流量分布、客运站点流量分布、高速收费站流量TOP5
     */
    @Override
    public List<Map> FlowRateDistribution(Map map) {
        List<Map> resultlist = new ArrayList<>();
        Map resultMap = new HashMap();
        List<Map> train = trainMapper.getDaySiteFlowRateByDay(map);
        if(null!=train){
            double num = 0.0;
            for(int i = 0;i<train.size()-1;i++){
                String  zdllfb= String.valueOf(train.get(i).get("ZDLLFB"));
                num +=Double.parseDouble(zdllfb);
            }
            train.get(train.size()-1).put("ZDLLFB",100-num);
        }
        resultMap.put("trainSiteFlowRate",train);
        resultMap.put("SiteFlowDistribution",SiteFlowDistribution(map));
        resultMap.put("highWayFlowTop5",highWayFlowTop5(map));
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 客运站点流量分布
     */
    @Override
    public List<Map> SiteFlowDistribution(Map map) {
        return holidayMapper.SiteFlowDistribution(map);
    }

    /**
     * 高速收费站流量TOP5
     */
    @Override
    public List<Map> highWayFlowTop5(Map map) {
        return holidayMapper.highWayFlowTop5(map);
    }

    /**
     * 铁路客运量、班车客运量、高速车流量、列车晚点数、公交运行速率、出租车实载率
     * @param map
     * @return
     */
    @Override
    public List<Map> springFestivalData(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();
        Map resultMap = new HashMap();
        resultMap.put("trainFlowRate",trainFlowRate(map));
        resultMap.put("suttleBusFlowRate",suttleBusFlowRate(map));
        resultMap.put("highWayFlowRate",highWayFlowRate(map));
        resultMap.put("trainLateNum",trainLateNum(map));
        resultMap.put("BusSpeed",BusSpeed(map));
        resultMap.put("taxiSzl",taxiSzl(map));
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 铁路客运量
     */
    @Override
    public List<Map> trainFlowRate(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.trainFlowRate(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                                    Integer.parseInt(String.valueOf(map.get("past")))+1,
                                                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                                    Integer.parseInt(String.valueOf(map.get("past")))+1,
                                                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        int[] total = new int[dateList.size()];
        int[] total2 = new int[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("TOTAL") == null ? 0 : Integer.parseInt(m.get("TOTAL").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("TOTAL2") == null ? 0 : Integer.parseInt(m.get("TOTAL2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 民航客运量
     */
    @Override
    public List<Map> fightFlowRate(Map map) {
        return holidayMapper.fightFlowRate(map);
    }

    /**
     * 班车客运量
     */
    @Override
    public List<Map> suttleBusFlowRate(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.suttleBusFlowRate(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        int[] total = new int[dateList.size()];
        int[] total2 = new int[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("FSLTOTAL") == null ? 0 : Integer.parseInt(m.get("FSLTOTAL").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("FSLTOTAL2") == null ? 0 : Integer.parseInt(m.get("FSLTOTAL2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 高速车流量
     */
    @Override
    public List<Map> highWayFlowRate(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.highWayFlowRate(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        int[] total = new int[dateList.size()];
        int[] total2 = new int[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("CLZZTOTAL") == null ? 0 : Integer.parseInt(m.get("CLZZTOTAL").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("CLZZTOTAL2") == null ? 0 : Integer.parseInt(m.get("CLZZTOTAL2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 列车晚点数
     */
    @Override
    public List<Map> trainLateNum(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.trainLateNum(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        int[] total = new int[dateList.size()];
        int[] total2 = new int[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("YWTOTAL") == null ? 0 : Integer.parseInt(m.get("YWTOTAL").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("YWTOTAL2") == null ? 0 : Integer.parseInt(m.get("YWTOTAL2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 公交运行速率
     */
    @Override
    public List<Map> BusSpeed(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.BusSpeed(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        double[] total = new double[dateList.size()];
        double[] total2 = new double[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("LINESPEED") == null ? 0 : Double.parseDouble(m.get("LINESPEED").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("LINESPEED2") == null ? 0 : Double.parseDouble(m.get("LINESPEED2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 出租车实载率
     */
    @Override
    public List<Map> taxiSzl(Map map) throws ParseException {
        List<Map> resultlist = new ArrayList<>();

        List<Map> result = holidayMapper.taxiSzl(map);
        List dateList = pastToFeture(String.valueOf(map.get("dateType")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        List dateList2 = pastToFeture(String.valueOf(map.get("dateTypeLastYear")),
                Integer.parseInt(String.valueOf(map.get("past")))+1,
                Integer.parseInt(String.valueOf(map.get("feture"))));
        int[] dayNum = new int[dateList.size()];
        double[] total = new double[dateList.size()];
        double[] total2 = new double[dateList2.size()];
        for(int i = 0;i<dateList.size();i++){
            for (Map m : result) {
                if(null!=m.get("DAYTIME")){
                    if (m.get("DAYTIME").toString().equals(dateList.get(i))) {
                        total[i] = m.get("SZL") == null ? 0 : Double.parseDouble(m.get("SZL").toString());
                    }
                }

                if(null!=m.get("DAYTIME2")){
                    if (m.get("DAYTIME2").toString().equals(dateList2.get(i))) {
                        total2[i] = m.get("SZL2") == null ? 0 : Double.parseDouble(m.get("SZL2").toString());
                    }
                }
            }
        }

        for(int i =0;i<dateList.size();i++){
            dayNum[i] = i+1;
        }

        Map<String, Object> resultMap = new HashedMap();
//        resultMap.put("dayTime", dateList);
//        resultMap.put("dayTimeLastYear", dateList2);
        resultMap.put("total", total);
        resultMap.put("totalLastYear", total2);
        resultMap.put("dayNum", dayNum);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 获取指定时间过去任意天到的未来任意天的日期数组
     * @param date
     * @param pastDays      pastDays天之前
     * @param fetureDays      beforeDays天之后
     * @return              日期数组
     */
    public static ArrayList<String> pastToFeture(String date,int pastDays,int fetureDays) throws ParseException {
        ArrayList<String> pastDaysList = new ArrayList<>();
        for (int i = pastDays; i >0; i--) {
            if(i!=pastDays){
                pastDaysList.add(getDatePast(date,i));
            }
        }

        ArrayList<String> fetureDaysList = new ArrayList<>();
        for (int i = 0; i <fetureDays; i++) {
            fetureDaysList.add(getDateFeture(date,i));
        }

        pastDaysList.addAll(fetureDaysList);


        return pastDaysList;
    }

    /**
     * 获取过去第 pastDays 天的日期
     * @param dateString
     * @param pastDays
     * @return
     */
    public static String getDatePast(String dateString , int pastDays) throws ParseException{
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        Date inputDate = dateFormat.parse(dateString);
        Calendar cal = Calendar.getInstance();
        cal.setTime(inputDate);
        int inputDayOfYear = cal.get(Calendar.DAY_OF_YEAR);
        cal.set(Calendar.DAY_OF_YEAR , inputDayOfYear-pastDays );

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        String date = format.format(cal.getTime());
        return date;
    }

    /**
     * 获取未来第 beforeDays 天的日期
     * @param dateString
     * @param fetureDays
     * @return
     */
    public static String getDateFeture(String dateString , int fetureDays) throws ParseException{
        DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        Date inputDate = dateFormat.parse(dateString);
        Calendar cal = Calendar.getInstance();
        cal.setTime(inputDate);
        int inputDayOfYear = cal.get(Calendar.DAY_OF_YEAR);
        cal.set(Calendar.DAY_OF_YEAR , inputDayOfYear+fetureDays );

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        String date = format.format(cal.getTime());
        return date;
    }
}
