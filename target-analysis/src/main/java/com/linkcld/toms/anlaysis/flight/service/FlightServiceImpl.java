package com.linkcld.toms.anlaysis.flight.service;

import com.linkcld.toms.common.dao.FlightMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("flightServiceImpl")
public class FlightServiceImpl implements  FlightService{

    @Autowired
    private FlightMapper flightMapper;

    @Override
    public List<Map> getCountFlow(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = flightMapper.getCountByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = flightMapper.getCountByMonth(map);
        }else{//按天查询
            resultList = flightMapper.getCountByDay(map);
        }
        return resultList;
    }


}
