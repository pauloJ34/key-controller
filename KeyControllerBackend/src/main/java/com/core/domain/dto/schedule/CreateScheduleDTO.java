package com.core.domain.dto.schedule;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Getter
@Setter
public class CreateScheduleDTO {
    private Integer keyId;
    private LocalDateTime acquisitionDate;
    private LocalDateTime devolutionDate;
}
