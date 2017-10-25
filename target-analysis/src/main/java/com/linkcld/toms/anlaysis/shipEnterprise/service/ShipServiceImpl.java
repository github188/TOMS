package com.linkcld.toms.anlaysis.shipEnterprise.service;

import com.linkcld.toms.common.dao.ShipMapper;
import com.linkcld.toms.common.dao.ShuttlebusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 船舶企业
 * Created by Administrator on 2017/10/9.
 */
@Service("shipServiceImpl")
public class ShipServiceImpl implements ShipService {

    @Autowired
    private ShipMapper shipMapper;
    @Override
    public List<Map> getShip(Map map) {
        String layerName = map.get("layerName").toString();
        map.put("layerName","S_"+layerName);
        return shipMapper.getShipAll(map);
    }
}
