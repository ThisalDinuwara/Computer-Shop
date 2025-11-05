package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode,Long> {

    VerificationCode findByEmail(String email);
}
