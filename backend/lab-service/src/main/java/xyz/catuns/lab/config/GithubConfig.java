package xyz.catuns.lab.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

@Configuration
@RequiredArgsConstructor
public class GithubConfig {

    @Value("${github.oauth}")
    private String githubOAuthToken;

    @Value("${github.uri:https://api.github.com}")
    private String githubURI;


    @Bean
    RestTemplate githubRestTemplate() {
        return new RestTemplateBuilder()
                .rootUri(githubURI)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + githubOAuthToken)
                .defaultHeader("Accept", "application/vnd.github.v3+json")
                .build();
    }
}
