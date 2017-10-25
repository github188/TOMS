package com.linkcld.toms.common.bean;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/9/13.
 */
public class DataResult<T> implements Serializable {
    public String getReturnFlag() {
        return returnFlag;
    }

    public void setReturnFlag(String returnFlag) {
        this.returnFlag = returnFlag;
    }

    public String getReturnInfo() {
        return returnInfo;
    }

    public void setReturnInfo(String returnInfo) {
        this.returnInfo = returnInfo;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    private String returnFlag;
    private String returnInfo;
    private T data;
    private String requestType;

    public DataResult() {
    }
}