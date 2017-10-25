package com.linkcld.toms.anlaysis.taxi.service;

import com.linkcld.toms.common.dao.TaxiMapper;
import org.apache.poi.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/12.
 */
@Service("taxiServiceImpl")
public class TaxiServiceImpl implements  TaxiService{

    @Autowired
    private TaxiMapper taxiMapper;

    @Override
    public List<Map> getOnlineByTaxi(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        List<Map> dataList = new ArrayList<Map>();
        Map maps = new HashMap();
        String area_code = String.valueOf(map.get("areaCode"));
        area_code = getCode(area_code);
        map.put("areaCode",area_code);
            resultList = taxiMapper.getOnlineByTaxi(map);
            int zl = 0;//总数
            int sxCount = 0;//上线数
            int szCount = 0;//实载数
            int zcCount = 0;//重车数
            int ccCount = 0;//空车数
            double sxl = 0L;//上线率
            double szl=0L;//实载率
            if(resultList!=null){
                zl = resultList.size();
                for(int i=0;i<resultList.size();i++){
                    String online_status = String.valueOf(resultList.get(i).get("ONLINE_STATUS"));
                    String vehicle_status = String.valueOf(resultList.get(i).get("VEHICLE_STATUS"));
                    if("1".equals(online_status)){
                        sxCount++;
                    }
                    if("1".equals(vehicle_status)){
                        zcCount++;
                    }
                    if("0".equals(vehicle_status)){
                        ccCount++;
                    }
                    if("1".equals(online_status)&&"1".equals(vehicle_status)){
                        szCount++;
                    }
                }
                if (sxCount!=0) {
                    sxl =(double)sxCount/zl;
                    BigDecimal b = new BigDecimal(sxl);
                    sxl = b.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();

                    szl = (double) szCount/sxCount;
                    BigDecimal b1 = new BigDecimal(szl);
                    szl = b1.setScale(2,BigDecimal.ROUND_HALF_UP).doubleValue();
                }
            }
        maps.put("zl",zl);
        maps.put("sxl",sxl);
        maps.put("szl",szl);
        maps.put("sxCount",sxCount);
        maps.put("zcCount",zcCount);
        maps.put("ccCount",ccCount);
        dataList.add(maps);
        return dataList;
    }

    /**
     * 查询出租车平均营收，里程，趟次（返回查询时间所在月（年）的数据）例如：查询时间是20170918 返回的是201709月的所有天数据
     * @param map
     * @return
     */
    @Override
    public List<Map> getOnlineByTaxi2(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询

        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            dateType = dateType.substring(0,4);
            map.put("dateType",dateType);
            resultList = taxiMapper.getOnlineByTaxi2ByMonth(map);
        }else{//按天查询
            dateType = dateType.substring(0,6);
            map.put("dateType",dateType);
            resultList = taxiMapper.getOnlineByTaxi2ByDay(map);
        }
        return resultList;
    }

    /**
     * 查询出租车平均营收，里程，趟次（返回查询时间的数据）  例如，查询的20170918  返回的是20170918当天的数据
     * @param map
     * @return
     */
    @Override
    public List<Map> getFlowByTaxi(Map map) {
        List<Map> resultList = new ArrayList<Map>();
        String dateType = map.get("dateType").toString();
        if (dateType.length()<=4){ //按年份查询
            resultList = taxiMapper.getOnlineByTaxi2ByYear(map);
        }else if(dateType.length()>4&&dateType.length()<=6){//按月份查询
            resultList = taxiMapper.getOnlineByTaxi2ByMonth(map);
        }else{//按天查询
            resultList = taxiMapper.getOnlineByTaxi2ByDay(map);
        }
        return resultList;
    }


    public static String getCode(String areaCode){
        String code ="";
            if (areaCode.indexOf("00") > 0) {
                code = areaCode.replace("00", "");
            } else if (areaCode.indexOf("0000") > 0) {
                code = areaCode.replace("0000", "");
            }else{
                code =  areaCode;
            }
        return code;
    }
}
