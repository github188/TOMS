package com.linkcld.toms.anlaysis.bus.web;

import com.linkcld.toms.anlaysis.bus.service.BusService;
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
@RequestMapping(value = "bus")
/**
 * 公交专题
 */

public class BusController {

    @Resource(name="busServiceImpl")
    private BusService busService;

    /**
     * 查询公交基础数据（线路，站点，车辆数）
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getBusDataBase")
    @ResponseBody
    public DataResult getBusDataBase(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = busService.getBusDataBase(map);
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
     * 查询公交基础数据（客流量 班次，车辆数）
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
            List<Map> result = busService.getCountFlows(map);
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
     * 查询公交数据（运行班次 运行速度，运行里程）
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getCountFlow2")
    @ResponseBody
    public DataResult getCountFlow2(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            Map result = busService.getCountFlow2(map);
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
     * 查询公交指标面板基本数据(线路总长度,线路平均长度,平均站距,500米覆盖率,300米覆盖率,标准)
     *@param request
     *@param response
     * */
    @RequestMapping("/getStaticData")
    @ResponseBody
    public DataResult getStaticData(HttpServletRequest request,
                                    HttpServletResponse response){
        DataResult dataResult = new DataResult();
        try {
            Map<String,String> result = busService.getStaticData();
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
     * 获取公交在线离线数据
     *@param request
     *@param response
     * */
    @RequestMapping("/getLineData")
    @ResponseBody
    public DataResult getLineData(HttpServletRequest request,
                                    HttpServletResponse response,@RequestParam Map<String,String> map){
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = busService.getLineData(map);
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
     * 获取公交
     *@param request
     *@param response
     * */
    @RequestMapping("/getBusLine")
    @ResponseBody
    public DataResult getBusLine(HttpServletRequest request,
                                  HttpServletResponse response,@RequestParam Map<String,String> map){
        DataResult dataResult = new DataResult();
        try {
            List<Map> result = busService.getBusLine(map);
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
     * 获取公交周，月客流量
     *@param request
     *@param response
     * */
    @RequestMapping("/getBusFlowByWeekAndMonth")
    @ResponseBody
    public DataResult getBusFlowByWeekAndMonth(HttpServletRequest request,
                                 HttpServletResponse response,@RequestParam Map<String,String> map){
        DataResult dataResult = new DataResult();
        try {
            Map result = busService.getBusFlowByWeekAndMonth(map);
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
