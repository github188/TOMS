package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface FlightMapper {
    List<Map> getCountByDay(Map map);
    List<Map> getCountByMonth(Map map);
    List<Map> getCountByYear(Map map);
}
