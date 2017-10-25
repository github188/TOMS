package com.linkcld.toms.anlaysis.bicycle.service;




import com.linkcld.toms.common.bean.Bicycle;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016/9/19.
 */
public interface BicycleService{
    public Bicycle selectOne(Bicycle bicycle);
    public List<Bicycle> selectAll(Bicycle bicycle);
    /**
     * 查询当日自行车指标数据（可借数，可还数，站点数，使用率，车位数）
     * @return
     */
    public List<Map> bicycleIndex(Map map);

    public Map bicycleTop(Map map);

    public Map bicycleUseRate(Map map);

}
