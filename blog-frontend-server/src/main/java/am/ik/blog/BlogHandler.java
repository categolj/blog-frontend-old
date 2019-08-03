package am.ik.blog;

import is.tagomor.woothee.Classifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
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
import java.util.Map;

import static org.springframework.http.HttpHeaders.USER_AGENT;

@Controller
public class BlogHandler {

    private final ChromeRenderer chromeRenderer;

    public BlogHandler(ChromeRenderer chromeRenderer) {
        this.chromeRenderer = chromeRenderer;
    }

    RouterFunction<ServerResponse> routes() {
        return RouterFunctions.route()
            .route(ifNotHuman(), this::renderByChrome)
            .GET("/", this::returnHtml)
            .GET("/entries/**", this::returnHtml)
            .GET("/tags/**", this::returnHtml)
            .GET("/categories/**", this::returnHtml)
            .build();
    }

    @NonNull
    private Mono<ServerResponse> renderByChrome(ServerRequest req) {
        final String url = req.uri().toString();
        final Mono<String> content = this.chromeRenderer.render(url);
        return content
            .flatMap(html -> ServerResponse.ok()
                .contentType(MediaType.TEXT_HTML)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(3)))
                .syncBody(html))
            .switchIfEmpty(ServerResponse.notFound()
                .build());
    }

    @NonNull
    private Mono<ServerResponse> returnHtml(ServerRequest req) {
        return ServerResponse.ok().syncBody(new ClassPathResource("META-INF/resources/index.html"));
    }

    private static RequestPredicate ifNotHuman() {
        return req -> {
            final String userAgent = req.headers().header(USER_AGENT).get(0);
            return !isHuman(userAgent);
        };
    }

    static boolean isHuman(String userAgent) {
        final Map<String, String> result = Classifier.parse(userAgent);
        final String category = result.get("category");
        return "pc".equals(category) || "smartphone".equals(category) || "mobilephone".equals(category);
    }
}
