package com.core.domain.repository;

import com.core.domain.models.Key;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.core.domain.models.Sector;

public interface SectorRepository extends JpaRepository<Sector, Integer> {
    Page<Sector> findAll(Specification<Sector> spec, Pageable pageable);
}
