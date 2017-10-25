package com.linkcld.toms.anlaysis.time.service;


import com.linkcld.toms.common.dao.HighWayMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 处理时间周期的公共类,例如:近7日详情,当天24小时流量详情
 */
@Service("timeHandleServiceImpl")
public class TimeHandleServiceImpl implements TimeHandleService {
    /**
     * @param days       显示近几天的数据
     * @param time       数据库显示时间的字段名称
     * @param dateType   当前时间,格式为20171011
     * @param resultList 数据库查询结果
     * @param setMap     要赋值为0的字段,如(字段名,0),,多个组成一个map
     * @return
     */
    public List<Map> getInDaysDetail(Integer days, String time, String dateType, List<Map> resultList, Map<String, Object> setMap) {
        List<String> dateList = new ArrayList<>();
        Calendar cl = Calendar.getInstance();
        SimpleDateFormat df=new SimpleDateFormat("yyyyMMdd");
        Date utilDate = null;
        try {
            utilDate = df.parse(dateType);
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (int i = 0; i <days ; i++) {
                String date = df.format(new Date(utilDate.getTime()-(6-i)* 24 * 60 * 60 * 1000)).substring(4);
            dateList.add(date);
        }

        //返回的list
        List<Map> result = new ArrayList<>();
        //循环近7日日期
        for (int i = 0; i < dateList.size(); i++) {
            String date = dateList.get(i);
            //标识
            boolean isHash = false;
            //循环查询出来的近7日数据
            for (int j = 0; j < resultList.size(); j++) { //循环数据，看是否存在数组内的小时map
                Map dataMap = resultList.get(j);
                //拿到当前时间
                String dateTime = String.valueOf(dataMap.get(time));
                //如果当前时间和外层近7日数据日期相等,表示数据存在
                if (date.equals(dateTime)) {
                    result.add(dataMap);
                    isHash = true;
                }
            }
            //如果外层时间不存在数据,那么就赋值为0
            if (!isHash) {
                Map dataMap = new HashMap();
                for (Map.Entry<String, Object> entry : setMap.entrySet()) {
                    dataMap.put(entry.getKey(), entry.getValue());
                }
                //单独设置时间
                dataMap.put(time, date);
                result.add(dataMap);
            }
        }
        return result;
    }

    /**
     * @param resultList 查询出的resultList
     * @param time       数据库时间的字段名称
     * @param setMap     要赋值为0的字段,如(字段名,0),,多个组成一个map
     * @return
     */
    @Override
    public List<Map> currentDay(List<Map> resultList, String time, Map<String, Object> setMap) {
        List<Map> result = new ArrayList<Map>();
        String[] dayHours = {"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"};//24小时数据
        for (int i = 0; i < dayHours.length; i++) {
            String timeHour = dayHours[i];
            boolean isHash = false;
            for (int j = 0; j < resultList.size(); j++) { //循环数据，看是否存在数组内的小时map
                Map dataMap = resultList.get(j);
                String dataHour = String.valueOf(dataMap.get(time));
                if (dataHour.equals(timeHour)) {
                    result.add(dataMap);
                    isHash = true;
                }
            }
            if (!isHash) {
                Map dataMap = new HashMap();
                for (Map.Entry<String, Object> entry : setMap.entrySet()) {
                    dataMap.put(entry.getKey(), entry.getValue());
                }
                dataMap.put(time, timeHour);
                result.add(dataMap);
            }
        }
        return result;
    }

}
