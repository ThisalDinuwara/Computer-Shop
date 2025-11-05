package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.domain.USER_ROLE;
import com.digitalworld.ecommerce.web.request.LoginRequest;
import com.digitalworld.ecommerce.web.response.AuthResponse;
import com.digitalworld.ecommerce.web.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email, USER_ROLE role) throws Exception;
    String createUser(SignupRequest req) throws Exception;
    AuthResponse signing(LoginRequest req);
}
