package am.ik.blog;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import is.tagomor.woothee.Classifier;
import is.tagomor.woothee.crawler.Google;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpHeaders.USER_AGENT;

@Controller
public class BlogHandler {

    private final PrerenderClient prerenderClient;
    private final Counter prerenderCounter;

    public BlogHandler(PrerenderClient prerenderClient, MeterRegistry meterRegistry) {
        this.prerenderClient = prerenderClient;
        this.prerenderCounter = Counter.builder("prerender").register(meterRegistry);
    }

    RouterFunction<ServerResponse> routes() {
        return RouterFunctions.route()
                .route(forwardToPrerender(), this::prerender)
                .GET("/", this::render)
                .GET("/entries/**", this::render)
                .GET("/series/**", this::render)
                .GET("/tags/**", this::render)
                .GET("/categories/**", this::render)
                .GET("/notes/**", this::render)
                .GET("/note/**", this::render)
                .GET("/aboutme", this::render)
                .GET("/info", this::render)
                .GET("/dashboard", this::render)
                .build();
    }

    @NonNull
    private Mono<ServerResponse> prerender(ServerRequest req) {
        final String url = req.uri().toString();
        this.prerenderCounter.increment();
        final Mono<String> content = this.prerenderClient.invoke(req.method(), url);
        return content
                .flatMap(html -> ServerResponse.ok()
                        .contentType(MediaType.TEXT_HTML)
                        .cacheControl(CacheControl.maxAge(Duration.ofDays(3)))
                        .bodyValue(html))
                .switchIfEmpty(ServerResponse.notFound()
                        .build());
    }

    @NonNull
    private Mono<ServerResponse> render(ServerRequest req) {
        return ServerResponse.ok().bodyValue(new ClassPathResource("META-INF/resources/index.html"));
    }

    private static RequestPredicate forwardToPrerender() {
        return req -> {
            final String path = req.path();
            if ("/".equals(path) || path.startsWith("/entries") || path.startsWith("/series") || path.startsWith("/tags") || path.startsWith("/categories")) {
                if (req.queryParam("prerender").isPresent()) {
                    return true;
                }
                return isPrerenderedMethod(req) && !isPrerenderedRequest(req) && isGoogle(req);
            }
            return false;
        };
    }

    private static boolean isPrerenderedRequest(ServerRequest req) {
        return !req.headers().header("X-Prerender").isEmpty();
    }

    private static boolean isPrerenderedMethod(ServerRequest req) {
        final HttpMethod method = req.method();
        return method == HttpMethod.GET || method == HttpMethod.HEAD;
    }

    private static boolean isGoogle(ServerRequest req) {
        final List<String> headers = req.headers().header(HttpHeaders.REFERER);
        if (!headers.isEmpty() && headers.get(0).startsWith("https://translate.googleusercontent.com")) {
            return true;
        }
        final String userAgent = req.headers().header(USER_AGENT).get(0);
        return Google.challenge(userAgent, new HashMap<>());
    }

    private static boolean isHuman(ServerRequest req) {
        final String userAgent = req.headers().header(USER_AGENT).get(0);
        final Map<String, String> result = Classifier.parse(userAgent);
        final String category = result.get("category");
        return "pc".equals(category) || "smartphone".equals(category) || "mobilephone".equals(category);
    }
}
