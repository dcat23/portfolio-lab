package xyz.catuns.lab.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.catuns.lab.domain.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
