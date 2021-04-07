package am.ik.blog.entries;

import reactor.core.publisher.Mono;

import org.springframework.http.HttpMethod;

public interface PrerenderClient {
	Mono<String> invoke(HttpMethod method, String url);
}
