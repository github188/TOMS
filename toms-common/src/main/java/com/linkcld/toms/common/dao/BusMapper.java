package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface BusMapper {
    /**
     * 得到公交线路，站点数
     * @param map
     * @return
     */
    List<Map> getBusDataBase(Map map);

    /**
     * 得到公交车辆数
     * @param map
     * @return
     */
    List<Map> getBusCar(Map map);

    List<Map> getCountFlowByDay(Map map);
    List<Map> getCountFlowByMonth(Map map);
    List<Map> getCountFlowByYear(Map map);

    List<Map> getBusYsByYear(Map map);
    List<Map> getBusYsByMonth(Map map);
    List<Map> getBusYsByDay(Map map);

    List<Map> getSpeedByDay(Map map);
    List<Map> getSpeedByMonth(Map map);
    List<Map> getShiftAndMileageByDay(Map map);
    List<Map> getShiftAndMileageByMonth(Map map);
    Map<String,String> getStaticData();

    List<Map> getFlowByWeek(Map map);
    List<Map> getFlowByNowMonth(Map map);
    /**
     * 根据车牌号查询车辆路线信息
     * @param map
     * @return
     */
    List<Map> getBusLine(Map map);
    Map busSpeedByDay(Map map);
}
