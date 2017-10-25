package com.linkcld.toms.common.service;

import com.linkcld.toms.common.bean.CityCode;
import com.linkcld.toms.common.bean.CodeLibrary;
import com.linkcld.toms.common.bean.GetCodeLibrary;
import com.linkcld.toms.common.dao.CodeLibraryMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Administrator on 2017/6/23.
 */
@Service
public class CodeLibraryService {
    @Autowired
    private CodeLibraryMapper codeLibraryMapper;

    public Map<String, List<Map<String, Object>>> getInitCodeLibary(){
        //获取codeLibrary全部字段
        List codeList = codeLibraryMapper.selectCodeLibraryAll();
        ArrayList cityItemMap;
        Map mapdatas = null;
        if(codeList != null && !codeList.isEmpty()){
            mapdatas = new HashMap();
            cityItemMap = new ArrayList();
            HashMap itemIdx = null;
            String cityCodes = null;
            Iterator map = codeList.iterator();
            //开始迭代
            while (map.hasNext()){
                CodeLibrary itemMap = (CodeLibrary)map.next();
                itemIdx = new HashMap();
                if(StringUtils.isNotEmpty(itemMap.getPvalue())){
                    if(cityCodes != null && !itemMap.getPvalue().equals(cityCodes)){
                        mapdatas.put(cityCodes, cityItemMap);
                        cityItemMap = new ArrayList();
                    }

                    itemIdx.put("code", itemMap.getCodeValue());
                    itemIdx.put("text", itemMap.getCodeText());
                    cityItemMap.add(itemIdx);
                    cityCodes = itemMap.getPvalue();
                    if(!map.hasNext()){
                        mapdatas.put(cityCodes, cityItemMap);
                        cityItemMap = new ArrayList();
                    }
                }
            }

        }

        List cityCodesList = codeLibraryMapper.selectCityCode();
        if(cityCodesList != null && !cityCodesList.isEmpty()) {
            cityItemMap = new ArrayList();
            Iterator cityCode = cityCodesList.iterator();

            while(cityCode.hasNext()) {
                Map map1 = (Map)cityCode.next();
                HashMap itemMap1 = new HashMap();
                if(StringUtils.isNotBlank(map1.get("NAME").toString()) && StringUtils.isNotBlank(map1.get("CODE").toString())) {
                    itemMap1.put("code", map1.get("CODE"));
                    itemMap1.put("text", map1.get("NAME"));
                    cityItemMap.add(itemMap1);
                }
            }

            if(!cityItemMap.isEmpty()) {
                mapdatas.put("regionCode", cityItemMap);
            }
        }
        GetCodeLibrary.setCodeLibrary(mapdatas);
        return mapdatas;
    }

    public List<CityCode> getCityCode(CityCode cityCode){
        List<CityCode> result = codeLibraryMapper.getCityCode(cityCode);

        if(result == null || result.size() <= 0) return new ArrayList<CityCode>();

        if(2 == cityCode.getCode().length()){
            List<CityCode> returnList = new ArrayList<>();
            CityCode OnlyCityCode;
            for(int i = 0; i < result.size(); i++){
                OnlyCityCode = new CityCode();

                if(result.get(i).getPcode().equals(cityCode.getCode()+"0000")
                        && !(result.get(i).getPcode().equals(result.get(i).getCode()))){
                    OnlyCityCode = result.get(i);
                    returnList.add(OnlyCityCode);
                }
            }
            return returnList;
        }else{
            for(int i = 0; i < result.size(); i++){
                if(result.get(i).getCode().equals(cityCode.getCode()+"00")){
                    result.remove(result.get(i));
                }
            }
            return result;
        }
    }
}
