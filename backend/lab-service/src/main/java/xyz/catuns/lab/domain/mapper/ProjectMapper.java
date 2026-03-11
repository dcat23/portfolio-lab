package xyz.catuns.lab.domain.mapper;

import org.mapstruct.*;
import xyz.catuns.lab.domain.dto.CreateProjectRequest;
import xyz.catuns.lab.domain.dto.ProjectResponse;
import xyz.catuns.lab.domain.dto.github.GitHubRepository;
import xyz.catuns.lab.domain.entity.Project;

import java.net.URI;
import java.util.List;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(
        componentModel = SPRING,
        injectionStrategy = CONSTRUCTOR,
        unmappedTargetPolicy = IGNORE)
public interface ProjectMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "featured", source = "featured")
    ProjectResponse toResponse(Project project, @Context GitHubRepository repo);

    @AfterMapping
    default void setRepositoryToProjectResponse(@MappingTarget ProjectResponse project, @Context GitHubRepository repo) {
        project.setDescription(repo.description());
        project.setUpdatedAt(repo.updatedAt().toInstant());
        project.setStars(repo.stargazersCount());
        project.setForks(repo.forksCount());
        project.setUrl(URI.create(repo.htmlUrl()));
        project.setTags(repo.topics());

        if (repo.homepage() != null) {
            project.setHomepage(URI.create(repo.homepage()));
        } else {
            project.setHomepage(URI.create(repo.htmlUrl()));
        }
    }

    List<ProjectResponse> toResponseList(List<Project> projects);

    Project toEntity(CreateProjectRequest request);

}
