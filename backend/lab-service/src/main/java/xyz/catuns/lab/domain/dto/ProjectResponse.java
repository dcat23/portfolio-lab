package xyz.catuns.lab.domain.dto;

import lombok.Data;
import xyz.catuns.lab.domain.entity.ProjectStatus;

import java.net.URI;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
public class ProjectResponse {
    private UUID id;
    private String title;
    private String description;
    private ProjectStatus status;
    private Set<String> tags;
    private Instant updatedAt;
    private Integer stars;
    private Integer forks;
    private URI url;
    private URI homepage;
    private Boolean featured;
}
