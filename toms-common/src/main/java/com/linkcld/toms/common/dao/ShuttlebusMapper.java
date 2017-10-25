package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface ShuttlebusMapper {
    List<Map> getCountByDay(Map map);
    List<Map> getCountByMonth(Map map);
    List<Map> getCountByYear(Map map);
    List<Map> getShuttleFlowByDay(Map map);
    List<Map> getShuttleFlowByMonth(Map map);
    List<Map> getShuttleFlowByYear(Map map);

    List<Map> getShuttleBusDataByDay(Map map);
    List<Map> getSiteFlowRateTop5ByMonth(Map map);
    List<Map> getPostFlowRateTop5ByMonth(Map map);
    List<Map> getPostSzlTop5ByMonth(Map map);

    List<Map> getSiteFslAndZzlByMonth(Map map);
    List<Map> getSiteFslAnalysisByMonth(Map map);
    List<Map> getEveryMonthFslByYear(Map map);
    List<Map> getRegionFslByYear(Map map);

    List<Map> getShiftBySite(Map map);

    List<Map> getShiftBySiteBy7Day(Map map);
    List<Map> getShiftBySiteByHour(Map map);

    List<Map> getAirportTerminalFlowInSeven(Map map);
    List<Map> getAirportTerminalFlowByHour(Map map);
    List<Map> getAirportTerminalFlow(Map map);


}
