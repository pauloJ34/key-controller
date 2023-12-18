package com.core.domain.repository;

import com.core.domain.dto.key.ListKeyResultDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.core.domain.models.Key;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KeyRepository extends JpaRepository<Key, Integer>{
    @Query(
            value = "SELECT key.*, " +
                    "EXISTS (" +
                    "   SELECT 1 " +
                    "   FROM schedule AS s " +
                    "   WHERE s.key_id = key.id" +
                    "   AND s.caught = true " +
                    "   AND s.confirmed_devolution_date IS NULL " +
                    "   AND s.deleted_at IS NULL " +
                    "   AND (" +
                    "       (s.acquisition_date <= current_timestamp AND s.devolution_date >= current_timestamp) " +
                    "       OR (s.acquisition_date <= current_timestamp AND s.devolution_date IS NULL) " +
                    "       OR (" +
                    "           (" +
                    "               s.caught = true " +
                    "               OR (s.caught = false AND s.acquisition_date <= current_timestamp + INTERVAL '15 minutes')" +
                    "           ) " +
                    "           AND s.acquisition_date <= current_timestamp" +
                    "       )" +
                    "   )" +
                    ") AS busy " +
                    "FROM (" +
                    "   SELECT " +
                    "       key.id, " +
                    "       key.number, " +
                    "       key.created_at as createdAt, " +
                    "       key.updated_at as updatedAt, " +
                    "       key.sector_id as sectorId, " +
                    "       sector.name AS sectorName " +
                    "   FROM public.key AS key " +
                    "   LEFT JOIN sector AS sector ON sector.id = key.sector_id " +
                    "   WHERE key.deleted_at IS NULL" +
                    "       AND sector.deleted_at IS NULL " +
                    "       AND (:sectorId IS NULL OR key.sector_id = :sectorId) " +
                    "       AND (:search IS NULL OR key.number LIKE %:search%) " +
                    ") AS key " +
                    "WHERE (:isBusy IS NULL OR " +
                    "   EXISTS (" +
                    "       SELECT s.* " +
                    "       FROM schedule AS s " +
                    "       WHERE s.key_id = key.id" +
                    "       AND s.deleted_at IS NULL " +
                    "       AND s.confirmed_devolution_date IS NULL " +
                    "       AND (" +
                    "           (s.acquisition_date <= current_timestamp AND s.devolution_date >= current_timestamp) " +
                    "           OR (s.acquisition_date <= current_timestamp AND s.devolution_date IS NULL) " +
                    "           OR (" +
                    "               (" +
                    "                   s.caught = true " +
                    "                   OR (s.caught = false AND s.acquisition_date <= current_timestamp + INTERVAL '15 minutes')" +
                    "               ) " +
                    "               AND s.acquisition_date <= current_timestamp" +
                    "           )" +
                    "       )" +
                    "   ) = :isBusy)" +
                    "ORDER BY key.number ASC",
            countQuery = "SELECT COUNT(*) FROM key",
            nativeQuery = true
    )
    Page<ListKeyResultDTO> findAll(
            Pageable pageable,
            @Param("search") String search,
            @Param("sectorId") Integer sectorId,
            @Param("isBusy") Boolean isBusy
    );

    @Query(
        value = "SELECT key.*, " +
                "EXISTS (" +
                "   SELECT s.* " +
                "   FROM schedule AS s " +
                "   WHERE s.key_id = key.id " +
                "   AND s.confirmed_devolution_date IS NULL " +
                "   AND (" +
                "       (s.acquisition_date <= current_timestamp AND s.devolution_date >= current_timestamp) " +
                "       OR (s.acquisition_date <= current_timestamp AND s.devolution_date IS NULL) " +
                "       OR (" +
                "           (" +
                "               s.caught = true " +
                "               OR (s.caught = false AND s.acquisition_date <= current_timestamp + INTERVAL '15 minutes')" +
                "           ) " +
                "           AND s.acquisition_date <= current_timestamp" +
                "       )" +
                "   )" +
                ") AS busy " +
                "FROM (" +
                "   SELECT " +
                "       key.id, " +
                "       key.number, " +
                "       key.created_at as createdAt, " +
                "       key.updated_at as updatedAt, " +
                "       key.sector_id as sectorId, " +
                "       sector.name AS sectorName " +
                "   FROM public.key AS key " +
                "   LEFT JOIN sector AS sector ON sector.id = key.sector_id " +
                "   WHERE key.deleted_at IS NULL " +
                "       AND key.sector_id = :sectorId" +
                "       AND sector.deleted_at IS NULL " +
                ") AS key " +
                "ORDER BY number ASC",
        countQuery = "SELECT COUNT(*) FROM key",
        nativeQuery = true
    )
    List<ListKeyResultDTO> findAllBySectorId( @Param("sectorId") Integer sectorId);
}
