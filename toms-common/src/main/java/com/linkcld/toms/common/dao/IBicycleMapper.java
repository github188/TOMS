package com.linkcld.toms.common.dao;

import com.linkcld.toms.common.bean.Bicycle;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016/9/19.
 */
@Mapper
public interface IBicycleMapper {
    public Bicycle selectOne(Bicycle bicycle);
    public List<Bicycle> selectAll(Bicycle bicycle);
    /**
     * 查询当日自行车指标数据
     * @return
     */
    public List<Map> bicycleIndexByYear(Map map);
    public List<Map> bicycleIndexByMonth(Map map);
    public List<Map> bicycleIndexByDay(Map map);

    /**
     * 查询自行车最难还
     * @param map
     * @return
     */
    public List<Map> bicycleTopByYear(Map map);
    public List<Map> bicycleTopByMonth(Map map);
    public List<Map> bicycleTopByDay(Map map);

    /**
     * 最难借
     * @param map
     * @return
     */
    public List<Map> bicycleTopByYear1(Map map);
    public List<Map> bicycleTopByMonth1(Map map);
    public List<Map> bicycleTopByDay1(Map map);

    /**
     * 按时间查询自行车使用率
     * @param map
     * @return
     */
    public List<Map> bicycleUseRateByDay(Map map);
    public List<Map> bicycleUseRateByMonth(Map map);
    public Map bicycleUseRateByDay2(Map map);

}
