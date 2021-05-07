package am.ik.blog.translation;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConfigurationProperties(prefix = "translation-api")
@ConstructorBinding
public class TranslationApi {

	private final String url;

	public TranslationApi(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}
}