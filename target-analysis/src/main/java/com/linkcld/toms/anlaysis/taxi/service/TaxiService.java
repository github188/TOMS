package com.linkcld.toms.anlaysis.taxi.service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
public interface TaxiService {
 public List<Map> getOnlineByTaxi(Map map);
 public List<Map> getOnlineByTaxi2(Map map);
 public List<Map> getFlowByTaxi(Map map);

}
