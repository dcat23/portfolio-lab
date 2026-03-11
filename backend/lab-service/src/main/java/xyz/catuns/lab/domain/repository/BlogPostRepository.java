package xyz.catuns.lab.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.catuns.lab.domain.entity.BlogPost;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    boolean existsBySlugAndIdNot(String slug, Long excludeId);
}
