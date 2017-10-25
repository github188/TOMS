package com.linkcld.toms.common.utils;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CookieStore;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.PoolingClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.params.HttpParams;
import org.apache.http.params.HttpProtocolParams;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by shilz on 2016/11/21.
 */
public class HttpRequestUtil {
    private static Logger logger = Logger.getLogger(HttpRequestUtil.class);
    private final static int BUFFER = 1024;
    public static String sessionId = "";// 访问服务器的通行证sessionId

    /**
     * 适合多线程的HttpClient,用httpClient4.2.1实现
     *
     * @return DefaultHttpClient
     */
    public static DefaultHttpClient getHttpClient() {
        // 设置组件参数, HTTP协议的版本,1.1/1.0/0.9
        HttpParams params = new BasicHttpParams();
        HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
        HttpProtocolParams.setUserAgent(params, "HttpComponents/1.1");
        HttpProtocolParams.setUseExpectContinue(params, true);

        // 设置连接超时时间
        int REQUEST_TIMEOUT = 10 * 1000; // 设置请求超时10秒钟
        int SO_TIMEOUT = 60 * 1000; // 设置等待数据超时时间10秒钟
        // HttpConnectionParams.setConnectionTimeout(params, REQUEST_TIMEOUT);
        // HttpConnectionParams.setSoTimeout(params, SO_TIMEOUT);
        params.setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, REQUEST_TIMEOUT);
        params.setParameter(CoreConnectionPNames.SO_TIMEOUT, SO_TIMEOUT);

        // 设置访问协议
        SchemeRegistry schreg = new SchemeRegistry();
        schreg.register(new Scheme("http", 80, PlainSocketFactory.getSocketFactory()));

        // 多连接的线程安全的管理器
        PoolingClientConnectionManager pccm = new PoolingClientConnectionManager(schreg);
        pccm.setDefaultMaxPerRoute(20); // 每个主机的最大并行链接数
        pccm.setMaxTotal(100); // 客户端总并行链接最大数

        DefaultHttpClient httpClient = new DefaultHttpClient(pccm, params);
        return httpClient;
    }





    /**
     * 组装请求头
     *
     * @param params
     * @return
     */
    public static Header[] buildHeader(Map<String, String> params) {
        Header[] headers = null;
        if (params != null && params.size() > 0) {
            headers = new BasicHeader[params.size()];
            int i = 0;
            for (Map.Entry<String, String> entry : params.entrySet()) {
                headers[i] = new BasicHeader(entry.getKey(), entry.getValue());
                i++;
            }
        }
        return headers;
    }
    /**
     *
     * @param path
     *            请求url
     * @param params
     *            请求参数
     * @param encoding
     *            编码格式
     * @return
     * @throws IOException
     * @throws ClientProtocolException
     */
    public static String httpPost(String path, Map<String, String> params, String encoding)
            throws ClientProtocolException, IOException {

        String result = "{'success':false,'error':'服务器连接失败'}";
        System.out.println("path:"+path);
        // try {
        DefaultHttpClient httpClient = HttpRequestUtil.getHttpClient();
        List<NameValuePair> pairs = new ArrayList<NameValuePair>();// 存放请求参数
        if (params != null && !params.isEmpty()) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                pairs.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
        }
        UrlEncodedFormEntity entity = new UrlEncodedFormEntity(pairs, encoding);
        HttpPost httpPost = new HttpPost(path);
        // System.out.println("sessionId："+sessionId);
        logger.info("sessionId：" + sessionId);
        if (!sessionId.equals("")) {
            httpPost.setHeader("Cookie", "JSESSIONID=" + sessionId);
        }
        httpPost.setEntity(entity);

        httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 120000);
        // 读取超时
        httpClient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 120000);
        HttpResponse response = null;

        response = httpClient.execute(httpPost);
        if (response.getStatusLine().getStatusCode() == 200) {

            if (sessionId.equals("")) {
                CookieStore cookieStore = httpClient.getCookieStore();
                List<Cookie> cookies = cookieStore.getCookies();
                for (int i = 0; i < cookies.size(); i++) {
                    if ("JSESSIONID".equals(cookies.get(i).getName())) {
                        sessionId = cookies.get(i).getValue();
                        break;
                    }
                }
            }

            result = EntityUtils.toString(response.getEntity());
        }else if (response.getStatusLine().getStatusCode() == 302) {
            System.out.println("--http返回码--"+response.getStatusLine().getStatusCode());
            Header[] header=response.getHeaders("Location");
            for(int i=0;i<header.length;i++){
                String init=header[i]+"";
                init=init.substring(init.lastIndexOf("/") + 1);
                System.out.println("头文件信息："+init);
                //通过返回的头文件信息判断是否正确通过web端的登录方法等成功,若成功则HttpClientUtil里面的sessionId就是有效的sessionId
                if(init.startsWith("login")){
                    result="{'success':false,'error':'session失效'}";
                }
            }
        }else{
            System.out.println("--http返回码--"+response.getStatusLine().getStatusCode());
        }

        // } catch (IOException e) {
        // e.printStackTrace();
        // }
        return result;
    }
}
