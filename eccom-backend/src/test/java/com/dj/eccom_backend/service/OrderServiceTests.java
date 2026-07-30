package com.dj.eccom_backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.model.OrderStatus;
import com.dj.eccom_backend.model.OrderStatusHistory;
import com.dj.eccom_backend.repository.OrderRepository;
import com.dj.eccom_backend.repository.OrderStatusHistoryRepository;
import com.dj.eccom_backend.repository.ProductRepository;
import com.dj.eccom_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class OrderServiceTests {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderStatusHistoryRepository statusHistoryRepository;
    @Mock
    private AuditService auditService;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(
                orderRepository,
                userRepository,
                productRepository,
                statusHistoryRepository,
                auditService);
    }

    @Test
    void fulfillmentCanConfirmPaidOrderAndCreatesHistory() {
        Order order = order(10L, OrderStatus.PAID);
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order updated = orderService.updateStatus(
                10L,
                OrderStatus.CONFIRMED,
                "Stock checked",
                "warehouse@example.com",
                "FULFILLMENT");

        assertEquals(OrderStatus.CONFIRMED, updated.getStatus());
        ArgumentCaptor<OrderStatusHistory> historyCaptor =
                ArgumentCaptor.forClass(OrderStatusHistory.class);
        verify(statusHistoryRepository).save(historyCaptor.capture());
        assertEquals(OrderStatus.PAID, historyCaptor.getValue().getFromStatus());
        assertEquals(OrderStatus.CONFIRMED, historyCaptor.getValue().getToStatus());
        verify(auditService).record(
                "ORDER_STATUS_UPDATED",
                "Order",
                10L,
                "PAID -> CONFIRMED | Stock checked");
    }

    @Test
    void fulfillmentCannotCancelOrder() {
        when(orderRepository.findById(10L))
                .thenReturn(Optional.of(order(10L, OrderStatus.PAID)));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orderService.updateStatus(
                        10L,
                        OrderStatus.CANCELLED,
                        "",
                        "warehouse@example.com",
                        "FULFILLMENT"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void invalidTransitionIsRejected() {
        when(orderRepository.findById(10L))
                .thenReturn(Optional.of(order(10L, OrderStatus.PAID)));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> orderService.updateStatus(
                        10L,
                        OrderStatus.SHIPPED,
                        "",
                        "admin@example.com",
                        "ADMIN"));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private Order order(Long id, OrderStatus status) {
        Order order = new Order();
        order.setId(id);
        order.setStatus(status);
        return order;
    }
}
