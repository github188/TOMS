package com.linkcld.toms.anlaysis.bicycle.web;

import com.linkcld.toms.anlaysis.bicycle.service.BicycleService;
import com.linkcld.toms.common.bean.Bicycle;
import com.linkcld.toms.common.bean.DataResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping(value = "bike")
public class BicycleController {
    private Logger logger = LoggerFactory.getLogger(BicycleController.class);

    @Resource(name="bicycleServiceImpl")
    private BicycleService bicycleService;

    @RequestMapping("/getAllBicycleStationInfo")
    @ResponseBody
    public DataResult findBicycleStationInfo(HttpServletRequest request,
                                             HttpServletResponse response,
                                             @RequestParam Map<String,String> map,
                                             Bicycle bicycle
                                                      ) {
        DataResult restfulResult=new DataResult();
        try {
            List<Bicycle> list = bicycleService.selectAll(bicycle);
            if (list.size() > 0) {
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询成功，发现匹配数据!");
                restfulResult.setData(list);
            } else {
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询成功，发现匹配数据!");
                restfulResult.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            restfulResult.setReturnFlag("-1");
            restfulResult.setReturnInfo("查询失败，程序执行错误!");
            return restfulResult;
        }
        return restfulResult;
    }


    @RequestMapping("/getBicycleStationInfo")
    @ResponseBody
    public DataResult findBicycleStationInfoById(HttpServletRequest request,
                                                    HttpServletResponse response,
                                                    @RequestParam Map<String,String> map,
                                                    Bicycle bicycle) {
        DataResult restfulResult=new DataResult();
        List<Bicycle> list=new ArrayList<Bicycle>();
        try {
            Object bicycle1 = bicycleService.selectOne(bicycle);
            if(bicycle1!=null){
                list.add((Bicycle) bicycle1);
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询成功，发现匹配数据!");
                restfulResult.setData(list);
            }else{
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询成功，发现匹配数据!");
                restfulResult.setData(null);
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            restfulResult.setReturnFlag("0");
            restfulResult.setReturnInfo("查询失败，程序执行错误!");
            return restfulResult;
        }
        return restfulResult;
    }


    /**
     * 查询当日自行车指标分析数据
     * @param request
     * @param response
     * @param map
     * @param bicycle
     * @return
     */
    @RequestMapping("/bicycleIndex")
    @ResponseBody
    public DataResult bicycleIndex(HttpServletRequest request,
                                      HttpServletResponse response,
                                      @RequestParam Map<String,String> map,
                                      Bicycle bicycle) {
        DataResult restfulResult=new DataResult();
        try {
            List<Map> result = bicycleService.bicycleIndex(map);
            if(result!=null){
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(result);
                restfulResult.setRequestType("post");
            }else{
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(null);
                restfulResult.setRequestType("post");
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            restfulResult.setReturnFlag("0");
            restfulResult.setReturnInfo("查询当日自行车指标分析数据失败,"+e);
            return restfulResult;
        }
        return restfulResult;
    }

    /**
     * 查询当日自行车最难借难还站点top
     * @param request
     * @param response
     * @param map
     * @param bicycle
     * @return
     */
    @RequestMapping("/bicycleTops")
    @ResponseBody
    public DataResult bicycleTop(HttpServletRequest request,
                                   HttpServletResponse response,
                                   @RequestParam Map<String,String> map,
                                   Bicycle bicycle) {
        DataResult restfulResult=new DataResult();
        Map result = new HashMap();
        try {
            result = bicycleService.bicycleTop(map);
            if(result!=null){
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(result);
                restfulResult.setRequestType("post");
            }else{
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(null);
                restfulResult.setRequestType("post");
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            restfulResult.setReturnFlag("0");
            restfulResult.setReturnInfo("查询当日自行车指标分析数据失败,"+e);
            return restfulResult;
        }
        return restfulResult;
    }

    /**
     * 查询自行车日月的平均使用率
     * @param request
     * @param response
     * @param map
     * @param bicycle
     * @return
     */
    @RequestMapping("/bicycleUseRate")
    @ResponseBody
    public DataResult bicycleUseRate(HttpServletRequest request,
                                 HttpServletResponse response,
                                 @RequestParam Map<String,String> map,
                                 Bicycle bicycle) {
        DataResult restfulResult=new DataResult();
        try {
            Map result = bicycleService.bicycleUseRate(map);
            if(result!=null){
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(result);
                restfulResult.setRequestType("post");
            }else{
                restfulResult.setReturnFlag("1");
                restfulResult.setReturnInfo("查询当日自行车指标分析数据成功，发现匹配数据!");
                restfulResult.setData(null);
                restfulResult.setRequestType("post");
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            restfulResult.setReturnFlag("0");
            restfulResult.setReturnInfo("查询当日自行车指标分析数据失败,"+e);
            return restfulResult;
        }
        return restfulResult;
    }

}
