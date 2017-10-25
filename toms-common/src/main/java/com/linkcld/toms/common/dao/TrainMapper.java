package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface TrainMapper {
    List<Map> getCountByDay(Map map);
    List<Map> getCountByMonth(Map map);
    List<Map> getCountByYear(Map map);
    List<Map> getCountByDayNew(Map map);
    List<Map> getCountByDayNew1(Map map);

    Map getFlowRateByDay(Map map);
    Map getSiteData(Map map);
    String newDataDate(Map map);
    List<Map> get7DayFlowRateAnalysis(Map map);
    List<Map> get24HourFlowRateAnalysis(Map map);
    Map getAllOutInByYearMonthDay(Map map);
    List<Map> getTrainTypeFlowRateByMonth(Map map);
    List<Map> getDaySiteFlowRateByDay(Map map);
    List<Map> getMonthFlowRateByMonth(Map map);
    List<Map> getHolidayFlowRate(Map map);
    List<Map> getMonthEveryDayFlowRateByDay(Map map);
    List<Map> getCfSiteTop5ByMonth(Map map);
    List<Map> getDdSiteTop5ByMonth(Map map);
    List<Map> getTrainFlowRateTop5ByMonth(Map map);



}
