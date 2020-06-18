package am.ik.blog.entries;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "prerender")
@ConstructorBinding
public class Prerender {

    private final String url;

    private final String token;

	public Prerender(@DefaultValue("http://localhost:3000") String url, @DefaultValue("dummy") String token) {
		this.url = url;
		this.token = token;
	}


	public String getUrl() {
        return url;
    }

    public String getToken() {
        return token;
    }
}
