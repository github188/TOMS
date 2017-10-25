package com.linkcld.toms.anlaysis.time.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface TimeHandleService {
    public List<Map> getInDaysDetail(Integer days, String time, String dateType, List<Map> resultList, Map<String, Object> setMap);
    public List<Map> currentDay(List<Map> resultList,String time,Map<String,Object> setMap);
}
