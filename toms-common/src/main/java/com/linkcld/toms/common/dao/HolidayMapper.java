package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface HolidayMapper {
    List<Map> SiteFlowDistribution(Map map);
    List<Map> highWayFlowTop5(Map map);
    List<Map> trainFlowRate(Map map);
    List<Map> fightFlowRate(Map map);
    List<Map> suttleBusFlowRate(Map map);
    List<Map> highWayFlowRate(Map map);
    List<Map> trainLateNum(Map map);
    List<Map> BusSpeed(Map map);
    List<Map> taxiSzl(Map map);
}
