package xyz.catuns.lab.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.catuns.lab.domain.entity.Project;

import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    boolean existsByOwnerAndRepository(String owner, String repository);

    Optional<Project> findByOwnerAndRepository(String owner, String repository);
}
