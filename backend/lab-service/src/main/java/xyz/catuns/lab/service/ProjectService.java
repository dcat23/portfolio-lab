package xyz.catuns.lab.service;

import xyz.catuns.lab.domain.dto.CreateProjectRequest;
import xyz.catuns.lab.domain.dto.ProjectResponse;
import xyz.catuns.lab.domain.dto.ProjectSearchRequest;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getProjects(ProjectSearchRequest request);

    ProjectResponse createProject(CreateProjectRequest request);
}
