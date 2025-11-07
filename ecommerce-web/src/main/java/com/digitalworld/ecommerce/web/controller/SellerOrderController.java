package com.digitalworld.ecommerce.web.controller;

import com.digitalworld.ecommerce.web.domain.OrderStatus;
import com.digitalworld.ecommerce.web.exceptions.SellerException;
import com.digitalworld.ecommerce.web.modal.Order;
import com.digitalworld.ecommerce.web.modal.Seller;
import com.digitalworld.ecommerce.web.response.ApiResponse;
import com.digitalworld.ecommerce.web.service.OrderService;
import com.digitalworld.ecommerce.web.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersHandler(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        Seller seller=sellerService.getSellerProfile(jwt);
        List<Order> orders=orderService.sellersOrder(seller.getId());

        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus
    ) throws Exception {

        Order order=orderService.updateOrderStatus(orderId,orderStatus);

        return new ResponseEntity<>(order,HttpStatus.ACCEPTED);
    }
}
