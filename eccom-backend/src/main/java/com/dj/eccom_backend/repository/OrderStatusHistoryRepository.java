package com.dj.eccom_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.OrderStatusHistory;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(Long orderId);
}
