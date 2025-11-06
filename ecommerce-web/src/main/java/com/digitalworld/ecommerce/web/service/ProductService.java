package com.digitalworld.ecommerce.web.service;

import com.digitalworld.ecommerce.web.exceptions.ProductException;
import com.digitalworld.ecommerce.web.modal.Product;
import com.digitalworld.ecommerce.web.modal.Seller;
import com.digitalworld.ecommerce.web.request.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    public Product createProduct(CreateProductRequest req, Seller seller);
    public void deleteProduct(Long productId) throws ProductException;
    public Product updateProduct(Long productId,Product product) throws ProductException;
    Product findProductById(Long productId) throws ProductException;
    List<Product>searchProducts();
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber
    );
    List<Product>getProductBySellerId(Long sellerId);
}
