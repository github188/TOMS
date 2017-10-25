package com.linkcld.toms.anlaysis;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @Description:
 * @package: com.linkcld.taxi.scancode.
 * Created by ll_wang on 2017/6/8.
 */

@SpringBootApplication
@ComponentScan(basePackages = {"com.linkcld.toms"})
@EntityScan
@EnableJpaAuditing
@EnableJpaRepositories
@MapperScan(basePackages = "com.linkcld.toms")
@EnableScheduling
/*public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}*/

public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }

}
