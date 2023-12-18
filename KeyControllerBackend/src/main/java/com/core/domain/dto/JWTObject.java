package com.core.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class JWTObject {
    private String token;

    public JWTObject(String token){
        this.token = token;
    }
}
