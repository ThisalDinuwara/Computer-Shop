package com.digitalworld.ecommerce.web.response;

import com.digitalworld.ecommerce.web.domain.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private USER_ROLE role;
}
