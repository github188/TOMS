package com.linkcld.toms.anlaysis.train.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface TrainService {
    public List<Map> getCountTrain(Map map);

    public Map getSiteData(Map map);
    public List<Map> get7DayFlowRateAnalysis(Map map);
    public List<Map> get24HourFlowRateAnalysis(Map map);

    public Map getAllOutInByYearMonthDay(Map map);
    public List<Map> getTrainTypeFlowRateByMonth(Map map);

    public List<Map> getDayMonthHolidayFlowRate(Map map);
    public List<Map> getDaySiteFlowRateByDay(Map map);
    public List<Map> getMonthFlowRateByMonth(Map map);
    public List<Map> getHolidayFlowRate(Map map);

    public List<Map> getMonthEveryDayFlowRateByDay(Map map);

    public List<Map> getTop5ByMonth(Map map);
    public List<Map> getCfSiteTop5ByMonth(Map map);
    public List<Map> getDdSiteTop5ByMonth(Map map);
    public List<Map> getTrainFlowRateTop5ByMonth(Map map);

}
