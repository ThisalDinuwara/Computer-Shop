package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {


}
