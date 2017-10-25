package com.linkcld.toms.anlaysis.train.service;

import com.linkcld.toms.anlaysis.time.service.TimeHandleService;
import com.linkcld.toms.common.dao.TrainMapper;
import org.apache.commons.collections4.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("trainServiceImpl")
public class TrainServiceImpl implements  TrainService{

    @Autowired
    private TrainMapper trainMapper;
    @Resource(name="timeHandleServiceImpl")
    private TimeHandleService timeHandleService;
    /**
     * 根据时间或站名查询火车站出发量和到达量(可以按年/月/日来查询)
     */
    @Override
    public List<Map> getCountTrain(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = trainMapper.getCountByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = trainMapper.getCountByMonth(map);
        }else{//按天查询
            resultList = trainMapper.getCountByDay(map);
            if(resultList.size()==0){ //查询最新一条数据
                resultList = trainMapper.getCountByDayNew(map);
            }
        }
        return resultList;
    }

    /**
     * 站点最新数据
     */
    @Override
    public Map getSiteData(Map map) {
        return trainMapper.getSiteData(map);
    }

    /**
     * 近7日车站客流量走势
     */
    @Override
    public List<Map> get7DayFlowRateAnalysis(Map map) {
        List<Map> resultList=trainMapper.get7DayFlowRateAnalysis(map);
        Map<String,Object> setMap= new HashMap<>();
        setMap.put("TOTAL",0);
        setMap.put("CF",0);
        setMap.put("DD",0);
        return timeHandleService.getInDaysDetail(7,"DAYTIME",map.get("dateType").toString(),resultList,setMap) ;
    }

    /**
     * 车站当天各小时客流量走势
     */
    @Override
    public List<Map> get24HourFlowRateAnalysis(Map map) {
        List<Map> resultlist = new ArrayList<>();
        int [] hourTime = new int[24];
        double[] total = new double[24];
        double[] dd = new double[24];
        double[] cf = new double[24];
        Map<String, Object> resultMap = new HashedMap();

        List<Map> list = trainMapper.get24HourFlowRateAnalysis(map);
        String prefix = trainMapper.newDataDate(map);

        String time = "";
        for (int i = 0; i < 24; i++) {
            if (i < 10) {
                time = prefix + "0" + i;
                hourTime[i] = i;
            } else {
                time = prefix + i;
                hourTime[i] = i;
            }
            for (Map m : list) {
                if (m.get("HOURTIME").toString().equals(time)) {
                    total[i] = m.get("TOTAL") == null ? 0 : Double.parseDouble(m.get("TOTAL").toString());
                    dd[i] = m.get("DD") == null ? 0 : Double.parseDouble(m.get("DD").toString());
                    cf[i] = m.get("CF") == null ? 0 : Double.parseDouble(m.get("CF").toString());
                }
            }
        }
        resultMap.put("hourTime", hourTime);
        resultMap.put("total", total);
        resultMap.put("dd", dd);
        resultMap.put("cf", cf);
        resultlist.add(resultMap);
        return resultlist;
    }

    /**
     * 年月日_总量_出发人次_到达人次
     */
    @Override
    public Map getAllOutInByYearMonthDay(Map map) {
        return trainMapper.getAllOutInByYearMonthDay(map);
    }

    /**
     * 车型流量分布、车型流量占比
     */
    @Override
    public List<Map> getTrainTypeFlowRateByMonth(Map map) {
        List<Map> list = trainMapper.getTrainTypeFlowRateByMonth(map);

/*        List llfb_list = new ArrayList();
        List llzb_list = new ArrayList();
        String[] cx_arr = new String[list.size()];
        int[] total_arr = new int[list.size()];
        int[] cf_arr = new int[list.size()];
        int[] dd_arr = new int[list.size()];
        if(list.size()>0){
            for (int i = 0; i < list.size(); i++) {
                cx_arr[i] = list.get(i).get("CX").toString();
                total_arr[i] = Integer.parseInt(list.get(i).get("TOTAL").toString());
                cf_arr[i] = Integer.parseInt(list.get(i).get("CF").toString());
                dd_arr[i] = Integer.parseInt(list.get(i).get("DD").toString());

                Map cxllzb_map = new HashMap();
                cxllzb_map.put(list.get(i).get("CX").toString(),list.get(i).get("CXLLZB"));
                llzb_list.add(cxllzb_map);
            }
        }
        llfb_list.add(new HashMap().put("cx",cx_arr));
        llfb_list.add(new HashMap().put("total",total_arr));
        llfb_list.add(new HashMap().put("cf",cf_arr));
        llfb_list.add(new HashMap().put("dd",dd_arr));

        List result = new ArrayList();
        result.add(new HashMap().put("llfb",llfb_list));
        result.add(new HashMap().put("llzb",llzb_list));*/
        return list;
    }

    /**
     * 今日站点流量、每月客流量、节假日客流量
     */
    @Override
    public List<Map> getDayMonthHolidayFlowRate(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();
        //List<Map> zdll = trainMapper.getDaySiteFlowRateByDay(map);
        /*if(zdll.size()<=0){*/
        List<Map>  zdll = trainMapper.getCountByDayNew1(map);
        //}
        List<Map> kll = trainMapper.getMonthFlowRateByMonth(map);
//        List<Map> holiday = trainMapper.getHolidayFlowRate(map);

        resultMap.put("zdll",zdll);
        resultMap.put("kll",kll);
//        resultMap.put("holiday",holiday);
        list.add(resultMap);
        return list;
    }

    /**
     * 今日站点流量
     */
    @Override
    public List<Map> getDaySiteFlowRateByDay(Map map) {
        return trainMapper.getDaySiteFlowRateByDay(map);
    }

    /**
     * 每月客流量
     */
    @Override
    public List<Map> getMonthFlowRateByMonth(Map map) {
        return trainMapper.getMonthFlowRateByMonth(map);
    }

    /**
     * 节假日客流量
     */
    @Override
    public List<Map> getHolidayFlowRate(Map map) {
        return trainMapper.getHolidayFlowRate(map);
    }

    /**
     * 本月每日客流量
     */
    @Override
    public List<Map> getMonthEveryDayFlowRateByDay(Map map) {
        String[] site = String.valueOf(map.get("siteName")).split(",");
        List<Map> resultList = new ArrayList<Map>();
        Map resultMap = new HashMap();
        for(int i=0;i<site.length;i++){
            map.put("siteName",site[i]);
            List<Map> result =  trainMapper.getMonthEveryDayFlowRateByDay(map);
            resultMap.put(site[i],result);
        }
        resultList.add(resultMap);
        return resultList;
    }

    /**
     * 出发站点TOP5、到达站点TOP5、车次流量TOP5
     */
    @Override
    public List<Map> getTop5ByMonth(Map map) {
        List list = new ArrayList();
        Map resultMap = new HashMap();

        List<Map> cf_list = trainMapper.getCfSiteTop5ByMonth(map);
        List<Map> dd_list = trainMapper.getDdSiteTop5ByMonth(map);
        List<Map> cx_list = trainMapper.getTrainFlowRateTop5ByMonth(map);

        resultMap.put("cfTop5",cf_list);
        resultMap.put("ddTop5",dd_list);
        resultMap.put("cxTop5",cx_list);
        list.add(resultMap);
        return list;
    }

    /**
     * 出发站点TOP5
     */
    @Override
    public List<Map> getCfSiteTop5ByMonth(Map map) {
        return trainMapper.getCfSiteTop5ByMonth(map);
    }

    /**
     * 到达站点TOP5
     */
    @Override
    public List<Map> getDdSiteTop5ByMonth(Map map) {
        return trainMapper.getDdSiteTop5ByMonth(map);
    }

    /**
     * 车次流量TOP5
     */
    @Override
    public List<Map> getTrainFlowRateTop5ByMonth(Map map) {
        return trainMapper.getTrainFlowRateTop5ByMonth(map);
    }
}
