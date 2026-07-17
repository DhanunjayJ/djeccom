package com.dj.eccom_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
    
}
