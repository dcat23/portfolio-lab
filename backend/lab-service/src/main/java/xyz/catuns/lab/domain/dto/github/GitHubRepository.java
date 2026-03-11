package xyz.catuns.lab.domain.dto.github;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

// Main DTO for GitHub Repository response from GET /repos/{owner}/{repo}
public record GitHubRepository(
        @JsonProperty("id") long id,
        @JsonProperty("node_id") String nodeId,
        String name,
        @JsonProperty("full_name") String fullName,
        Owner owner,
        String description,
        boolean fork,
        @JsonProperty("created_at") OffsetDateTime createdAt,
        @JsonProperty("updated_at") OffsetDateTime updatedAt,
        @JsonProperty("pushed_at") OffsetDateTime pushedAt,
        @JsonProperty("html_url") String htmlUrl,
        String url,
        @JsonProperty("clone_url") String cloneUrl,
        @JsonProperty("default_branch") String defaultBranch,
        @JsonProperty("stargazers_count") int stargazersCount,
        @JsonProperty("watchers_count") int watchersCount,
        @JsonProperty("forks_count") int forksCount,
        @JsonProperty("open_issues_count") int openIssuesCount,
        int size,
        License license,
        String language,
        Set<String> topics,
        boolean archived,
        boolean disabled,
        boolean privateRepo,  // Note: 'private' is reserved in Java
        @JsonProperty("visibility") String visibility,
        boolean hasIssues,
        boolean hasProjects,
        boolean hasWiki,
        boolean hasPages,
        boolean hasDownloads,
        Permissions permissions,
        String homepage
) {}

record Owner(
        String login,
        long id,
        @JsonProperty("avatar_url") String avatarUrl,
        String url,
        @JsonProperty("html_url") String htmlUrl,
        @JsonProperty("type") String type
) {}

record License(
        String key,
        String name,
        String url
) {}

record Permissions(
        boolean admin,
        boolean push,
        boolean pull
) {}
