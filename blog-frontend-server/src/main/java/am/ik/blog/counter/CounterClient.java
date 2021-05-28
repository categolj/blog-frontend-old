package am.ik.blog.counter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class CounterClient {
	private final CounterApi counterApi;

	private final WebClient webClient;

	public CounterClient(CounterApi counterApi, WebClient.Builder builder) {
		this.counterApi = counterApi;
		this.webClient = builder.build();
	}

	public Mono<Void> increment(long entryId, boolean isBrowser) {
		final Map<String, Object> body = new HashMap<>();
		body.put("entryId", entryId);
		body.put("browser", isBrowser);
		body.put("timestamp", Instant.now());
		return this.webClient.post()
				.uri(this.counterApi.getUrl())
				.contentType(MediaType.APPLICATION_JSON)
				.header("ce-id", UUID.randomUUID().toString())
				.header("ce-source", this.counterApi.getEventSource())
				.header("ce-type", this.counterApi.getEventType())
				.header("ce-specversion", "1.0")
				.bodyValue(body)
				.exchangeToMono(ClientResponse::releaseBody);
	}

	public Flux<Count> reportAll(Instant from, Instant to) {
		return this.webClient.get()
				.uri(this.counterApi.getUrl(),
						b -> b.path(this.counterApi.getEventSource())
								.queryParam("from", from)
								.queryParam("to", to)
								.build())
				.retrieve()
				.bodyToFlux(Count.class);
	}

	public Flux<Count> reportForEntry(long entryId, Instant from, Instant to) {
		return this.webClient.get()
				.uri(this.counterApi.getUrl(),
						b -> b.path(this.counterApi.getEventSource())
								.queryParam("from", from)
								.queryParam("to", to)
								.queryParam("entryId", entryId)
								.build())
				.retrieve()
				.bodyToFlux(Count.class);
	}

	public static class Count {
		private final Instant timestamp;

		private final long count;

		@JsonCreator
		public Count(@JsonProperty("timestamp") Instant timestamp, @JsonProperty("count") long count) {
			this.timestamp = timestamp;
			this.count = count;
		}

		public Instant getTimestamp() {
			return timestamp;
		}

		public long getCount() {
			return count;
		}
	}
}
