package xyz.catuns.lab.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import xyz.catuns.lab.domain.dto.BlogPostResponse;
import xyz.catuns.lab.domain.dto.CreateBlogPostRequest;
import xyz.catuns.lab.domain.entity.BlogPost;

import java.util.List;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(
    componentModel = SPRING,
    injectionStrategy = CONSTRUCTOR,
    unmappedTargetPolicy = IGNORE)
public interface BlogPostMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "author", ignore = true)
    BlogPost toEntity(CreateBlogPostRequest request);

    @Mapping(target = "date", source = "updatedAt")
    BlogPostResponse toResponse(BlogPost post);

    List<BlogPostResponse> toResponseList(List<BlogPost> blogs);
}
