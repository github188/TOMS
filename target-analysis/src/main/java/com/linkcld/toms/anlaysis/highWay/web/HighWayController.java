package com.linkcld.toms.anlaysis.highWay.web;


import com.linkcld.toms.anlaysis.highWay.service.HighWayService;
import com.linkcld.toms.common.bean.DataResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "highWay")
/**
 * 高速专题
 */

public class HighWayController {

    @Resource(name="highWayServiceImpl")
    private HighWayService highWayService;


    /**
     * 根据年月日查询站口的出口,入口,总流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountFlow")
    @ResponseBody
    public DataResult getCountFlow(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
                                                      ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有年,月,日三个记录,map对应具体的出口,入口,总流量
            List<Map> result = highWayService.getCountFlow(map);
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
     * 根据年月查询入口ETC,非ETC流量百分比和查询出口货车,客车流量百分比
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getFlowPercentage")
    @ResponseBody
    public DataResult getCountFlow1(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有入口:ETC和非ETC和出口:货车和客车数据
            List<Map> result = highWayService.getFlowPercentage(map);
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
     *查询当月每天的入口,出口,总流量和当月每个站点日平均入口,出口,总流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountFlowByDay")
    @ResponseBody
    public DataResult getCountFlow2(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list包含当月每天的入口,出口,总流量和当月每个站点日平均入口,出口,总流量两个map
            List<Map> result = highWayService.getCountFlowByDay(map);
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
     * 查询当年每月的日均流量和当年流量top5的数据
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountFlowAvgDay")
    @ResponseBody
    public DataResult getCountFlow3(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getCountFlowAvgDay(map);
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
     * 查询高速情报板的信息
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getBoardInformation")
    @ResponseBody
    public DataResult getBoardInformation(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getBoardInformation(map);
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
     * 查询交调站近7日小型车/中型车/重型车/总流量走势图
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getStationFlowInSeven")
    @ResponseBody
    public DataResult getStationFlowInSeven(HttpServletRequest request,
                                     HttpServletResponse response,
                                     @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getStationFlowInSeven(map);
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
     * 查询收费站当前入口出口流量信息的详情
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTollStationFlow")
    @ResponseBody
    public DataResult getTollStationFlow(HttpServletRequest request,
                                     HttpServletResponse response,
                                     @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getTollStationFlow(map);
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
     * 查询近七日收费站流量
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTollStationFlowInSeven")
    @ResponseBody
    public DataResult getTollStationData(HttpServletRequest request,
                                         HttpServletResponse response,
                                         @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getTollStationFlowInSeven(map);
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
     * 查询当日各时段详情
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getTollStationDataByHour")
    @ResponseBody
    public DataResult getTollStationDataByHour(HttpServletRequest request,
                                         HttpServletResponse response,
                                         @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getTollStationDataByHour(map);
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

    @RequestMapping("/getStationSXFlowInSeven")
    @ResponseBody
    public DataResult getStationSXFlowInSeven(HttpServletRequest request,
                                               HttpServletResponse response,
                                               @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            //list中有每日车流量和非ETC和收费站日均流量
            List<Map> result = highWayService.getStationSXFlowInSeven(map);
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
