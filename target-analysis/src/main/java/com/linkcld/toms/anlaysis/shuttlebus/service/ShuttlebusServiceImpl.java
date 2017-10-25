package com.linkcld.toms.anlaysis.shuttlebus.service;

import com.linkcld.toms.anlaysis.time.service.TimeHandleService;
import com.linkcld.toms.common.dao.ShuttlebusMapper;
import com.linkcld.toms.common.utils.FieldIsNullHandleUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("shuttlebusServiceImpl")
public class ShuttlebusServiceImpl implements ShuttlebusService {

    @Autowired
    private ShuttlebusMapper shuttlebusMapper;
    @Resource(name="timeHandleServiceImpl")
    private TimeHandleService timeHandleService;
    @Override
    /**
     * 根据时间查询周转量/发送量
     */
    public List<Map> getCountShuttlebus(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = shuttlebusMapper.getCountByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = shuttlebusMapper.getCountByMonth(map);
        }else{//按天查询
            resultList = shuttlebusMapper.getCountByDay(map);
        }
        return resultList;
    }

    @Override
    /**
     * 根据时间查询班车客流量
     */
    public List<Map> getShuttleFlow(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = shuttlebusMapper.getShuttleFlowByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = shuttlebusMapper.getShuttleFlowByMonth(map);
        }else{//按天查询
            resultList = shuttlebusMapper.getShuttleFlowByDay(map);
        }
        return resultList;
    }

    /**
     * 按天统计班车客运客流量、周转量、班次总量和本月客流量
     */
    @Override
    public List<Map> getShuttleBusDataByDay(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();

        List<Map> ShuttleBusData = shuttlebusMapper.getShuttleBusDataByDay(map);
        List<Map> MonthFsl = shuttlebusMapper.getEveryMonthFslByYear(map);

        resultMap.put("ShuttleBusData",ShuttleBusData);
        resultMap.put("MonthFsl",MonthFsl);
        list.add(resultMap);

        return list;
    }

    /**
     * 站点流量TOP5、班线流量TOP5、班线实载率TOP5
     */
    @Override
    public List<Map> getTop5ByMonth(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();

        List<Map> siteFlowRateTop5 = shuttlebusMapper.getSiteFlowRateTop5ByMonth(map);
        List<Map> postFlowRateTop5 = shuttlebusMapper.getPostFlowRateTop5ByMonth(map);
        List<Map> postSzlTop5 = shuttlebusMapper.getPostSzlTop5ByMonth(map);

        resultMap.put("siteFlowRateTop5",siteFlowRateTop5);
        resultMap.put("postFlowRateTop5",postFlowRateTop5);
        resultMap.put("postSzlTop5",postSzlTop5);
        list.add(resultMap);
        return list;
    }

    /**
     * 站点流量TOP5
     */
    @Override
    public List<Map> getSiteFlowRateTop5ByMonth(Map map) {
        return shuttlebusMapper.getSiteFlowRateTop5ByMonth(map);
    }

    /**
     * 班线流量TOP5
     */
    @Override
    public List<Map> getPostFlowRateTop5ByMonth(Map map) {
        return shuttlebusMapper.getPostFlowRateTop5ByMonth(map);
    }

    /**
     * 班线实载率TOP5
     */
    @Override
    public List<Map> getPostSzlTop5ByMonth(Map map) {
        return shuttlebusMapper.getPostSzlTop5ByMonth(map);
    }

    /**
     * 月站点客流量/周转量、月站点客流量趋势分析
     */
    @Override
    public List<Map> getSiteFslAndZzlAnalysisByMonth(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();

        List<Map> siteFslAndZzl = shuttlebusMapper.getSiteFslAndZzlByMonth(map);
        List<Map> siteFslAnalysis = shuttlebusMapper.getSiteFslAnalysisByMonth(map);

        resultMap.put("siteFslAndZzl",siteFslAndZzl);
        resultMap.put("siteFslAnalysis",siteFslAnalysis);
        list.add(resultMap);
        return list;
    }

    /**
     * 月站点客流量/周转量
     */
    @Override
    public List<Map> getSiteFslAndZzlByMonth(Map map) {
        return shuttlebusMapper.getSiteFslAndZzlByMonth(map);
    }

    /**
     * 月站点客流量趋势分析
     */
    @Override
    public List<Map> getSiteFslAnalysisByMonth(Map map) {
        return shuttlebusMapper.getSiteFslAnalysisByMonth(map);
    }

    /**
     * 每月客流量、区域年旅客客流量
     */
    @Override
    public List<Map> getEveryMonthFslAndRegionFslByYear(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();

        List<Map> everyMonthFsl = shuttlebusMapper.getEveryMonthFslByYear(map);
        List<Map> regionFsl = shuttlebusMapper.getRegionFslByYear(map);

        resultMap.put("everyMonthFsl",everyMonthFsl);
        resultMap.put("regionFsl",regionFsl);
        list.add(resultMap);
        return list;
    }

    /**
     * 每月客流量
     */
    @Override
    public List<Map> getEveryMonthFslByYear(Map map) {
        return shuttlebusMapper.getEveryMonthFslByYear(map);
    }

    /**
     * 区域年旅客客流量
     */
    @Override
    public List<Map> getRegionFslByYear(Map map) {
        return shuttlebusMapper.getRegionFslByYear(map);
    }


    /**
     * 查询站当日班车出发，到达班次，发送量，周转量
     */
    public List<Map> getShiftBySite(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        //按天查询
        resultList = shuttlebusMapper.getShiftBySite(map);
        return resultList;
    }


    /**
     * 查询近7日班车出发，到达班次，客流量(发送量)
     */
    public List<Map> getShiftBySiteBy7Day(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        resultList = shuttlebusMapper.getShiftBySiteBy7Day(map);
        Map<String,Object> setMap = new HashMap<>();
        setMap.put("FSL_NUM", 0);
        setMap.put("ZZL_NUM", 0);
        setMap.put("ON_NUM", 0);
        setMap.put("OFF_NUM", 0);
        setMap.put("EXCHANGE_TIME","");
        setMap.put("SITE_NAME", map.get("siteName"));
        return timeHandleService.getInDaysDetail(7,"TJSJ_D",map.get("dateType").toString(),resultList,setMap);
    }

    /**
     * 查询近当天各时段班车出发，到达班次，客流量(发送量)
     */
    public List<Map> getShiftBySiteByHour(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        //按天查询
        resultList = shuttlebusMapper.getShiftBySiteByHour(map);
        List<Map>  result= new ArrayList<Map>();
        String[] dayHours={"00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"};//24小时数据
        for(int i=0;i<dayHours.length;i++){
            String timeHour = dayHours[i];
            boolean isHash = false;
            for(int j=0;j<resultList.size();j++){ //循环数据，看是否存在数组内的小时map
              Map dataMap =  resultList.get(j);
              String dataHour = String.valueOf(dataMap.get("TJSJ_H"));
              if(dataHour.equals(timeHour)){
                  result.add(dataMap);
                  isHash = true;
              }
            }
            if(!isHash){//说明返回的数据里面没有匹配到当前时间点，自己组装数据
                Map dataMap = new HashMap();
                //FSL_NUM,ZZL_NUM,SITE_NAME,ON_NUM,OFF_NUM,substr(TJSJ_H,9,2) TJSJ_H
                dataMap.put("FSL_NUM",0);
                dataMap.put("ZZL_NUM",0);
                dataMap.put("SITE_NAME",map.get("siteName"));
                dataMap.put("ON_NUM",0);
                dataMap.put("OFF_NUM",0);
                dataMap.put("TJSJ_H",timeHour);
                dataMap.put("EXCHANGE_TIME","");
                result.add(dataMap);
            }
        }
        return result;
    }

    /**
     * 查询航站楼当日班次,客流量
     * @param map
     * @return
     */
    @Override
    public List<Map> getAirportTerminalFlow(Map map) {
        List<Map> resultList = shuttlebusMapper.getAirportTerminalFlow(map);
        if(resultList.size()==0||resultList==null){
            Map resultMap= FieldIsNullHandleUtil.fieldIsNullHandle("getAirportTerminalFlow");
            resultList.add(resultMap);
        }
        return resultList;
    }

    /**
     * 航站楼近7日数据
     * @param map
     * @return
     */
    @Override
    public List<Map> getAirportTerminalFlowInSeven(Map map) {
        List<Map> resultList = shuttlebusMapper.getAirportTerminalFlowInSeven(map);
        Map<String,Object> setMap = new HashMap<>();
        setMap.put("FSLNUM",0);
        setMap.put("SITENAME", map.get("SITENAME"));
        return timeHandleService.getInDaysDetail(7,"TJSJ_D",map.get("dateType").toString(),resultList,setMap);
    }

    /**
     * 查询航站楼当日各时段详情
     * @param map
     * @return
     */
    @Override
    public List<Map> getAirportTerminalFlowByHour(Map map) {
        List<Map> resultList= shuttlebusMapper.getAirportTerminalFlowByHour(map);
        Map setMap = new HashMap();
        setMap.put("FSLNUM", 0);
        setMap.put("SITENAME", map.get("SITENAME"));
        return timeHandleService.currentDay(resultList,"TJSJ_H",setMap);
    }
}
