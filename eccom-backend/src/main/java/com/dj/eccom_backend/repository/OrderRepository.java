package com.dj.eccom_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.Order;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUserIdOrderByIdDesc(Long userId);
}
