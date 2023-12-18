package com.core.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

@Getter @Setter
@Entity
@Table(name = "key")
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE key SET deleted_at = NOW() WHERE id=?")
@Where(clause = "deleted_at IS NULL")
public class Key {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    private String number;

    @ManyToOne()
    @JoinColumn(name = "sectorId", referencedColumnName = "id")
    private Sector sector;

    @JsonIgnore
    @OneToMany(mappedBy = "key", fetch = FetchType.LAZY)
    private Set<Schedule> schedules = new HashSet<>();
    
    @Column (name = "created_at")
    @CreationTimestamp
    private LocalDateTime createAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Key(Sector sectorId, String number) {
        this.sector = sectorId;
        this.number = number;
    }
}
