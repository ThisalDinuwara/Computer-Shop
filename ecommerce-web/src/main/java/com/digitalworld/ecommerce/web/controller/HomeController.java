package com.digitalworld.ecommerce.web.controller;

import com.digitalworld.ecommerce.web.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse HomeControllerHandler(){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Welcome to Digital World Computers");
        return apiResponse;
    }
}
