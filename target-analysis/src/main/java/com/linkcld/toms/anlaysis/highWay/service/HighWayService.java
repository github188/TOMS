package com.linkcld.toms.anlaysis.highWay.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface HighWayService {
 public List<Map> getCountFlow(Map map);
 public List<Map> getFlowPercentage(Map map);
 public List<Map> getCountFlowByDay(Map map);
 public List<Map> getCountFlowAvgDay(Map map);
 public List<Map> getBoardInformation(Map map);
 public List<Map> getStationFlowInSeven(Map map);
 public List<Map> getTollStationFlow(Map map);
 public List<Map> getTollStationFlowInSeven(Map map);
 public List<Map> getTollStationDataByHour(Map map);
 public List<Map> getStationSXFlowInSeven(Map map);
}
