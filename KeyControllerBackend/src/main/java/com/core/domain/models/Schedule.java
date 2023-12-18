package com.core.domain.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "schedule")
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE schedule SET deleted_at = NOW() WHERE id=?")
@Where(clause = "deleted_at IS NULL")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne()
    @JoinColumn(name = "keyId", referencedColumnName = "id", nullable = false)
    private Key key;

    @ManyToOne()
    @JoinColumn(name = "userId", referencedColumnName = "registry", nullable = false)
    private User user;

    @Column()
    private boolean confirmed = false;

    @Column()
    private boolean caught;

    @Column()
    private boolean returned;

    @Column(nullable = false)
    private LocalDateTime acquisitionDate;

    @Column()
    private LocalDateTime devolutionDate;

    @Column()
    private LocalDateTime confirmedDevolutionDate;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Schedule(Key key, User user) {
        this.key = key;
        this.user = user;
        this.acquisitionDate = LocalDateTime.now();
        this.returned = false;
        this.caught = false;
        this.confirmed = false;
    }
}
