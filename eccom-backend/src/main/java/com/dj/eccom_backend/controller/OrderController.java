package com.dj.eccom_backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getUserOrderHistory(@AuthenticationPrincipal Jwt jwt) {
        List<Order> orders = orderService.getUserOrders(jwt.getSubject());
        return ResponseEntity.ok(orders);
    }
}
