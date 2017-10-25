package com.linkcld.toms.anlaysis.taxi.web;


import com.linkcld.toms.anlaysis.taxi.service.TaxiService;
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
@RequestMapping(value = "taxi")
/**
 * 出租车专题
 */

public class TaxiController {

    @Resource(name="taxiServiceImpl")
    private TaxiService taxiService;

    /**
     * 查询出租车网车辆总数，上线数，重车数，上线率，实载率
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getOnlineByTaxi")
    @ResponseBody
    public DataResult getCountFlow(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = taxiService.getOnlineByTaxi(map);
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
     * 查询出租车车辆营收，营运里程，营运趟次（用于echarts显示，日显示本月所有日数据，月显示本年所有月数据）
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getOnlineByTaxi2")
    @ResponseBody
    public DataResult getCountFlow2(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = taxiService.getOnlineByTaxi2(map);
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
     * 查询出租车平均营收，里程，趟次（返回查询时间的数据）  例如，查询的20170918  返回的是20170918当天的数据
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getFlowByTaxi")
    @ResponseBody
    public DataResult getFlowByTaxi(HttpServletRequest request,
                                    HttpServletResponse response,
                                    @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = taxiService.getFlowByTaxi(map);
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
