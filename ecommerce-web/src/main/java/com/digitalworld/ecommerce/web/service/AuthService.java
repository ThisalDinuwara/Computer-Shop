package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.response.SignupRequest;

public interface AuthService {

    String createUser(SignupRequest req);
}
