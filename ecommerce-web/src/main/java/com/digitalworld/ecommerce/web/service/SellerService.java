package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.domain.AccountStatus;
import com.digitalworld.ecommerce.web.exceptions.SellerException;
import com.digitalworld.ecommerce.web.modal.Seller;

import java.util.List;

public interface SellerService {

    Seller getSellerProfile(String jwt) throws Exception;
    Seller createSeller(Seller seller) throws Exception;
    Seller getSellerById(Long id) throws SellerException;
    Seller getSellerByEmail(String email) throws Exception;
    List<Seller> getAllSellers(AccountStatus status);
    Seller updateSeller(Long id, Seller seller) throws Exception;
    void deleteSeller(Long id) throws Exception;
    Seller verifyEmail(String email,String otp) throws Exception;
    Seller updateSellerAccount(Long sellerId, AccountStatus status) throws Exception;
}
