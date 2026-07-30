package com.dj.eccom_backend.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.model.dto.OrderRequest;
import com.dj.eccom_backend.service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @RequestBody OrderRequest orderRequest,
            @AuthenticationPrincipal Jwt jwt) {
        Order createOrder = orderService.createOrder(orderRequest, jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED).body(createOrder);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getUserOrderHistory(@AuthenticationPrincipal Jwt jwt) {
        List<Order> orders = orderService.getUserOrders(jwt.getSubject());
        return ResponseEntity.ok(orders);
    }
}
