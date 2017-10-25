package com.linkcld.toms.common.bean;

import java.util.Map;

/**
 * Created by Administrator on 2017/6/23.
 */
public class GetCodeLibrary {
    private static Map codeLibrary;

    public static Map getCodeLibrary() {
        return codeLibrary;
    }

    public static void setCodeLibrary(Map codeLibrary) {
        GetCodeLibrary.codeLibrary = codeLibrary;
    }
}
