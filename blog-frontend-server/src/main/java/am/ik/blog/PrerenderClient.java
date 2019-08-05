package am.ik.blog;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.sleuth.annotation.NewSpan;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.cache.CacheMono;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Signal;

import java.net.URI;
import java.time.Duration;

@Component
public class PrerenderClient {

    private static final Logger log = LoggerFactory.getLogger(PrerenderClient.class);

    private final WebClient webClient;

    private final Prerender prerender;

    private final Cache<String, ? super Signal<? extends String>> cache
        = Caffeine.newBuilder()
        .maximumSize(100)
        .expireAfterAccess(Duration.ofHours(1))
        .removalListener((key, value, cause) -> log.info("Removing cache({}) because of {}", key, cause))
        .build();

    public PrerenderClient(WebClient.Builder builder, Prerender prerender) {
        this.webClient = builder.build();
        this.prerender = prerender;
    }

    @NewSpan("prerender")
    public Mono<String> invoke(HttpMethod method, String url) {
        if (method == HttpMethod.HEAD) {
            return this.prerender(method, url);
        }
        return CacheMono.lookup(this.cache.asMap(), url)
            .onCacheMissResume(() -> this.prerender(method, url));
    }

    private Mono<String> prerender(HttpMethod method, String url) {
        final URI uri = URI.create(prerender.url() + "/" + url);
        return this.webClient.method(method)
            .uri(uri)
            .header("X-Prerender-Token", this.prerender.token())
            .retrieve()
            .bodyToMono(String.class);
    }
}
