package com.dj.eccom_backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dj.eccom_backend.model.Product;
import com.dj.eccom_backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    public final ProductRepository productRepository;
    private final AuditService auditService;

    public Product addProduct(Product product){
        product.setId(null);
        product.setActive(true);
        Product savedProduct = productRepository.save(product);
        auditService.record("PRODUCT_CREATED", "Product", savedProduct.getId(), savedProduct.getName());
        return savedProduct;
    }

    public List<Product> getAllProducts(){
        return productRepository.findAllByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product updateProduct(Long id, Product update) {
        Product product = findProduct(id);
        product.setName(update.getName());
        product.setDescription(update.getDescription());
        product.setPrice(update.getPrice());
        product.setCategory(update.getCategory());
        product.setStockQuantity(update.getStockQuantity());
        product.setImageUrl(update.getImageUrl());
        Product savedProduct = productRepository.save(product);
        auditService.record("PRODUCT_UPDATED", "Product", id, savedProduct.getName());
        return savedProduct;
    }

    public Product archiveProduct(Long id) {
        Product product = findProduct(id);
        product.setActive(false);
        Product savedProduct = productRepository.save(product);
        auditService.record("PRODUCT_ARCHIVED", "Product", id, savedProduct.getName());
        return savedProduct;
    }

    public Product restoreProduct(Long id) {
        Product product = findProduct(id);
        product.setActive(true);
        Product savedProduct = productRepository.save(product);
        auditService.record("PRODUCT_RESTORED", "Product", id, savedProduct.getName());
        return savedProduct;
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));
    }

}
