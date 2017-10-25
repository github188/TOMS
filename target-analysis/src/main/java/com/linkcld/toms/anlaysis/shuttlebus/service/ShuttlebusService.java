package com.linkcld.toms.anlaysis.shuttlebus.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface ShuttlebusService {
    public List<Map> getCountShuttlebus(Map map);
    public List<Map> getShuttleFlow(Map map);

    public List<Map> getShuttleBusDataByDay(Map map);

    public List<Map> getTop5ByMonth(Map map);
    public List<Map> getSiteFlowRateTop5ByMonth(Map map);
    public List<Map> getPostFlowRateTop5ByMonth(Map map);
    public List<Map> getPostSzlTop5ByMonth(Map map);

    public List<Map> getSiteFslAndZzlAnalysisByMonth(Map map);
    public List<Map> getSiteFslAndZzlByMonth(Map map);
    public List<Map> getSiteFslAnalysisByMonth(Map map);

    public List<Map> getEveryMonthFslAndRegionFslByYear(Map map);
    public List<Map> getEveryMonthFslByYear(Map map);
    public List<Map> getRegionFslByYear(Map map);

    public List<Map> getShiftBySite(Map map);

    public List<Map> getShiftBySiteBy7Day(Map map);

    public List<Map> getShiftBySiteByHour(Map map);

    public List<Map> getAirportTerminalFlowInSeven(Map map);
    public List<Map> getAirportTerminalFlowByHour(Map map);
    public List<Map> getAirportTerminalFlow(Map map);



}
