package com.linkcld.toms.anlaysis.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "sso")
public class SsoProperty {

    private final Server server = new Server();

    private final Client client = new Client();

    public Server getServer() {
        return server;
    }

    public Client getClient() {
        return client;
    }

    public static class Server {
        private String hostUrl;
        private String loginUrl;
        private String token;

        public String getHostUrl() {
            return hostUrl;
        }

        public void setHostUrl(String hostUrl) {
            this.hostUrl = hostUrl;
        }

        public String getLoginUrl() {
            return loginUrl;
        }

        public void setLoginUrl(String loginUrl) {
            this.loginUrl = loginUrl;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

    }

    public static class Client {
        private String hostUrl;
        private String loginUrl;
        private String homePage;
        private String logoutUrl;
        private String ormUrl;
        private String systemCode;

        public String getHostUrl() {
            return hostUrl;
        }

        public void setHostUrl(String hostUrl) {
            this.hostUrl = hostUrl;
        }

        public String getLoginUrl() {
            return loginUrl;
        }

        public void setLoginUrl(String loginUrl) {
            this.loginUrl = loginUrl;
        }

        public String getHomePage() {
            return homePage;
        }

        public void setHomePage(String homePage) {
            this.homePage = homePage;
        }

        public String getLogoutUrl() {
            return logoutUrl;
        }

        public void setLogoutUrl(String logoutUrl) {
            this.logoutUrl = logoutUrl;
        }

        public String getOrmUrl() {
            return ormUrl;
        }

        public void setOrmUrl(String ormUrl) {
            this.ormUrl = ormUrl;
        }

        public String getSystemCode() {
            return systemCode;
        }

        public void setSystemCode(String systemCode) {
            this.systemCode = systemCode;
        }

    }
}
