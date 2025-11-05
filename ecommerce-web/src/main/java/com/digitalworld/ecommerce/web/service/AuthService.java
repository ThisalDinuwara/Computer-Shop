package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email) throws Exception;
    String createUser(SignupRequest req) throws Exception;
}
