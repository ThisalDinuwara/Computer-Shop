package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.domain.AccountStatus;
import com.digitalworld.ecommerce.web.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);
    List<Seller> findByAccountStatus(AccountStatus status);
}
