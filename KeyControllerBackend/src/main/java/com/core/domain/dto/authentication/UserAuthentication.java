package com.core.domain.dto.authentication;

import com.core.domain.models.UserType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserAuthentication {
    // private String registry;
    // private String username;
    // private String type;
    private String username;    
    private String password;

}
