package am.ik.blog;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

@ConstructorBinding
@ConfigurationProperties(prefix = "prometheus")
public class Prometheus {

    private final String url;

    public Prometheus(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}
