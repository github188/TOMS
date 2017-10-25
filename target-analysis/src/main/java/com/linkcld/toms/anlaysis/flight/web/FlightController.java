package com.linkcld.toms.anlaysis.flight.web;

import com.linkcld.toms.anlaysis.flight.service.FlightService;
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
@RequestMapping(value = "flight")
/**
 * 民航专题
 */

public class FlightController {

    @Resource(name="flightServiceImpl")
    private FlightService flightService;


    @RequestMapping("/getCountFlow")
    @ResponseBody
    public DataResult getCountFlow(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map
    ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = flightService.getCountFlow(map);
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
