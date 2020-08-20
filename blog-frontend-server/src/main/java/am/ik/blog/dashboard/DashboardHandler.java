package am.ik.blog.dashboard;

import java.time.Duration;

import am.ik.blog.prometheus.PrometheusClient;
import com.fasterxml.jackson.databind.JsonNode;
import reactor.core.publisher.Mono;

import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

@Controller
public class DashboardHandler {

	private final PrometheusClient prometheusClient;

	public DashboardHandler(PrometheusClient prometheusClient) {
		this.prometheusClient = prometheusClient;
	}

	public RouterFunction<ServerResponse> routes() {
		return RouterFunctions.route()
				.GET("/dashboard/sli", this::sli)
				.GET("/dashboard/error_budget", this::errorBudget)
				.GET("/dashboard/jvm_memory_used_bytes", this::jvmMemoryUsedBytes)
				.build();
	}

	private Mono<ServerResponse> sli(ServerRequest req) {
		final String instance = req.queryParam("instance").map(s -> s.replace(',', '|')).orElse("null");
		final Duration duration = Duration.ofDays(7);
		final String promql = String.format("100 * avg_over_time(probe_success{instance=~\"%s\"}[%ds])", instance, duration.getSeconds());
		final Mono<JsonNode> result = this.prometheusClient.queryRange(promql, duration);
		return ServerResponse.ok()
				.header("Access-Control-Allow-Origin", "*")
				.body(result, JsonNode.class);
	}

	private Mono<ServerResponse> errorBudget(ServerRequest req) {
		final String instance = req.queryParam("instance").map(s -> s.replace(',', '|')).orElse("null");
		final float slo = req.queryParam("slo").map(Float::parseFloat).orElse(0.0f);
		final Duration duration = Duration.ofDays(7);
		final String promql = String.format("(avg_over_time(probe_success{instance=~\"%s\"}[%ds]) - %f) * (%d / 60)", instance, duration.getSeconds(), slo, duration.getSeconds());
		final Mono<JsonNode> result = this.prometheusClient.queryRange(promql, duration);
		return ServerResponse.ok()
				.header("Access-Control-Allow-Origin", "*")
				.body(result, JsonNode.class);
	}

	private Mono<ServerResponse> jvmMemoryUsedBytes(ServerRequest req) {
		final String instance = req.queryParam("application").map(s -> s.replace(',', '|')).orElse("null");
		final Duration duration = Duration.ofDays(1);
		final String promql = String.format("sum(jvm_memory_used_bytes{application=\"%s\"}) by (instance_id, area)", instance);
		final Mono<JsonNode> result = this.prometheusClient.queryRange(promql, duration);
		return ServerResponse.ok()
				.header("Access-Control-Allow-Origin", "*")
				.body(result, JsonNode.class);
	}
}
