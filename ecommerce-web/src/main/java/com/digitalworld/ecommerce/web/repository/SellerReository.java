package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReository extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);
}
