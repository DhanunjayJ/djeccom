package com.dj.eccom_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findAllByActiveTrueOrderByCreatedAtDesc();
    List<Product> findAllByOrderByCreatedAtDesc();
}
