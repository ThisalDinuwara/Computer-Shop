package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.SellerReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReportRepository extends JpaRepository<SellerReport,Long> {
    SellerReport findBySellerId(Long sellerId);
}
