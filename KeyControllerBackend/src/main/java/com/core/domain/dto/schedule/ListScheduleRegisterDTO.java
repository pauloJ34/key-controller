package com.core.domain.dto.schedule;

import com.core.domain.models.Key;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ListScheduleRegisterDTO {
    private Integer id;

    private Key key;

    private boolean caught;
    private boolean returned = false;

    private LocalDateTime acquisitionDate;
    private LocalDateTime devolutionDate;
}
