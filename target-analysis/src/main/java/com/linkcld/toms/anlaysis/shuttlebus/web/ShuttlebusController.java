package com.linkcld.toms.anlaysis.shuttlebus.web;

import com.linkcld.toms.anlaysis.shuttlebus.service.ShuttlebusService;
import com.linkcld.toms.common.bean.DataResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "shuttleBus")
/**
 * 班车专题
 */

public class ShuttlebusController {

    @Resource(name="shuttlebusServiceImpl")
    private ShuttlebusService shuttlebusService;

    /**
     * 根据时间查询班车周转量/发送量（统计查询时间内）
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountShuttleBus")
    @ResponseBody
    public DataResult getCountShuttleBus(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getCountShuttlebus(map);
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
     * 根据时间查询班车客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShuttleFlow")
    @ResponseBody
    public DataResult getShuttleFlow(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getShuttleFlow(map);
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
     * 按天统计班车客运客流量、周转量、班次总量和本月客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShuttleBusDataByDay")
    @ResponseBody
    public DataResult getShuttleBusDataByDay(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getShuttleBusDataByDay(map);
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
     * 站点流量TOP5、班线流量TOP5、班线实载率TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTop5ByMonth")
    @ResponseBody
    public DataResult getTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getTop5ByMonth(map);
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
     * 站点流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getSiteFlowRateTop5ByMonth")
    @ResponseBody
    public DataResult getSiteFlowRateTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getSiteFlowRateTop5ByMonth(map);
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
     * 班线流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getPostFlowRateTop5ByMonth")
    @ResponseBody
    public DataResult getPostFlowRateTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getPostFlowRateTop5ByMonth(map);
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
     * 班线实载率TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getPostSzlTop5ByMonth")
    @ResponseBody
    public DataResult getPostSzlTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getPostSzlTop5ByMonth(map);
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
     * 月站点客流量/周转量、月站点客流量趋势分析
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getSiteFslAndZzlAnalysisByMonth")
    @ResponseBody
    public DataResult getSiteFslAndZzlAnalysisByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getSiteFslAndZzlAnalysisByMonth(map);
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
     * 月站点客流量/周转量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getSiteFslAndZzlByMonth")
    @ResponseBody
    public DataResult getSiteFslAndZzlByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getSiteFslAndZzlByMonth(map);
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
     * 月站点客流量趋势分析
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getSiteFslAnalysisByMonth")
    @ResponseBody
    public DataResult getSiteFslAnalysisByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getSiteFslAnalysisByMonth(map);
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
     * 每月客流量、区域年旅客客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getEveryMonthFslAndRegionFslByYear")
    @ResponseBody
    public DataResult getEveryMonthFslAndRegionFslByYear(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getEveryMonthFslAndRegionFslByYear(map);
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
     * 每月客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getEveryMonthFslByYear")
    @ResponseBody
    public DataResult getEveryMonthFslByYear(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getEveryMonthFslByYear(map);
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
     * 区域年旅客客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getRegionFslByYear")
    @ResponseBody
    public DataResult getRegionFslByYear(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getRegionFslByYear(map);
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
     * 查询当日班车站出发到达班次，发送量，得到每个站的数据
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShiftBySite")
    @ResponseBody
    public DataResult getShiftBySite(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getShiftBySite(map);
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
     * 查询近7日班车站出发到达班次,客流量（发送量）
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShiftBySiteBy7Day")
    @ResponseBody
    public DataResult getShiftBySiteBy7Day(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getShiftBySiteBy7Day(map);
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
     * 查询当天各时段班车站出发到达班次,客流量（发送量）
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShiftBySiteByHour")
    @ResponseBody
    public DataResult getShiftBySiteByHour(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getShiftBySiteByHour(map);
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
     * 查询航站楼当日客流量,班次
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getAirportTerminalFlow")
    @ResponseBody
    public DataResult getAirportTerminalFlow(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getAirportTerminalFlow(map);
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
     * 查询航站楼近7日信息
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getAirportTerminalFlowInSeven")
    @ResponseBody
    public DataResult getAirportTerminalFlowInSeven(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getAirportTerminalFlowInSeven(map);
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
     * 查询航站楼当日各时段详情
     * * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getAirportTerminalFlowByHour")
    @ResponseBody
    public DataResult getAirportTerminalFlowByHour(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map) {

        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shuttlebusService.getAirportTerminalFlowByHour(map);
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
