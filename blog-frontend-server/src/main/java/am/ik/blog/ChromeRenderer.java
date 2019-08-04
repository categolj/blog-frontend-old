package am.ik.blog;

import com.codeborne.selenide.Browsers;
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.sleuth.annotation.NewSpan;
import org.springframework.stereotype.Component;
import reactor.cache.CacheMono;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Signal;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

import java.net.URL;
import java.time.Duration;
import java.util.concurrent.Executors;

@Component
public class ChromeRenderer {

    private static final Logger log = LoggerFactory.getLogger(ChromeRenderer.class);

    private Scheduler scheduler = Schedulers.fromExecutorService(Executors.newFixedThreadPool(4));

    static {
        Configuration.browser = Browsers.CHROME;
        Configuration.headless = true;
    }

    private final Cache<String, ? super Signal<? extends String>> cache
        = Caffeine.newBuilder()
        .maximumSize(100)
        .expireAfterAccess(Duration.ofHours(1))
        .removalListener((key, value, cause) -> log.info("Removing cache({}) because of {}", key, cause))
        .build();

    @NewSpan
    public Mono<String> render(String url) {
        return CacheMono.lookup(this.cache.asMap(), url)
            .onCacheMissResume(() -> this.getContent(url));
    }

    Mono<String> getContent(String url) {
        return Mono.fromCallable(() -> {
            log.info("Open {}", url);
            Selenide.open(new URL(url));
            // Wait until JavaScript is rendered.
            Thread.sleep(1000);
            final String title = Selenide.$("h2").innerText();
            if ("404 Not Found".equals(title)) {
                return null;
            }
            return Selenide.$("html").innerHtml();
        }).subscribeOn(this.scheduler);
    }
}
