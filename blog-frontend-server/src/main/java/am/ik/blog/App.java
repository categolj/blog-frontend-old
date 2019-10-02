package am.ik.blog;

import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.server.RouterFunction;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Bean
    public RouterFunction<?> routes(
        DashboardHandler dashboardHandler,
        BlogHandler blogHandler) {
        return dashboardHandler.routes()
            .and(blogHandler.routes());
    }

    @Bean
    public MeterRegistryCustomizer meterRegistryCustomizer() {
        return registry -> registry.config() //
            .meterFilter(MeterFilter.deny(id -> {
                String uri = id.getTag("uri");
                return uri != null && uri.startsWith("/actuator");
            }));
    }
}

