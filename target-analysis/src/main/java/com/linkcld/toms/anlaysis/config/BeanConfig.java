package com.linkcld.toms.anlaysis.config;

import com.linkcld.fw.GlobalContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public GlobalContext globalContext() {
        return new GlobalContext();
    }

}
