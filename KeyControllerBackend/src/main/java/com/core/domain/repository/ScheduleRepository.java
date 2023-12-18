package com.core.domain.repository;

import com.core.domain.models.Key;
import com.core.domain.models.Schedule;
import com.core.domain.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query(
        value = "SELECT s FROM Schedule s " +
            "WHERE s.devolutionDate IS NOT NULL " +
            "   AND s.deletedAt IS NULL " +
            "   AND s.key.deletedAt IS NULL " +
            "   AND s.key.sector.deletedAt IS NULL " +
            "   AND s.acquisitionDate >= :startDate " +
            "   AND s.acquisitionDate < :endDate"
    )
    List<Schedule> findByAcquisitionDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(
        value = "SELECT COUNT(s) > 0 " +
            "FROM Schedule s " +
            "WHERE s.key = :key " +
            "   AND s.deletedAt IS NULL " +
            "   AND s.key.deletedAt IS NULL " +
            "   AND s.key.sector.deletedAt IS NULL " +
            "   AND ((s.acquisitionDate <= :endDate " +
            "   AND s.devolutionDate >= :startDate) " +
            "   OR (s.acquisitionDate <= :startDate AND s.devolutionDate >= :startDate))"
    )
    boolean hasConflictingSchedule(@Param("key") Key key, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(s) > 0 " +
            "FROM Schedule s " +
            "WHERE s.user = :user " +
            "AND s.deletedAt IS NULL " +
            "AND s.key.deletedAt IS NULL " +
            "AND s.key.sector.deletedAt IS NULL " +
            "AND s.acquisitionDate <= :devolutionDate " +
            "AND s.devolutionDate >= :acquisitionDate")
    boolean findOverlappingSchedulesForUser(User user, LocalDateTime acquisitionDate, LocalDateTime devolutionDate);

    @Query("SELECT s FROM Schedule s " +
            "WHERE s.user = :user " +
            "AND s.deletedAt IS NULL " +
            "AND s.key.deletedAt IS NULL " +
            "AND s.key.sector.deletedAt IS NULL " +
            "AND s.acquisitionDate <= :endTime " +
            "AND s.acquisitionDate > :startTime " +
            "AND s.caught = false " +
            "AND s.confirmed = true")
    Optional<Schedule> findUserCurrentSchedule(
        @Param("user") User user,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    @Query(value = "SELECT s.* " +
        "FROM schedule AS s " +
        "WHERE s.key_id = :keyId " +
        "   AND s.deleted_at IS NULL " +
        "   AND s.confirmed_devolution_date IS NULL " +
        "   AND s.caught = true " +
        "   AND ((s.acquisition_date <= current_timestamp AND s.devolution_date >= current_timestamp) " +
        "   OR (s.acquisition_date <= current_timestamp AND s.devolution_date IS NULL) " +
        "   OR (s IS NOT NULL AND (s.caught = true " +
        "   OR (s.caught = false AND s.acquisition_date + INTERVAL '15 minutes' <= current_timestamp) " +
        "   AND s.acquisition_date <= current_timestamp)))",
    nativeQuery = true)
    Schedule findOccupiedKeyRegisters(@Param("keyId") Integer keyId);

    @Query(
        value = "SELECT * FROM public.schedule AS s " +
            "WHERE s.user_id = :userId " +
            "   AND s.deleted_at IS NULL " +
            "   AND s.caught = true " +
            "   AND s.returned = false " +
            "LIMIT 1",
        nativeQuery = true
    )
    Optional<Schedule> findByUserIdAndReturnedFalse(@Param("userId") String userId);

    Page<Schedule> findAll(Specification<Object> spec, Pageable pageable);
}
