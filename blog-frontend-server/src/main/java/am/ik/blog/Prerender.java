package am.ik.blog;

import org.springframework.boot.context.properties.ImmutableConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ImmutableConfigurationProperties(prefix = "prerender")
public class Prerender {

    private final String url;

    private final String token;

    public Prerender(@DefaultValue("http://localhost:3000") String url, @DefaultValue("dummy") String token) {
        this.url = url;
        this.token = token;
    }

    public final String url() {
        return url;
    }

    public final String token() {
        return token;
    }
}
