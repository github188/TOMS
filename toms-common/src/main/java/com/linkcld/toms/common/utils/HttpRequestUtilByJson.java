package com.linkcld.toms.common.utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import java.io.IOException;

/**
 * Created by Administrator on 2017/7/24.
 */
public class HttpRequestUtilByJson {
     private static final Logger log = LogManager.getLogger(HttpRequestUtilByJson.class);

    public static String httpPost(String path, JSONObject params, String encoding)
            throws ClientProtocolException, IOException {

        log.info(path+" -- path");
        HttpPost httpPost = new HttpPost(path);
        CloseableHttpClient client = HttpClients.createDefault();
        //设置请求和传输超时时间
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(10000).setConnectTimeout(10000).build();
        httpPost.setConfig(requestConfig);

        String respContent = null;

        StringEntity entity = new StringEntity(params.toString(), "utf-8");//解决中文乱码问题
        entity.setContentEncoding("UTF-8");
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
        log.info(httpPost + " -- httpPost");

        try {
            HttpResponse resp = client.execute(httpPost);
            System.out.println(resp);
            if (resp.getStatusLine().getStatusCode() == 200) {
                HttpEntity he = resp.getEntity();
                respContent = EntityUtils.toString(he, "UTF-8");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return respContent;
    }
}
