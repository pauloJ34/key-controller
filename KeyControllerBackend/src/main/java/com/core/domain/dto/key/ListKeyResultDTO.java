package com.core.domain.dto.key;

import com.core.domain.models.Sector;

import java.util.Date;

public interface ListKeyResultDTO {
    Integer getId();
    String getNumber();
    boolean isBusy();
    Integer getSectorId();
    String getSectorName();
    Date getCreatedAt();
    Date getUpdatedAt();
}
