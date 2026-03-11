package xyz.catuns.lab.domain.dto;

import java.time.Instant;
import java.util.Set;

public record BlogPostResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        String content,
        Instant date,
        String readTime,
        String category,
        Set<String> tags,
        AuthorResponse author,
        Boolean featured,
        String color
) {
}
