package com.core.application.controllers;

import com.core.domain.dto.schedule.CreateScheduleDTO;
import com.core.domain.dto.schedule.ScheduleInUseDTO;
import com.core.domain.models.Key;
import com.core.domain.models.Schedule;
import com.core.domain.models.User;
import com.core.domain.models.UserType;
import com.core.domain.repository.KeyRepository;
import com.core.domain.repository.ScheduleRepository;
import com.core.domain.repository.UserRepository;
import com.core.infra.security.annotations.EnsureUserType;
import com.core.infra.security.annotations.JwtAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
public class ScheduleController {
    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    KeyRepository keyRepository;

    @GetMapping("/schedule")
    public List<Schedule> list(
        @RequestParam("startDate")
        LocalDateTime startDate,
        @RequestParam("endDate")
        LocalDateTime endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'startDate' and 'endDate' query params are required");
        }

        return scheduleRepository.findByAcquisitionDateRange(startDate, endDate);
    }

    @GetMapping("/schedule/history")
    public Page<Schedule> listRegisters(
        @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
        @RequestParam(value = "currentPage", required = false, defaultValue = "0") int currentPage,
        @RequestParam(value = "notReturned", required = false) boolean notReturned,
        @RequestParam(value = "notConfirmed", required = false) boolean notConfirmed
    ) {
        Pageable pageable = PageRequest.of(currentPage, pageSize, Sort.by("acquisitionDate").descending());
        Specification<Object> spec = Specification
            .where((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("deletedAt")))
            .and((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("key").get("deletedAt")))
            .and((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("key").get("sector").get("deletedAt")));

        if (notReturned) {
            spec = spec
                .and((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("confirmedDevolutionDate")))
                .and((root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("caught")))
                .and((root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("returned")));
        }

        if (notConfirmed) {
            spec = spec
                .and((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("confirmedDevolutionDate")))
                .and((root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("confirmed")));
        }

        return scheduleRepository.findAll(spec, pageable);
    }

    @GetMapping("/schedule/current")
    @JwtAuthentication
    public Schedule getCurrentSchedule(@RequestAttribute("registry") String registry) {
        User user = userRepository.findByRegistry(registry);
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime startTime = currentTime.minus(15, ChronoUnit.MINUTES);
        LocalDateTime endTime = currentTime.plus(15, ChronoUnit.MINUTES);

        return scheduleRepository.findUserCurrentSchedule(user, startTime, endTime).orElse(null);
    }

    @GetMapping("/schedule/key/in-use")
    @JwtAuthentication
    public ScheduleInUseDTO getCurrentScheduleInUse(@RequestAttribute("registry") String registry) {
        Schedule schedule = scheduleRepository.findByUserIdAndReturnedFalse(registry).orElse(null);

        if (schedule == null) {
            return null;
        }

        return new ScheduleInUseDTO(schedule);
    }

    @PostMapping("/schedule")
    @JwtAuthentication
    public Schedule create(
        @RequestBody CreateScheduleDTO dto,
        @RequestAttribute("registry") String registry
    ) {
        User user = userRepository.findByRegistry(registry);
        Key key = keyRepository.findById(dto.getKeyId()).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found");
        }

        if (key == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Key not found");
        }

        LocalDateTime now = LocalDateTime.now();
        boolean isInvalidAcquisitionDate = dto.getAcquisitionDate() == null
            || dto.getAcquisitionDate().equals(now)
            || dto.getAcquisitionDate().isBefore(now);

        boolean isInvalidDevolutionDate = dto.getDevolutionDate() == null
            || dto.getDevolutionDate().equals(dto.getAcquisitionDate())
            || dto.getDevolutionDate().isBefore(dto.getAcquisitionDate());

        if (isInvalidAcquisitionDate) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid acquisitionDate");
        }

        if (isInvalidDevolutionDate) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid devolutionDate");
        }

        boolean hasConflict = scheduleRepository.hasConflictingSchedule(key, dto.getAcquisitionDate(), dto.getDevolutionDate());

        if (hasConflict) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Schedule conflict");
        }

        boolean hasAnotherSchedule = scheduleRepository.findOverlappingSchedulesForUser(user, dto.getAcquisitionDate(), dto.getDevolutionDate());

        if (hasAnotherSchedule) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cant have multiple schedules at same time");
        }

        Schedule schedule = new Schedule();
        schedule.setUser(user);
        schedule.setKey(key);
        schedule.setAcquisitionDate(dto.getAcquisitionDate());
        schedule.setDevolutionDate(dto.getDevolutionDate());

        if (user.getType() != UserType.STUDENT) {
            schedule.setConfirmed(true);
        }

        scheduleRepository.save(schedule);

        return schedule;
    }

    @PostMapping("/schedule/now/{keyId}")
    @JwtAuthentication
    public Schedule createNow(
        @PathVariable(value = "keyId") String keyId,
        @RequestAttribute("registry") String registry
    ) {
        User user = userRepository.findByRegistry(registry);
        Key key = keyRepository.findById(Integer.parseInt(keyId)).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found");
        }

        if (key == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Key not found");
        }

        if (user.getType() == UserType.STUDENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied");
        }

        Optional<Schedule> userHasKeyInUse = scheduleRepository.findByUserIdAndReturnedFalse(user.getRegistry());
        Schedule isKeyBusy = scheduleRepository.findOccupiedKeyRegisters(key.getId());

        if (isKeyBusy != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key is busy");
        }

        if (userHasKeyInUse.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cant have two keys at same time");
        }

        Schedule register = new Schedule(key, user);
        register.setCaught(true);
        register.setConfirmed(true);
        scheduleRepository.save(register);

        return register;
    }

    @PatchMapping("/schedule/{id}/approve")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    public void approve(
        @PathVariable(value = "id") String id,
        @RequestParam(value = "approve", required = true) boolean approve
    ) {
        Schedule schedule = scheduleRepository.findById(Integer.parseInt(id)).orElse(null);

        if (schedule == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Key not found");
        }

        if (schedule.isCaught()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key already caught");
        }

        if (approve) {
            schedule.setCaught(false);
            schedule.setConfirmed(true);
            scheduleRepository.save(schedule);
        } else {
            scheduleRepository.deleteById(schedule.getId());
        }
    }

    @PatchMapping("/schedule/{id}/confirm")
    @JwtAuthentication
    public void confirm(
        @PathVariable(value = "id") String id,
        @RequestAttribute("registry") String registry
    ) {
        Schedule schedule = scheduleRepository.findById(Integer.parseInt(id)).orElse(null);

        if (schedule == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Key not found");
        }

        if (!schedule.getUser().getRegistry().equals(registry)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied");
        }

        Schedule userHasKeyInUse = scheduleRepository.findByUserIdAndReturnedFalse(registry).orElse(null);
        Schedule isKeyBusy = scheduleRepository.findOccupiedKeyRegisters(schedule.getId());

        if (isKeyBusy != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key is busy");
        }

        if (userHasKeyInUse != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cant have two keys at same time");
        }

        schedule.setCaught(true);
        scheduleRepository.save(schedule);
    }

    @PatchMapping("/schedule/{id}/return")
    @JwtAuthentication
    public void giveKeyBack(
        @PathVariable(value = "id") Integer id,
        @RequestAttribute("registry") String registry
    ) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shedule Not Found");
        }

        Schedule key = scheduleRepository.findById(id).get();

        if (!key.getUser().getRegistry().equals(registry)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This register is not your");
        }

        if (key.isReturned()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key already returned");
        }

        key.setReturned(true);
        key.setDevolutionDate(LocalDateTime.now());

        scheduleRepository.save(key);
    }

    @PatchMapping("/schedule/{id}/confirm-return")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    public void confirmKeyBack(
        @PathVariable(value = "id") Integer id,
        @RequestParam(name = "returned", required = true) Boolean returned
    ) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shedule Not Found");
        }

        Schedule key = scheduleRepository.findById(id).get();

        if (key.getConfirmedDevolutionDate() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key already returned");
        }

        if (!returned) {
            key.setReturned(false);
        } else {
            key.setConfirmedDevolutionDate(LocalDateTime.now());
        }

        scheduleRepository.save(key);
    }

    @PatchMapping("/schedule/{id}/cancel")
    @JwtAuthentication
    public void cancel(
        @PathVariable(value = "id") Integer id,
        @RequestAttribute("registry") String registry
    ) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Schedule Not Found");
        }

        Schedule key = scheduleRepository.findById(id).get();

        if (!key.getUser().getRegistry().equals(registry)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This register is not your");
        }

        scheduleRepository.deleteById(key.getId());
    }
}
