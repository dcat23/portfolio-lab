package xyz.catuns.lab.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.catuns.lab.domain.dto.BlogPostResponse;
import xyz.catuns.lab.domain.dto.BlogPostSearchRequest;
import xyz.catuns.lab.domain.dto.CreateBlogPostRequest;
import xyz.catuns.lab.service.BlogPostService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/blog/posts")
@Tag(name = "Blog Post")
public class BlogPostController {

    private final BlogPostService blogPostService;

    @PostMapping(value = "")
    @Operation(summary = "Create Blog Post", description = "Creates a new BlogPost")
    @ApiResponse(responseCode = "201",description = "HTTP Status CREATED")
    public ResponseEntity<BlogPostResponse> createBlogPost(
            @RequestBody CreateBlogPostRequest request
    ){
        BlogPostResponse response = blogPostService.createBlogPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping(value = "")
    @Operation(summary = "Get Blog Posts", description = "Get BlogPost")
    @ApiResponse(responseCode = "200",description = "HTTP Status OK")
    public ResponseEntity<List<BlogPostResponse>> getBlogPosts(
            @ModelAttribute BlogPostSearchRequest request
    ){
        List<BlogPostResponse> response = blogPostService.getBlogPosts(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
