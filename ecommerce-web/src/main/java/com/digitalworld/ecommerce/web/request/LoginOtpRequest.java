package com.digitalworld.ecommerce.web.request;

import com.digitalworld.ecommerce.web.domain.USER_ROLE;
import lombok.Data;

@Data
public class LoginOtpRequest {
    private String email;
    private String otp;
    private USER_ROLE role;
}
