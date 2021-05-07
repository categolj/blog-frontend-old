package am.ik.blog;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConfigurationProperties(prefix = "blog-api")
@ConstructorBinding
public class BlogApi {

	private final String url;

	public BlogApi(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}
}