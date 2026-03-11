package xyz.catuns.lab.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.CascadeType.*;

@Getter
@Setter
@Entity
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @Setter(value = AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", unique = true, nullable = false)
    private String slug;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "excerpt")
    private String excerpt;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @ElementCollection
    @JoinTable(name = "post_tags")
    private Set<String> tags = new HashSet<>();

    private Boolean featured;
    private String color;

    @ManyToOne(cascade = {PERSIST, DETACH, REFRESH, MERGE})
    @JoinColumn(name = "author_id")
    private Author author;
}
