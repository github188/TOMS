package com.linkcld.toms.anlaysis.config;

import com.beyond.sso.client.session.SingleSignOutFilter;
import com.beyond.sso.client.validation.BSsoServiceTicketValidator;
import com.linkcld.orm.client.service.OrmClient;
import com.linkcld.security.sso.verifications.SsoOperate;
import com.linkcld.security.sso.web.ClientJSFilter;
import com.linkcld.security.sso.web.SsoUrlLogoutSuccessHandler;
import com.linkcld.security.sso.web.SsoUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.bsso.ServiceProperties;
import org.springframework.security.bsso.authentication.BssoAssertionAuthenticationToken;
import org.springframework.security.bsso.authentication.BssoAuthenticationProvider;
import org.springframework.security.bsso.web.BssoAuthenticationEntryPoint;
import org.springframework.security.bsso.web.BssoAuthenticationFilter;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

import javax.servlet.Filter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private SsoProperty ssoProperty;

    @Override
    public void configure(WebSecurity web) {

        // @formatter:off
        web
            .ignoring()
                .antMatchers("/")
                .antMatchers("/error", "/**/js/**", "/**/imgs/**", "/**/css/**", "/webjars/**")
                .antMatchers("/api/**");
        // @formatter:on

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // @formatter:off
        http
            .authorizeRequests()
                .anyRequest().authenticated()
                .and()
            .headers().frameOptions().disable()
                .and()
            .csrf().disable()
            .exceptionHandling()
                .authenticationEntryPoint(ssoEntryPoint())
                .and()
            .addFilterBefore(requestSingleLogoutFilter(), LogoutFilter.class)
            .addFilterAt(ssoFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(singleLogoutFilter(), CasAuthenticationFilter.class)
            .addFilterAfter(new ClientJSFilter(), AnonymousAuthenticationFilter.class);
        
        // @formatter:on

    }

    @Bean
    public AuthenticationProvider ssoAuthenticationProvider(
            AuthenticationUserDetailsService<BssoAssertionAuthenticationToken> ssoAuthenticationUserDetailsService) {
        BssoAuthenticationProvider ssoAuthenticationProvider = new BssoAuthenticationProvider();
        ssoAuthenticationProvider.setAuthenticationUserDetailsService(ssoAuthenticationUserDetailsService);
        ssoAuthenticationProvider.setServiceProperties(serviceProperties());
        ssoAuthenticationProvider
                .setTicketValidator(
                        new BSsoServiceTicketValidator(ssoProperty.getServer().getHostUrl() + "/rest/sso/"));
        ssoAuthenticationProvider.setKey("an_id_for_this_auth_provider_only");
        return ssoAuthenticationProvider;
    }

    @Bean
    public AuthenticationUserDetailsService<BssoAssertionAuthenticationToken> ssoAuthenticationUserDetailsService(
            SsoOperate ssoOperate) {
        SsoUserDetailService ssoUserDetailService = new SsoUserDetailService();
        ssoUserDetailService.setSsoOperate(ssoOperate);
        return ssoUserDetailService;
    }

    @Bean
    public SsoOperate ssoOperate(OrmClient ormClient) {
        SsoOperate ssoOperate = new SsoOperate();
        ssoOperate.setOrmClient(ormClient);
        ssoOperate.setSystemCode(ssoProperty.getClient().getSystemCode());
        return ssoOperate;
    }

    @Bean
    public OrmClient ormClient() {
        OrmClient ormClient = new OrmClient(ssoProperty.getClient().getOrmUrl());
        return ormClient;
    }

    @Bean
    public Filter singleLogoutFilter() {
        return new SingleSignOutFilter();
    }

    @Bean
    public Filter ssoFilter() throws Exception {
        BssoAuthenticationFilter ssoFilter = new BssoAuthenticationFilter();
        ssoFilter.setAuthenticationManager(authenticationManager());
        ssoFilter.setAuthenticationSuccessHandler(new SavedRequestAwareAuthenticationSuccessHandler());
        return ssoFilter;
    }

    @Bean
    public Filter requestSingleLogoutFilter() {
        LogoutFilter logoutFilter = new LogoutFilter(
                new SsoUrlLogoutSuccessHandler(ssoProperty.getServer().getHostUrl() + "/rest/sso/logout"),
                new SecurityContextLogoutHandler());
        logoutFilter.setFilterProcessesUrl(ssoProperty.getClient().getLogoutUrl());
        return logoutFilter;
    }

    @Bean
    public BssoAuthenticationEntryPoint ssoEntryPoint() {
        BssoAuthenticationEntryPoint ssoEntryPoint = new BssoAuthenticationEntryPoint();
        ssoEntryPoint.setLoginUrl(ssoProperty.getServer().getLoginUrl());
        ssoEntryPoint.setSsoServer(ssoProperty.getServer().getHostUrl());
        ssoEntryPoint.setServiceProperties(serviceProperties());
        return ssoEntryPoint;
    }

    @Bean
    public ServiceProperties serviceProperties() {
        ServiceProperties serviceProperties = new ServiceProperties();
        serviceProperties.setSendRenew(false);
        serviceProperties.setServiceName(ssoProperty.getClient().getHostUrl());
        return serviceProperties;
    }

}
