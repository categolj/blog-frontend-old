package am.ik.blog;

import java.util.LinkedHashSet;

import am.ik.blog.actuator.ActuatorHandler;
import am.ik.blog.counter.CounterApi;
import am.ik.blog.counter.CounterClient.Count;
import am.ik.blog.dashboard.DashboardHandler;
import am.ik.blog.entries.BlogHandler;
import am.ik.blog.entries.Prerender;
import am.ik.blog.entries.PrerenderClient;
import am.ik.blog.prometheus.Prometheus;
import am.ik.blog.translation.TranslationApi;
import com.github.benmanes.caffeine.cache.AsyncCacheLoader;
import io.micrometer.core.instrument.config.MeterFilter;
import reactor.netty.http.client.HttpClient;

import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.info.JavaInfo;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.nativex.hint.AotProxyHint;
import org.springframework.nativex.hint.NativeHint;
import org.springframework.nativex.hint.ProxyBits;
import org.springframework.nativex.hint.ResourceHint;
import org.springframework.nativex.hint.TypeHint;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.server.adapter.ForwardedHeaderTransformer;

import static org.springframework.nativex.hint.TypeAccess.DECLARED_CONSTRUCTORS;
import static org.springframework.nativex.hint.TypeAccess.DECLARED_FIELDS;
import static org.springframework.nativex.hint.TypeAccess.DECLARED_METHODS;
import static org.springframework.nativex.hint.TypeAccess.PUBLIC_CONSTRUCTORS;
import static org.springframework.nativex.hint.TypeAccess.PUBLIC_FIELDS;
import static org.springframework.nativex.hint.TypeAccess.PUBLIC_METHODS;

@SpringBootApplication
@EnableConfigurationProperties({ BlogApi.class, TranslationApi.class, CounterApi.class, Prometheus.class, Prerender.class })
@NativeHint(
		options = { "--enable-http" },
		types = {
				@TypeHint(
						types = {
								AsyncCacheLoader.class,
								LinkedHashSet.class,
								Count.class,
								JavaInfo.class,
								JavaInfo.JavaRuntimeEnvironmentInfo.class,
								JavaInfo.JavaVirtualMachineInfo.class
						},
						typeNames = {
								"com.github.benmanes.caffeine.cache.SSLMSA",
								"com.github.benmanes.caffeine.cache.PSAMW",
								"am.ik.blog.entries.PrerenderClient$PrerenderAsyncCacheLoader",
								"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinActiveMqSenderConfiguration",
								"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinRabbitSenderConfiguration",
								"org.springframework.cloud.sleuth.autoconfig.zipkin2.ZipkinKafkaSenderConfiguration"
						},
						access = { DECLARED_FIELDS, DECLARED_METHODS, DECLARED_CONSTRUCTORS, PUBLIC_FIELDS, PUBLIC_METHODS, PUBLIC_CONSTRUCTORS }
				)
		},
		aotProxies = {
				@AotProxyHint(targetClass = PrerenderClient.class, proxyFeatures = ProxyBits.IS_STATIC)
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
			BlogHandler blogHandler,
			ActuatorHandler actuatorHandler) {
		return dashboardHandler.routes()
				.and(blogHandler.routes())
				.and(actuatorHandler.routes());
	}

	@Bean
	public MeterRegistryCustomizer<?> meterRegistryCustomizer() {
		return registry -> registry.config() //
				.meterFilter(MeterFilter.deny(id -> {
					String uri = id.getTag("uri");
					return uri != null && (uri.startsWith("/actuator") || uri.startsWith("/proxy"));
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

