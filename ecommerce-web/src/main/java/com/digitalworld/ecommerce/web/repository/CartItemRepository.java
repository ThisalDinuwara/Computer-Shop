package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Cart;
import com.digitalworld.ecommerce.web.modal.CartItem;
import com.digitalworld.ecommerce.web.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
