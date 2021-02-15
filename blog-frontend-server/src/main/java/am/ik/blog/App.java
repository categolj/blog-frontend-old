package am.ik.blog;

import am.ik.blog.dashboard.DashboardHandler;
import am.ik.blog.entries.BlogHandler;
import io.micrometer.core.instrument.config.MeterFilter;
import reactor.netty.http.client.HttpClient;

import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.server.adapter.ForwardedHeaderTransformer;

@SpringBootApplication
@ConfigurationPropertiesScan
public class App {

	public static void main(String[] args) {
		new SpringApplicationBuilder(App.class)
				.applicationStartup(new BufferingApplicationStartup(2048))
				.run(args);
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

	@Bean
	public ForwardedHeaderTransformer forwardedHeaderTransformer() {
		return new ForwardedHeaderTransformer();
	}
}

