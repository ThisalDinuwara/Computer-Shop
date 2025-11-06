package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    // Custom method to find products by seller ID
    List<Product> findBySellerId(Long sellerId);
}