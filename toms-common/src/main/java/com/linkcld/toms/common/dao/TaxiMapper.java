package com.linkcld.toms.common.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Mapper
public interface TaxiMapper {
    List<Map> getOnlineByTaxi(Map map);
    List<Map> getOnlineByTaxi2ByDay(Map map);
    List<Map> getOnlineByTaxi2ByMonth(Map map);
    List<Map> getOnlineByTaxi2ByYear(Map map);
    Map TaxiUseRateByDay(Map map);
}
