package xyz.catuns.lab.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.utils.PropertyResolverUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import xyz.catuns.lab.domain.dto.BlogPostResponse;
import xyz.catuns.lab.domain.dto.BlogPostSearchRequest;
import xyz.catuns.lab.domain.dto.CreateBlogPostRequest;
import xyz.catuns.lab.domain.entity.Author;
import xyz.catuns.lab.domain.entity.BlogPost;
import xyz.catuns.lab.domain.mapper.BlogPostMapper;
import xyz.catuns.lab.domain.repository.AuthorRepository;
import xyz.catuns.lab.domain.repository.BlogPostRepository;
import xyz.catuns.lab.service.BlogPostService;
import xyz.catuns.lab.service.SlugService;
import xyz.catuns.spring.base.exception.controller.BadRequestException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostMapper mapper;
    private final BlogPostRepository repository;
    private final AuthorRepository authorRepository;
    private final SlugService slugService;

    @Override
    @Transactional
    @Caching(evict = {
                @CacheEvict(value = "blog_list", allEntries = true)},
            put = {
                @CachePut(value = "blog", key = "#result.id()")})
    public BlogPostResponse createBlogPost(CreateBlogPostRequest request) {
        Author author = authorRepository.findById(request.authorId())
                .orElseThrow(() -> new BadRequestException("Author not found"));
        BlogPost post = mapper.toEntity(request);
        post.setAuthor(author);
        String slug = slugService.generateUniqueSlug(post.getTitle(), null);
        post.setSlug(slug);
        post = repository.save(post);
        return mapper.toResponse(post);
    }

    @Override
    @Cacheable(value = "blog_list", key = "#request.toString()")
    public List<BlogPostResponse> getBlogPosts(BlogPostSearchRequest request) {
        List<BlogPost> all = repository.findAll();
        return mapper.toResponseList(all);
    }
}
