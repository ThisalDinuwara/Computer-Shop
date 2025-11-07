package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.modal.Cart;
import com.digitalworld.ecommerce.web.modal.CartItem;
import com.digitalworld.ecommerce.web.modal.Product;
import com.digitalworld.ecommerce.web.modal.User;

public interface CartService {

    public CartItem addCartItem(
            User user,
            Product product,
            String size,
            int quantity
    );
    public Cart findUserCart(User user);
}
