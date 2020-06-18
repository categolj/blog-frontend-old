package am.ik.blog.dashboard;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

@Component
public class PrometheusClient {

    private final WebClient webClient;

    public PrometheusClient(WebClient.Builder builder, Prometheus prometheus) {
        this.webClient = builder
            .baseUrl(prometheus.getUrl())
            .build();
    }

    public Mono<JsonNode> queryRange(String promql, Duration duration) {
        final Instant end = Instant.now();
        final Instant begin = end.minus(duration);
        final long step = 400;
        return this.webClient.get()
            .uri("/api/v1/query_range?query={promql}&start={start}&end={end}&step={step}",
                promql,
                begin.toEpochMilli() / 1000.0,
                end.toEpochMilli() / 1000.0,
                step)
            .retrieve()
            .bodyToMono(JsonNode.class);
    }
}
