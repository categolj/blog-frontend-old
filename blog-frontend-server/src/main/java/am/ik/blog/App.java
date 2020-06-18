package am.ik.blog;

import am.ik.blog.dashboard.DashboardHandler;
import am.ik.blog.entries.BlogHandler;
import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import reactor.netty.http.client.HttpClient;

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

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(HttpClient.create().tcpConfiguration(builder -> builder.metrics(true))));
    }
}

