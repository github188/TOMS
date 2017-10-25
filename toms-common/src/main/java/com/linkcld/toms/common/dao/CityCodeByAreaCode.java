package com.linkcld.toms.common.dao;

import com.linkcld.toms.common.bean.CityCode;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Created by Administrator on 2017/8/16.
 */
public interface CityCodeByAreaCode extends JpaRepository<CityCode,String> {

    /**
     * 根据areaCode 获取 geometry值
     * @return
     */
    CityCode findByCode(String code);
}
