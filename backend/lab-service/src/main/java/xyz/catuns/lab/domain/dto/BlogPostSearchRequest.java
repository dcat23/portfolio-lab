package xyz.catuns.lab.domain.dto;

import java.util.List;

public record BlogPostSearchRequest(
        List<String> category,
        List<String> tags,
        List<String> skip,
        Integer number
) {
}
