package xyz.catuns.lab.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "projects", uniqueConstraints = {
        @UniqueConstraint(name = "uc_owner_repository", columnNames = {"owner", "repository"})
})
public class Project {

    @Id
    @Setter(value = AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status;

    @Column(name = "owner", nullable = false)
    private String owner;

    @Column(name = "repository" , nullable = false)
    private String repository;

    @Column(name = "featured")
    private boolean featured;

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = ProjectStatus.IN_PROGRESS;
        }
    }

}
