package com.core.domain.dto.schedule;

import com.core.domain.models.Schedule;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ScheduleInUseDTO {
    private Integer id;

    private boolean returned = false;

    private LocalDateTime acquisitionDate;

    private LocalDateTime devolutionDate;

    private String keyNumber;

    private String sectorName;

    public ScheduleInUseDTO(Schedule schedule) {
        this.id = schedule.getId();
        this.returned = schedule.isReturned();
        this.acquisitionDate = schedule.getAcquisitionDate();
        this.devolutionDate = schedule.getDevolutionDate();
        this.keyNumber = schedule.getKey().getNumber();
        this.sectorName = schedule.getKey().getSector().getName();
    }
}
