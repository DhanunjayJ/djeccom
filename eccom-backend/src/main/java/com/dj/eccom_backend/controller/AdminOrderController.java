package com.dj.eccom_backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.model.OrderStatusHistory;
import com.dj.eccom_backend.model.dto.OrderStatusUpdateRequest;
import com.dj.eccom_backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT', 'FULFILLMENT')")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}/history")
    public List<OrderStatusHistory> getOrderHistory(@PathVariable Long id) {
        return orderService.getStatusHistory(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FULFILLMENT')")
    public Order updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return orderService.updateStatus(
                id,
                request.status(),
                request.note(),
                jwt.getSubject(),
                jwt.getClaimAsString("role"));
    }
}
