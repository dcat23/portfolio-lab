package xyz.catuns.lab.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/github")
@Tag(name = "Github")
public class GithubController {

    private final RestTemplate restTemplate;
//    private final GitHubClient gitHub;

    @GetMapping(value = "/me")
    @Operation(summary = "My Github", description = "Get MyGithub")
    @ApiResponse(responseCode = "200",description = "HTTP Status OK")
    public ResponseEntity<?> myGithub(
    ) throws IOException {

//        MyGithubResponse response = githubService.myGithub(request);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }


}
