package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface HighWayMapper {
    List<Map> getCountFlowByYear(Map map);
    List<Map> getCountFlowByMonth(Map map);
    List<Map> getCountFlowByDay(Map map);
    List<Map> getOutFlowMapByTrucks(Map map);
    List<Map> getInFlowMapByETC(Map map);
    List<Map> getFlowByDay(Map map);
    List<Map> getFlowByStation(Map map);
    List<Map> getTopFiveFlowByYear(Map map);
    List<Map> getFlowByMonth(Map map);
    List<Map> getBordInformation(Map map);
    List<Map> getTollStationData(Map map);
    List<Map> getTollStationFlowInSeven(Map map);
    List<Map> getStationFlowInSeven(Map map);
    List<Map> getTollStationDataByHour(Map map);
    List<Map> getStationSXFlowInSeven(Map map);
    List<Map> getNewestDataByHour(Map map);
}
