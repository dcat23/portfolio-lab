package xyz.catuns.lab.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Cache;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import xyz.catuns.lab.domain.dto.CreateProjectRequest;
import xyz.catuns.lab.domain.dto.ProjectResponse;
import xyz.catuns.lab.domain.dto.ProjectSearchRequest;
import xyz.catuns.lab.domain.dto.github.GitHubRepository;
import xyz.catuns.lab.domain.entity.Project;
import xyz.catuns.lab.domain.mapper.ProjectMapper;
import xyz.catuns.lab.domain.repository.ProjectRepository;
import xyz.catuns.lab.service.ProjectService;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectMapper mapper;
    private final ProjectRepository repository;
    private final RestTemplate template;

    @Override
    @Cacheable( value = "projects_list", key = "#request.toString()")
    public List<ProjectResponse> getProjects(ProjectSearchRequest request) {
        log.debug("Cache miss, fetching projects");
        List<Project> projects = repository.findAll();
        List<CompletableFuture<ProjectResponse>> futures = projects.stream()
                .map(project -> CompletableFuture.supplyAsync(() -> {
                    var repo = this.fetchGitHubRepository(project.getOwner(), project.getRepository());
                    return mapper.toResponse(project, repo);
                }))
                .toList();

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
        return futures.stream().map(CompletableFuture::join).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "projects_list", allEntries = true)
    @CachePut(value = "project", key = "#result.id")
    public ProjectResponse createProject(CreateProjectRequest request) {

        // check for existing project
        Project project = repository.findByOwnerAndRepository(
                request.owner(),
                request.repository()
        ).orElseGet(() -> mapper.toEntity(request));

        // fetch details from Github
        GitHubRepository repo = fetchGitHubRepository(request.owner(), request.repository());

        log.info(repo.toString());

        // set default title
        if (project.getTitle() == null) {
            project.setTitle(repo.name());
            project = repository.save(project);
        }

        return mapper.toResponse(project, repo);
    }

    private GitHubRepository fetchGitHubRepository(String owner, String repository) {
        return template.getForObject(
                "/repos/{owner}/{repo}",
                GitHubRepository.class,
                owner, repository
        );
    }
}
