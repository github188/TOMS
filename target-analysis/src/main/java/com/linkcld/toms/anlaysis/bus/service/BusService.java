package com.linkcld.toms.anlaysis.bus.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface BusService {
 public List<Map> getBusDataBase(Map map);
 public List<Map> getCountFlows(Map map);
 public Map getCountFlow2(Map map);
 public Map getStaticData();
 public List<Map> getLineData(Map map);
 public List<Map> getBusLine(Map map);
 public Map getBusFlowByWeekAndMonth(Map map);
}
