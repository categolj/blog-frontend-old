package am.ik.blog.prometheus;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConfigurationProperties(prefix = "prometheus")
@ConstructorBinding
public class Prometheus {

	private final String url;

	public Prometheus(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}
}
