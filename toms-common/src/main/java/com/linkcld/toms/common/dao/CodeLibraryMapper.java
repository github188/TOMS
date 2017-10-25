package com.linkcld.toms.common.dao;

import com.linkcld.toms.common.bean.CityCode;
import com.linkcld.toms.common.bean.CodeLibrary;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/6/23.
 */
@Mapper
public interface CodeLibraryMapper {

    List<CodeLibrary> selectCodeLibraryAll();

    List<Map<String,Object>> selectCityCode();

    List<CityCode> getCityCode(CityCode cityCode);
}
