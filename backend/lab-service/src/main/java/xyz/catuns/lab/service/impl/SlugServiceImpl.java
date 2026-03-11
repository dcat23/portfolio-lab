package xyz.catuns.lab.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import xyz.catuns.lab.domain.repository.BlogPostRepository;
import xyz.catuns.lab.service.SlugService;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlugServiceImpl implements SlugService {

    private final BlogPostRepository repository;

    @Override
    public String generateUniqueSlug(String title, Long excludeId) {
        String baseSlug = toSlug(title);  // e.g., "my-first-post"
        String slug = baseSlug;
        int counter = 1;

        while (repository.existsBySlugAndIdNot(slug, excludeId)) {  // Skip self for updates
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private String toSlug(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")  // Remove special chars
                .trim()
                .replaceAll("[\\s-]+", "-");     // Collapse spaces/hyphens
    }
}
