package com.dj.eccom_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

}
