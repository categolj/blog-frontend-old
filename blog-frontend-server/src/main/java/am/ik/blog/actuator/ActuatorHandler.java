package am.ik.blog.actuator;

import am.ik.blog.BlogApi;
import am.ik.blog.counter.CounterApi;
import am.ik.blog.translation.TranslationApi;

import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.Builder;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Controller
public class ActuatorHandler {
	private final WebClient webClient;

	private final BlogApi blogApi;

	private final TranslationApi translationApi;

	private final CounterApi counterApi;

	public ActuatorHandler(Builder builder, BlogApi blogApi, TranslationApi translationApi, CounterApi counterApi) {
		this.webClient = builder.build();
		this.blogApi = blogApi;
		this.translationApi = translationApi;
		this.counterApi = counterApi;
	}

	public RouterFunction<ServerResponse> routes() {
		return RouterFunctions.route()
				.GET("/proxy/blog-api/actuator/info", this.proxy(this.blogApi.getUrl(), "info"))
				.GET("/proxy/blog-api/actuator/health", this.proxy(this.blogApi.getUrl(), "health"))
				.GET("/proxy/blog-translation/actuator/info", this.proxy(this.translationApi.getUrl(), "info"))
				.GET("/proxy/blog-translation/actuator/health", this.proxy(this.translationApi.getUrl(), "health"))
				.GET("/proxy/blog-counter/actuator/info", this.proxy(this.counterApi.getUrl(), "info"))
				.GET("/proxy/blog-counter/actuator/health", this.proxy(this.counterApi.getUrl(), "health"))
				.build();
	}

	private HandlerFunction<ServerResponse> proxy(String url, String path) {
		return req -> this.webClient.get()
				.uri(url, b -> b.path("actuator/{path}").build(path))
				.exchangeToMono(r -> r.bodyToMono(String.class)
						.flatMap(b -> ServerResponse.status(r.statusCode())
								.headers(h -> h.addAll(r.headers().asHttpHeaders()))
								.bodyValue(b)));
	}
}
