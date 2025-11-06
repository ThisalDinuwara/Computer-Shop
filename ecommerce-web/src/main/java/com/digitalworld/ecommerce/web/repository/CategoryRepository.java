package com.digitalworld.ecommerce.web.repository;

import com.digitalworld.ecommerce.web.modal.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByCategoryId(String categoryId);
}
