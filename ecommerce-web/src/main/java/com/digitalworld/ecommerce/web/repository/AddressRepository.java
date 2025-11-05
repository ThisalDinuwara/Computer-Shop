package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
