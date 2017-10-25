package com.linkcld.toms.anlaysis.train.web;


import com.linkcld.toms.anlaysis.train.service.TrainService;
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
@RequestMapping(value = "train")
/**
 * tie
 */

public class TrainController {

    @Resource(name="trainServiceImpl")
    private TrainService trainService;

    /**
     * 根据时间或站名查询火车站出发量和到达量(可以按年/月/日来查询)
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountTrain")
    @ResponseBody
    public DataResult getCountTrain(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = trainService.getCountTrain(map);
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
     * 站点最新数据
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getSiteData")
    @ResponseBody
    public DataResult getSiteData(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            Map result = trainService.getSiteData(map);
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
     * 近7日车站客流量走势
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/get7DayFlowRateAnalysis")
    @ResponseBody
    public DataResult get7DayFlowRateAnalysis(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.get7DayFlowRateAnalysis(map);
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
     * 车站当天各小时客流量走势
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/get24HourFlowRateAnalysis")
    @ResponseBody
    public DataResult get24HourFlowRateAnalysis(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.get24HourFlowRateAnalysis(map);
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
     * 查询火车站年/月/日的出发量、到达量和总量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getAllOutInByYearMonthDay")
    @ResponseBody
    public DataResult getAllOutInByYearMonthDay(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            Map result = trainService.getAllOutInByYearMonthDay(map);
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
     * 查询车型流量分布、车型流量占比
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTrainTypeFlowRate")
    @ResponseBody
    public DataResult getTrainTypeFlowRateByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getTrainTypeFlowRateByMonth(map);
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
     * 今日站点流量、每月客流量、节假日客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getDayMonthHolidayFlowRate")
    @ResponseBody
    public DataResult getDayMonthHolidayFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getDayMonthHolidayFlowRate(map);
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
     * 今日站点流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getDaySiteFlowRateByDay")
    @ResponseBody
    public DataResult getDaySiteFlowRateByDay(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getDaySiteFlowRateByDay(map);
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
    @RequestMapping("/getMonthFlowRateByMonth")
    @ResponseBody
    public DataResult getMonthFlowRateByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getMonthFlowRateByMonth(map);
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
     * 节假日客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getHolidayFlowRate")
    @ResponseBody
    public DataResult getHolidayFlowRate(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getHolidayFlowRate(map);
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
     * 本月每日客流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getMonthEveryDayFlowRateByDay")
    @ResponseBody
    public DataResult getMonthEveryDayFlowRateByDay(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getMonthEveryDayFlowRateByDay(map);
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
     * 出发站点TOP5、到达站点TOP5、车次流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTop5ByMonth")
    @ResponseBody
    public DataResult getTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getTop5ByMonth(map);
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
     * 出发站点TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCfSiteTop5ByMonth")
    @ResponseBody
    public DataResult getCfSiteTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getCfSiteTop5ByMonth(map);
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
     * 到达站点TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getDdSiteTop5ByMonth")
    @ResponseBody
    public DataResult getDdSiteTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getDdSiteTop5ByMonth(map);
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
     * 车次流量TOP5
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTrainFlowRateTop5ByMonth")
    @ResponseBody
    public DataResult getTrainFlowRateTop5ByMonth(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = trainService.getTrainFlowRateTop5ByMonth(map);
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
