package com.dj.eccom_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dj.eccom_backend.model.Product;
import com.dj.eccom_backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    public final ProductRepository productRepository;

    public Product addProduct(Product product){
        return productRepository.save(product);
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

}
