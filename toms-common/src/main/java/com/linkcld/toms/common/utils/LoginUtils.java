package com.linkcld.toms.common.utils;

import com.linkcld.toms.common.exception.LinkcldRuntimeException;
import com.linkcld.orm.client.domain.TreeVo;
import com.linkcld.orm.commons.domain.*;
import com.linkcld.security.sso.domain.LoginUser;
import com.linkcld.security.sso.service.LoginUserContext;
import com.linkcld.security.sso.verifications.SsoOperate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


/**
 * Created by shitou on 2017/7/13.
 * 当前用户登录工具类
 */
public class LoginUtils {
    private static final Logger logger = LoggerFactory.getLogger(LoginUtils.class);

    private LoginUtils() {
    }

    public static LoginUser getLoginUser() {

        LoginUser user = LoginUserContext.getLoginUser();
        if(user==null){
            throw new LinkcldRuntimeException("当前用户还未登录。");
        }
        //登录完成后先加载用户详细信息
        if(user!=null&&user.getOrmUser()==null){
            user.loadOrmUser(user.getUsername());
        }
        return user;
    }
    public static String getRegionCode() {
        List<OrganizationDto> list = getOrgBelong();
        if(list!=null&&list.size()>0){
            return list.get(0).getOrgArea();
        }
        return null;
    }
    public static String getOrgId() {
        return getUser().getOrgId();
    }
    public static UserDto getUser() {
        LoginUser user = getLoginUser();
        if(user!=null&&user.getOrmUser()==null){
            user.loadOrmUser(user.getUsername());
        }
        return user != null?user.getOrmUser():null;
    }
    public static List<OrganizationDto> getOrgBelong() {
        LoginUser user = getLoginUser();
        if(user!=null) {
            return getLoginUser().getOrgBelongI();
        }
        return null;
    }
    public static OrganizationDto getOrgInfo() {
        List<OrganizationDto> list = getOrgBelong();
        if(list!=null&&list.size()>0){
            return list.get(0);
        }
        return null;
    }
    public static String getUserName() {
        try {
            return getUser().getUserName();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return null;
        }
    }

    public static String getUserAcct() {
        try {
            return getUser().getUserAcct();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return null;
        }
    }

    public static String getUserId() {
        try {
            return getUser().getUserId();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return null;
        }
    }

    public static String getToken() {
        try {
            return getLoginUser().getToken();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return null;
        }
    }

    public static List<TreeVo> getOrgTree() {
        try {
            return getLoginUser().getOrgTree();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<CodeDto> getCodeRight() {
        try {
            return getLoginUser().getCodeRight();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<String> getCode(String codeIndex) {
        ArrayList list = new ArrayList();
        Iterator var2 = getCodeRight().iterator();

        while(var2.hasNext()) {
            CodeDto code = (CodeDto)var2.next();
            if(codeIndex.equals(code.getCodeIndex()) && !codeIndex.equals(code.getCodeValue())) {
                list.add(code.getCodeValue());
            }
        }

        return list;
    }

    public static List<OrganizationDto> getOrgRight() {
        try {
            return getLoginUser().getOrgRight();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<OrganizationDto> getDirectOrg() {
        try {
            return getLoginUser().getOrgBelongDirect();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<OrganizationDto> getPost() {
        try {
            return getLoginUser().getOrgBelongP();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<OrganizationDto> getDepartment() {
        try {
            return getLoginUser().getOrgBelongO();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<OrganizationDto> getInstitution() {
        try {
            return getLoginUser().getOrgBelongI();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<ResourceDto> getResourceRight() {
        try {
            return getLoginUser().getResourceRight();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<ResourceDto> getMenu() {
        try {
            return getLoginUser().getMenu();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<SystemDto> getAccessSystem() {
        try {
            return getLoginUser().getAccessSystem();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static List<SystemDto> getManageSystem() {
        try {
            return getLoginUser().getManageSystem();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
            return new ArrayList();
        }
    }

    public static Object getAttribute(String attributeName) {
        try {
            return getLoginUser().getNoRefreshAttribute().get(attributeName);
        } catch (Exception var2) {
            logger.error(var2.getMessage(), var2);
            return null;
        }
    }

    public static void setAttribute(String attributeName, Object attribute) {
        try {
            getLoginUser().getNoRefreshAttribute().put(attributeName, attribute);
        } catch (Exception var3) {
            logger.error(var3.getMessage(), var3);
        }

    }

    public static void reLoadCode() {
        try {
            getLoginUser().loadCode();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
        }

    }

    public static void reLoadOrg() {
        try {
            getLoginUser().loadOrg();
            getLoginUser().loadOrgBelong();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
        }

    }

    public static void reLoadResource() {
        try {
            getLoginUser().loadResource();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
        }

    }

    public static void reLoadUser() {
        try {
            getLoginUser().loadOrmUser();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
        }

    }

    public static void reLoadSystem() {
        try {
            getLoginUser().loadSystem();
        } catch (Exception var1) {
            logger.error(var1.getMessage(), var1);
        }

    }

    public static SystemDto getSystem() {
        return SsoOperate.getSystem();
    }
}

