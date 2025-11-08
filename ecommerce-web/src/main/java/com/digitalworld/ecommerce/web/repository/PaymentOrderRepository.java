package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder,Long> {

    PaymentOrder findByPaymentLinkId(String paymentID);
}
