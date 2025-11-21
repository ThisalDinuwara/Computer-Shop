package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Cart;
import com.digitalworld.ecommerce.web.modal.CartItem;
import com.digitalworld.ecommerce.web.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);

    // Method to delete cart items by product ID
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    // Optional: Method to count cart items by product ID
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);
}