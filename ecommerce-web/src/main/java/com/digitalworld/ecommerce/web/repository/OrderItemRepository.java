package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Order;
import com.digitalworld.ecommerce.web.modal.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}
