package xyz.catuns.lab.service;

import xyz.catuns.lab.domain.dto.BlogPostResponse;
import xyz.catuns.lab.domain.dto.BlogPostSearchRequest;
import xyz.catuns.lab.domain.dto.CreateBlogPostRequest;

import java.util.List;

public interface BlogPostService {
    BlogPostResponse createBlogPost(CreateBlogPostRequest request);

    List<BlogPostResponse> getBlogPosts(BlogPostSearchRequest request);
}
