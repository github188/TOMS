package com.linkcld.toms.anlaysis.shipEnterprise.web;

import com.linkcld.toms.anlaysis.shipEnterprise.service.ShipService;
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
@RequestMapping(value = "ship")
/**
 * 班车专题
 */

public class ShipController {

    @Resource(name="shipServiceImpl")
    private ShipService shipService;

    /**
     * 根据图层名查对应bgis库表数据
     * @param request
     * @param response
     * @param map
     * @return
     */
    @RequestMapping("/getShip")
    @ResponseBody
    public DataResult getShip(HttpServletRequest request, HttpServletResponse response, @RequestParam Map<String,String> map ) {
        DataResult dataResult = new DataResult();

        try {
            List<Map> result = shipService.getShip(map);
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
