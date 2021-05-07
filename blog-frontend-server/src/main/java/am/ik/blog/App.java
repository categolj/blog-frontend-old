package am.ik.blog;

import am.ik.blog.dashboard.DashboardHandler;
import am.ik.blog.entries.BlogHandler;
import am.ik.blog.entries.Prerender;
import am.ik.blog.entries.PrerenderClient;
import am.ik.blog.prometheus.Prometheus;
import am.ik.blog.translation.TranslationApi;
import com.github.benmanes.caffeine.cache.AsyncCacheLoader;
import io.micrometer.core.instrument.config.MeterFilter;
import reactor.netty.http.client.HttpClient;

import org.springframework.aop.SpringProxy;
import org.springframework.aop.framework.Advised;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.DecoratingProxy;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.nativex.hint.NativeHint;
import org.springframework.nativex.hint.ProxyHint;
import org.springframework.nativex.hint.ResourceHint;
import org.springframework.nativex.hint.TypeHint;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.server.adapter.ForwardedHeaderTransformer;

@SpringBootApplication
@EnableConfigurationProperties({ BlogApi.class, TranslationApi.class, Prometheus.class, Prerender.class })
@NativeHint(
		options = { "--enable-http" },
		types = {
				@TypeHint(types = { AsyncCacheLoader.class }, typeNames = {
						"com.github.benmanes.caffeine.cache.SSLMSA",
						"com.github.benmanes.caffeine.cache.PSAMW",
						"am.ik.blog.entries.PrerenderClientImpl$PrerenderAsyncCacheLoader"
				}),
				@TypeHint(typeNames = {
						"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinActiveMqSenderConfiguration",
						"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinRabbitSenderConfiguration",
						"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinKafkaSenderConfiguration",
						"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinRestTemplateSenderConfiguration"
				})
		},
		proxies = {
				@ProxyHint(types = { PrerenderClient.class, SpringProxy.class, Advised.class, DecoratingProxy.class })
		},
		resources = {
				@ResourceHint(patterns = {
						"META-INF/resources/.*",
						"META-INF/resources/static/css/.*",
						"META-INF/resources/static/js/.*",
						"META-INF/resources/static/media/.*"
				})
		}
)
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
	public MeterRegistryCustomizer<?> meterRegistryCustomizer() {
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

