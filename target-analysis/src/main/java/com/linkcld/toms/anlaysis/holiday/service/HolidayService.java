package com.linkcld.toms.anlaysis.holiday.service;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface HolidayService {
    List<Map> springFestivalFlowRateIndexPanel(Map map);

    List<Map> toDayUnimpededStatus(Map map);

    List<Map> FlowRateDistribution(Map map);
    List<Map> SiteFlowDistribution(Map map);
    List<Map> highWayFlowTop5(Map map);

    List<Map> springFestivalData(Map map) throws ParseException;
    List<Map> trainFlowRate(Map map) throws ParseException;
    List<Map> fightFlowRate(Map map);
    List<Map> suttleBusFlowRate(Map map) throws ParseException;
    List<Map> highWayFlowRate(Map map) throws ParseException;
    List<Map> trainLateNum(Map map) throws ParseException;
    List<Map> BusSpeed(Map map) throws ParseException;
    List<Map> taxiSzl(Map map) throws ParseException;
}
