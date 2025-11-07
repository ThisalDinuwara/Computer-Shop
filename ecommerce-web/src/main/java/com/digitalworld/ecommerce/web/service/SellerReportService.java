package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.modal.Seller;
import com.digitalworld.ecommerce.web.modal.SellerReport;

public interface SellerReportService {
    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}
