package am.ik.blog.translation;

import am.ik.blog.BlogApi;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import reactor.core.publisher.Mono;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.Builder;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class TranslationClient {
	private final WebClient webClient;

	private final TranslationApi translationApi;

	private final BlogApi blogApi;

	public TranslationClient(Builder builder, TranslationApi translationApi, BlogApi blogApi) {
		this.translationApi = translationApi;
		this.blogApi = blogApi;
		this.webClient = builder.build();
	}


	public Mono<JsonNode> translate(Long entryId, String language) {
		final Mono<ObjectNode> entryMono = this.webClient.get()
				.uri(this.blogApi.getUrl(), b -> b.path("/entries/{entryId}").build(entryId))
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.bodyToMono(ObjectNode.class);
		final Mono<JsonNode> translationMono = this.webClient.get()
				.uri(this.translationApi.getUrl(),
						b -> b
								.path("/translations/{entryId}/latest")
								.queryParam("language", language)
								.build(entryId))
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.bodyToMono(JsonNode.class)
				.onErrorResume(TranslationClient::isNotFound, __ -> this.autoTranslation(entryId, language));
		return entryMono
				.zipWith(translationMono)
				.map(tpl -> mergeEntry(tpl.getT1(), tpl.getT2()))
				.onErrorMap(WebClientResponseException.class, TranslationClient::toResponseStatusException);
	}

	Mono<JsonNode> autoTranslation(Long entryId, String language) {
		return this.webClient.post()
				.uri(this.translationApi.getUrl(),
						b -> b
								.path("/translations/{entryId}/auto")
								.queryParam("language", language)
								.build(entryId))
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.bodyToMono(JsonNode.class)
				.onErrorMap(WebClientResponseException.class, TranslationClient::toResponseStatusException);
	}

	static JsonNode mergeEntry(ObjectNode entry, JsonNode translation) {
		final String title = translation.get("title").asText();
		final String content = translation.get("content").asText();
		final String language = translation.get("language").asText();
		final String translatedAt = translation.get("createdAt").asText();
		final ObjectNode frontMatter = (ObjectNode) entry.get("frontMatter");
		return entry
				.put("content", content)
				.put("language", language)
				.put("translatedAt", translatedAt)
				.set("frontMatter", frontMatter.put("title", title));
	}

	static boolean isNotFound(Throwable e) {
		if (e instanceof WebClientResponseException) {
			return ((WebClientResponseException) e).getStatusCode() == HttpStatus.NOT_FOUND;
		}
		return false;
	}

	static Throwable toResponseStatusException(WebClientResponseException e) {
		return new ResponseStatusException(e.getStatusCode(), e.getMessage());
	}
}