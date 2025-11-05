package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.modal.User;

public interface UserService {

     User findUserByJwtToken(String jwt) throws Exception;
     User findUserByEmail(String email) throws Exception;
}
