package xyz.catuns.lab.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.catuns.lab.domain.dto.ProjectResponse;
import xyz.catuns.lab.domain.dto.ProjectSearchRequest;
import xyz.catuns.lab.domain.dto.CreateProjectRequest;
import xyz.catuns.lab.service.ProjectService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/projects")
@Tag(name = "Project")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping(value = "")
    @Operation(summary = "Get Projects", description = "Get Projects")
    @ApiResponse(responseCode = "200",description = "HTTP Status OK")
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @ModelAttribute ProjectSearchRequest request
    ) {
        List<ProjectResponse> response = projectService.getProjects(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PostMapping(value = "")
    @Operation(summary = "Create Project", description = "Create Project")
    @ApiResponse(responseCode = "201",description = "HTTP Status CREATED")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody CreateProjectRequest request
    ){
        ProjectResponse response = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
