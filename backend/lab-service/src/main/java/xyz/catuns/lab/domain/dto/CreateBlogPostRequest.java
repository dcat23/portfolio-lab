package xyz.catuns.lab.domain.dto;

import java.util.Set;

public record CreateBlogPostRequest(
        Long authorId,
        String title,
        String excerpt,
        String content,
        Set<String> tags,
        Boolean featured,
        String color
) {
}
