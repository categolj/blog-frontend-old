package am.ik.blog;

import is.tagomor.woothee.Classifier;
import is.tagomor.woothee.crawler.Google;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.server.RequestPredicate;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.USER_AGENT;

@Controller
public class BlogHandler {

    private final PrerenderClient prerenderClient;

    public BlogHandler(PrerenderClient prerenderClient) {
        this.prerenderClient = prerenderClient;
    }

    RouterFunction<ServerResponse> routes() {
        return RouterFunctions.route()
            .route(forwardToPrerender(), this::prerender)
            .GET("/", this::render)
            .GET("/entries/**", this::render)
            .GET("/tags/**", this::render)
            .GET("/categories/**", this::render)
            .build();
    }

    @NonNull
    private Mono<ServerResponse> prerender(ServerRequest req) {
        final String url = req.uri().toString();
        final Mono<String> content = this.prerenderClient.invoke(req.method(), url);
        return content
            .flatMap(html -> ServerResponse.ok()
                .contentType(MediaType.TEXT_HTML)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(3)))
                .syncBody(html))
            .switchIfEmpty(ServerResponse.notFound()
                .build());
    }

    @NonNull
    private Mono<ServerResponse> render(ServerRequest req) {
        return ServerResponse.ok().syncBody(new ClassPathResource("META-INF/resources/index.html"));
    }

    private static RequestPredicate forwardToPrerender() {
        return req -> {
            final String path = req.path();
            if ("/".equals(path) || path.startsWith("/entries") || path.startsWith("/tags") || path.startsWith("/categories")) {
                return isGoogle(req) && isPrerenderedMethod(req) && !isPrerenderedRequest(req);
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
