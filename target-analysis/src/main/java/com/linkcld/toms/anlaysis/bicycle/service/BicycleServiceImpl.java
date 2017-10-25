package com.linkcld.toms.anlaysis.bicycle.service;

import com.linkcld.toms.common.bean.Bicycle;
import com.linkcld.toms.common.dao.IBicycleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/14.
 */
@Service("bicycleServiceImpl")
public class BicycleServiceImpl implements BicycleService {
    @Autowired
    private IBicycleMapper iBicycleMapper;

    public Bicycle selectOne(Bicycle bicycle){
        return iBicycleMapper.selectOne(bicycle);
    }
    @Override
    public List<Bicycle> selectAll(Bicycle bicycle){
        return iBicycleMapper.selectAll(bicycle);
    }
    @Override
    public List<Map> bicycleIndex(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = iBicycleMapper.bicycleIndexByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = iBicycleMapper.bicycleIndexByMonth(map);
        }else{//按天查询
            resultList = iBicycleMapper.bicycleIndexByDay(map);
        }
        return resultList;
    }

    /**
     * 查询自行车最难借，最难还数
     * @param map
     * @return
     */
    @Override
    public Map bicycleTop(Map map) {
        List<Map> resultList = new ArrayList<Map>(); //最难还
        List<Map> resultList1 = new ArrayList<Map>();//最难借
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = iBicycleMapper.bicycleTopByYear(map);
            resultList1 = iBicycleMapper.bicycleTopByYear1(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = iBicycleMapper.bicycleTopByMonth(map);
            resultList1 = iBicycleMapper.bicycleTopByMonth1(map);
        }else{//按天查询
            resultList = iBicycleMapper.bicycleTopByDay(map);
            resultList1 = iBicycleMapper.bicycleTopByDay1(map);
        }
        Map result = new HashMap();
        result.put("znj",resultList1);
        result.put("znh",resultList);
        return result;
    }

    /**
     * 查询自行车使用率(日展示当前月所有日，月展示当年年所有月数据)
     * @param map
     * @return
     */
    @Override
    public Map bicycleUseRate(Map map) {
        Map result = new HashMap();
        List<Map> resultListByMonth = new ArrayList<Map>();
        List<Map> resultListByDay = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        dateType = dateType.substring(0,6);//月时间
        map.put("dateType",dateType);
        resultListByDay = iBicycleMapper.bicycleUseRateByDay(map);
        dateType = dateType.substring(0,4);//年时间
        map.put("dateType",dateType);
        resultListByMonth = iBicycleMapper.bicycleUseRateByMonth(map);
        result.put("sylByDay",resultListByDay);
        result.put("sylByMonth",resultListByMonth);
        return result;
    }
}
