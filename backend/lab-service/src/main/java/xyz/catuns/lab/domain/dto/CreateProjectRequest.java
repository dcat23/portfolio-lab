package xyz.catuns.lab.domain.dto;

public record CreateProjectRequest(
        String owner,
        String repository
) {
}
