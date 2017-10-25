package com.linkcld.toms.anlaysis.highWay.service;


import com.linkcld.fw.GlobalContext;
import com.linkcld.toms.anlaysis.time.service.TimeHandleService;
import com.linkcld.toms.common.dao.HighWayMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("highWayServiceImpl")
public class HighWayServiceImpl implements HighWayService {

    @Autowired
    private HighWayMapper highWayMapper;

    /*private TimeHandleService timeHandleService = (TimeHandleService
            ) GlobalContext.getBean("timeHandleServiceImpl");*/
    @Resource(name="timeHandleServiceImpl")
    private TimeHandleService timeHandleService;
    /**
     * 查询高速公路车流量指示面板信息(当年,当月,当日的总流量,出口流量,入口流量)
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getCountFlow(Map map) {
        //用于返回的list
        List<Map> resultList = new ArrayList<Map>();
        //时间(年,月,日)的map,作为参数传递
        Map<String, Object> dateTypeMap = new HashMap<>();

        //获得年
        String dateType = map.get("dateType").toString().substring(0, 4);
        dateTypeMap.put("dateType", dateType);
        //获取年份对应的出口,入口,总流量
        List<Map> yearList = highWayMapper.getCountFlowByYear(dateTypeMap);
        Map<String, Object> yearMapData = new HashMap<>();
        //近一步封装
        yearMapData.put("yearData", yearList);
        resultList.add(yearMapData);

        //获得年月
        dateType = map.get("dateType").toString().substring(0, 6);
        dateTypeMap.put("dateType", dateType);
        //获取月份对应的出口,入口,总流量
        List<Map> monthList = highWayMapper.getCountFlowByMonth(dateTypeMap);
        Map<String, Object> monthMapData = new HashMap<>();
        monthMapData.put("monthData", monthList);
        resultList.add(monthMapData);

        //获得年月日
        dateType = map.get("dateType").toString().substring(0, 8);
        dateTypeMap.put("dateType", dateType);
        //获取日对应的出口,入口,总流量
        List<Map> dayList = highWayMapper.getCountFlowByDay(dateTypeMap);
        Map<String, Object> dayMapData = new HashMap<>();
        dayMapData.put("dayData", dayList);
        resultList.add(dayMapData);
        return resultList;
    }

    /**
     * 根据年月查询入口ETC流量占比和查询出口货车流量占比
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getFlowPercentage(Map map) {
        //用于返回的list
        List<Map> list = new ArrayList<>();
        //取出年月
        String dateType = map.get("dateType").toString().substring(0, 6);
        map.put("dateType", dateType);

        //货车出口流量数据占比map
        Map<String, Object> outFlowMap = new HashMap<>();
        //拿到货车流量的占比数据
        List<Map> trucksOutList = highWayMapper.getOutFlowMapByTrucks(map);
        outFlowMap.put("percentageOfTrucks", trucksOutList.get(0).get("PERCENTAGE_OF_TRUCKS"));

        //ETC入口流量占比map
        Map<String, Object> inFlowMap = new HashMap<>();
        //拿到ETC流量的占比
        List<Map> ETCInList = highWayMapper.getInFlowMapByETC(map);
        //设值到map中
        inFlowMap.put("percentageOfETC", ETCInList.get(0).get("PERCENTAGE_OF_ETC"));
        //分别将货车和ETC放进list里面
        list.add(outFlowMap);
        list.add(inFlowMap);
        return list;
    }

    /**
     * 查询当月每天的入口,出口,总流量和当月每个站点日平均入口,出口,总流量
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getCountFlowByDay(Map map) {
        //准备一个list<Map>用于返回
        List<Map> list = new ArrayList<>();
        //得到年月
        String dateType = map.get("dateType").toString().substring(0, 6);
        map.put("dateType", dateType);

        //查询当月每天的入口,出口,总流量
        List<Map> dayList = highWayMapper.getFlowByDay(map);
        //装dayList数据的map
        Map<String, Object> dayMap = new HashMap<>();
        dayMap.put("everyDayFLow", dayList);

        //查询当月各站点日平均(入口,出口,总流量)
        List<Map> stationList = highWayMapper.getFlowByStation(map);
        //装stationList的map
        Map<String, Object> stationMap = new HashMap<>();
        stationMap.put("stationFLow", stationList);
        list.add(dayMap);
        list.add(stationMap);
        return list;
    }

    /**
     * 查询当年每月的日均流量和当年流量top5的数据
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getCountFlowAvgDay(Map map) {
        int i = 0;
        //用于返回的list
        List<Map> list = new ArrayList<>();
        //用于最后一个月计算平均流量数据
        String dateTime = map.get("dateType").toString();
        //拿到年
        String dateType = map.get("dateType").toString().substring(0, 4);
        map.put("dateType", dateType);
        //查询top5的数据
        List<Map> topFiveList = highWayMapper.getTopFiveFlowByYear(map);
        Map<String, Object> topFiveMap = new HashMap<>();
        topFiveMap.put("topFiveMap", topFiveList);

        //查询当年每个月的总流量
        List<Map> monthFlowList = highWayMapper.getFlowByMonth(map);
        //添加平均
        List<Map> avgFlowList = new ArrayList<>();
        Map<String, Object> avgFLowMap = new HashMap<>();
        for (i = 0; i < monthFlowList.size(); i++) {
            Map flowMap = monthFlowList.get(i);
            String dateStr = flowMap.get("TJSJM").toString();
            try {
                Date date = new SimpleDateFormat("yyyyMM").parse(dateStr);
                Calendar cal = Calendar.getInstance();
                cal.setTime(date);
                int days = cal.getActualMaximum(cal.DAY_OF_MONTH) - cal.getActualMinimum(cal.DAY_OF_MONTH) + 1;
                if (i == 0) {
                    date = new SimpleDateFormat("yyyyMMdd").parse(dateTime);
                    cal.setTime(date);
                    days = cal.get(Calendar.DAY_OF_MONTH);
                }
                if (flowMap.get("CLZZ") != null) {
                    Double clTotalFlow = new Double(flowMap.get("CLZZ").toString());
                    Double ddTotalFlow = new Double(flowMap.get("DDCLZL").toString());
                    Double cfTotalFlow = new Double(flowMap.get("CFCLZL").toString());
                    //总量除以天数得到平均流量
                    Double clAvgFlow = clTotalFlow / days;
                    Double ddAvgFlow = ddTotalFlow / days;
                    Double cfAvgFlow = cfTotalFlow / days;
                    //保留两位小数
                    DecimalFormat df = new DecimalFormat("######0.00");
                    String clAvgFlowStr = df.format(clAvgFlow);
                    String ddAvgFlowStr = df.format(ddAvgFlow);
                    String cfAvgFlowStr = df.format(cfAvgFlow);
                    Map<String, Object> avgMap = new HashMap<>();
                    List<Map> flowList = new ArrayList();
                    Map<String, Object> everyAvgMap = new HashMap<>();
                    everyAvgMap.put("dataStr", dateStr.substring(4));
                    everyAvgMap.put("clAvgFlowStr", clAvgFlowStr);
                    everyAvgMap.put("ddAvgFlowStr", ddAvgFlowStr);
                    everyAvgMap.put("cfAvgFlowStr", cfAvgFlowStr);
                    avgFlowList.add(everyAvgMap);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            avgFLowMap.put("avgFLowMap", avgFlowList);
        }
        list.add(topFiveMap);
        list.add(avgFLowMap);
        return list;
    }

    /**
     * 查询高速情报板信息
     */
    @Override
    public List<Map> getBoardInformation(Map map) {
        return highWayMapper.getBordInformation(map);
    }

    /**
     * 查询交调站近7日的信息小型车/中型车/重型车/总流量,
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getStationFlowInSeven(Map map) {
        String stationIp = map.get("stationIp").toString();
        //分割合在一起的ip地址
        String[] stationIps = stationIp.split(",");
        List list = new ArrayList();
        for (int i = 0; i < stationIps.length; i++) {
            list.add(stationIps[i]);
        }
        map.put("list", list);
        List<Map> singleList = highWayMapper.getStationFlowInSeven(map);
        return singleList;
    }

    /**
     * 查询收费站出口入口信息
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getTollStationFlow(Map map) {
        return highWayMapper.getTollStationData(map);
    }

    /**
     * 查询近7日收费站信息
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getTollStationFlowInSeven(Map map) {
        List<Map> resultList = highWayMapper.getTollStationFlowInSeven(map);
        Map<String,Object> setMap = new HashMap<>();
        setMap.put("CLZZ",0);
        setMap.put("CFCLZL",0);
        setMap.put("DDCLZL",0);
        setMap.put("zdmc",map.get("ZDMC"));
        return timeHandleService.getInDaysDetail(7,"TJSJ_D",map.get("dateType").toString(),resultList,setMap);
    }

    /**
     * 查询当天各时段收费站信息
     *
     * @param map
     * @return
     */
    @Override
    public List<Map> getTollStationDataByHour(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        //按天查询
        resultList = highWayMapper.getTollStationDataByHour(map);
        if (resultList.size() == 0) {
            resultList = highWayMapper.getNewestDataByHour(map);
        }
        Map setMap = new HashMap();
        setMap.put("CLZZ", 0);
        setMap.put("CFCLZL", 0);
        setMap.put("ZDMC", map.get("ZDMC"));
        setMap.put("DDCLZL", 0);
        return timeHandleService.currentDay(resultList,"TJSJ_H",setMap);
    }

    /**
     * 查询交调站近七日上下行数据
     * @param map
     * @return
     */
    @Override
    public List<Map> getStationSXFlowInSeven(Map map) {
        List<Map> resultList = highWayMapper.getStationSXFlowInSeven(map);
        Map<String,Object> setMap = new HashMap<>();
        setMap.put("JDCZRS_SX", 0);
        setMap.put("JDCZRS_XX", 0);
        setMap.put("LXMC", map.get("LXMC"));
        return timeHandleService.getInDaysDetail(7, "TIME",map.get("dateType").toString(), resultList, setMap);
    }
}
