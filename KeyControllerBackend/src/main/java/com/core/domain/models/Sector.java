package com.core.domain.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter
@Entity
@Table(name = "sector")
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE sector SET deleted_at = NOW() WHERE id=?")
@Where(clause = "deleted_at IS NULL")
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Integer id;
    
    @Column(name="name", nullable = false)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "sector", fetch = FetchType.LAZY)
    private Set<Key> keys = new HashSet<>();

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Sector(String name){
        this.name = name;
    }
}
