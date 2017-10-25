package com.linkcld.toms.common.bean;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 周育玺
 * @version V1.0
 * @Description:代码表内存中静态类
 * @Encode:UTF-8
 * @date 2016/3/23 17:46
 */
public class CodeLibraryMemory {
    /**
     * 代码表内容
     */
    public static final Map<String,List<Map<String,Object>>> codeLibrary = new HashMap<String, List<Map<String, Object>>>();

    public static void setCodeLibrary(Map<String,List<Map<String,Object>>> data){
        codeLibrary.putAll(data);
    }


}
