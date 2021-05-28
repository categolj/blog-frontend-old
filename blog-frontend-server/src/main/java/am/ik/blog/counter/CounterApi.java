package am.ik.blog.counter;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "counter-api")
@ConstructorBinding
public class CounterApi {

	private final String url;

	private final String eventSource;

	private final String eventType;

	public CounterApi(String url, @DefaultValue("blog-frontend") String eventSource, @DefaultValue("counter") String eventType) {
		this.url = url;
		this.eventSource = eventSource;
		this.eventType = eventType;
	}

	public String getUrl() {
		return url;
	}

	public String getEventSource() {
		return eventSource;
	}

	public String getEventType() {
		return eventType;
	}
}