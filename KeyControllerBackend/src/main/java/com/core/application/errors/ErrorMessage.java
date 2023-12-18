package com.core.application.errors;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ErrorMessage {
    private int status;
    private String detail;

}
