package com.linkcld.toms.anlaysis.holiday.web;

import com.linkcld.toms.anlaysis.holiday.service.HolidayService;
import com.linkcld.toms.common.bean.DataResult;
import com.linkcld.toms.common.utils.CalendarUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "holiday")
public class HolidayController {
    @Resource(name="holidayServiceImpl")
    private HolidayService holidayService;

    /**
     * 客流量指标面板(铁路、客运、高速)
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/springFestivalFlowRateIndexPanel")
    @ResponseBody
    public DataResult springFestivalFlowRateIndexPanel(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();
        //map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
        try {
            List<Map> result = holidayService.springFestivalFlowRateIndexPanel(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 日运输畅通情况（公交日运行速率、出租车日实载率、自行车日使用率）
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/toDayUnimpededStatus")
    @ResponseBody
    public DataResult toDayUnimpededStatus(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();
        //map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
        try {
            List<Map> result = holidayService.toDayUnimpededStatus(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 铁路站点流量分布、客运站点流量分布、高速收费站流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/FlowRateDistribution")
    @ResponseBody
    public DataResult FlowRateDistribution(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();
        //map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
        try {
            List<Map> result = holidayService.FlowRateDistribution(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 客运站点流量分布
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/SiteFlowDistribution")
    @ResponseBody
    public DataResult SiteFlowDistribution(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();
        //map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
        try {
            List<Map> result = holidayService.SiteFlowDistribution(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 高速收费站流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/highWayFlowTop5")
    @ResponseBody
    public DataResult highWayFlowTop5(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();
        //map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
        try {
            List<Map> result = holidayService.highWayFlowTop5(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 铁路客运量、班车客运量、高速车流量、列车晚点数、公交运行速率、出租车实载率
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/springFestivalData")
    @ResponseBody
    public DataResult springFestivalData(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.springFestivalData(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 铁路客运量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/trainFlowRate")
    @ResponseBody
    public DataResult trainFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.trainFlowRate(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 民航客运量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/fightFlowRate")
    @ResponseBody
    public DataResult fightFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.fightFlowRate(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 班车客运量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/suttleBusFlowRate")
    @ResponseBody
    public DataResult suttleBusFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.suttleBusFlowRate(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 高速车流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/highWayFlowRate")
    @ResponseBody
    public DataResult highWayFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.highWayFlowRate(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 列车晚点数
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/trainLateNum")
    @ResponseBody
    public DataResult trainLateNum(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.trainLateNum(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 公交运行速率
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/BusSpeed")
    @ResponseBody
    public DataResult BusSpeed(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.BusSpeed(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }

    /**
     * 出租车实载率
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/taxiSzl")
    @ResponseBody
    public DataResult taxiSzl(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) throws Exception {
        DataResult dataResult = new DataResult();

        Calendar cal = Calendar.getInstance();
        String yearStr = String.valueOf(cal.get(Calendar.YEAR));
        String pastYearStr = String.valueOf(cal.get(Calendar.YEAR)-1);

        map.put("dateTypeLastYear",pastYearStr+map.get("dateType"));
        map.put("dateType",yearStr+map.get("dateType"));

        if("true".equals(map.get("format"))){
            map.put("dateType",CalendarUtil.lunarToSolar(map.get("dateType")));
            map.put("dateTypeLastYear",CalendarUtil.lunarToSolar(map.get("dateTypeLastYear")));
        }
        try {
            List<Map> result = holidayService.taxiSzl(map);
            dataResult.setData(result);
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("1");
            dataResult.setReturnInfo("数据查询成功");
            return dataResult;
        } catch (Exception e) {
            e.printStackTrace();
            dataResult.setRequestType("post");
            dataResult.setReturnFlag("0");
            dataResult.setReturnInfo("数据查询失败。"+e);
            return dataResult;
        }
    }
}
