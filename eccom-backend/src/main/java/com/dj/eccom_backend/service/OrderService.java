package com.dj.eccom_backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dj.eccom_backend.exception.UserException;
import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.model.OrderItem;
import com.dj.eccom_backend.model.OrderStatus;
import com.dj.eccom_backend.model.OrderStatusHistory;
import com.dj.eccom_backend.model.Product;
import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.dto.OrderItemRequest;
import com.dj.eccom_backend.model.dto.OrderRequest;
import com.dj.eccom_backend.repository.OrderRepository;
import com.dj.eccom_backend.repository.OrderStatusHistoryRepository;
import com.dj.eccom_backend.repository.ProductRepository;
import com.dj.eccom_backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final AuditService auditService;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS =
            buildAllowedTransitions();

    private static final Set<OrderStatus> FULFILLMENT_TARGET_STATUSES = EnumSet.of(
            OrderStatus.CONFIRMED,
            OrderStatus.PACKED,
            OrderStatus.SHIPPED,
            OrderStatus.IN_TRANSIT,
            OrderStatus.DELIVERY_FAILED,
            OrderStatus.DELIVERED,
            OrderStatus.RETURNED);

    @Transactional
    public Order createOrder(OrderRequest request, String authenticatedEmail){

        User user = userRepository.findByEmail(authenticatedEmail)
                    .orElseThrow(() -> new UserException("User not found with email :" + authenticatedEmail));

        Order order = new Order();
        
        order.setUser(user);
        order.setShippingAddress(request.shippingAddress());
        order.setStatus(OrderStatus.PAID);

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for(OrderItemRequest itemRequest : request.items()){
            Product product = productRepository.findById(itemRequest.productId()).orElseThrow(() -> new RuntimeException("Product not found: "+ itemRequest.productId())); 

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Product is no longer available: " + product.getName());
            }

            if(product.getStockQuantity() < itemRequest.quantity()){
                throw new RuntimeException("Not enough stock for product: "+ product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItems.add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));

            calculatedTotal = calculatedTotal.add(itemTotal);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(calculatedTotal);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String email){
        User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserException("User not found with email :" + email));
        
        return orderRepository.findByUserIdOrderByIdDesc(user.getId());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    public List<OrderStatusHistory> getStatusHistory(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        return statusHistoryRepository.findByOrderIdOrderByChangedAtAsc(orderId);
    }

    @Transactional
    public Order updateStatus(
            Long orderId,
            OrderStatus requestedStatus,
            String note,
            String actorEmail,
            String actorRole) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));

        OrderStatus currentStatus = order.getStatus();
        Set<OrderStatus> allowedTargets =
                ALLOWED_TRANSITIONS.getOrDefault(currentStatus, Set.of());

        if (!allowedTargets.contains(requestedStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid order transition from " + currentStatus + " to " + requestedStatus);
        }

        if ("FULFILLMENT".equals(actorRole)
                && !FULFILLMENT_TARGET_STATUSES.contains(requestedStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Fulfilment staff cannot set order status to " + requestedStatus);
        }

        order.setStatus(requestedStatus);
        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setFromStatus(currentStatus);
        history.setToStatus(requestedStatus);
        history.setChangedBy(actorEmail);
        history.setNote(note == null ? "" : note.trim());
        statusHistoryRepository.save(history);

        auditService.record(
                "ORDER_STATUS_UPDATED",
                "Order",
                orderId,
                currentStatus + " -> " + requestedStatus
                        + (note == null || note.isBlank() ? "" : " | " + note.trim()));
        return savedOrder;
    }

    private static Map<OrderStatus, Set<OrderStatus>> buildAllowedTransitions() {
        Map<OrderStatus, Set<OrderStatus>> transitions = new EnumMap<>(OrderStatus.class);
        transitions.put(OrderStatus.PENDING_PAYMENT,
                EnumSet.of(OrderStatus.PAID, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED));
        transitions.put(OrderStatus.PAID,
                EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.REFUNDED));
        transitions.put(OrderStatus.CONFIRMED,
                EnumSet.of(OrderStatus.PACKED, OrderStatus.CANCELLED));
        transitions.put(OrderStatus.PACKED, EnumSet.of(OrderStatus.SHIPPED));
        transitions.put(OrderStatus.SHIPPED,
                EnumSet.of(OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED));
        transitions.put(OrderStatus.IN_TRANSIT,
                EnumSet.of(OrderStatus.DELIVERED, OrderStatus.DELIVERY_FAILED));
        transitions.put(OrderStatus.DELIVERY_FAILED,
                EnumSet.of(OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED));
        transitions.put(OrderStatus.DELIVERED, EnumSet.of(OrderStatus.RETURN_REQUESTED));
        transitions.put(OrderStatus.RETURN_REQUESTED,
                EnumSet.of(OrderStatus.RETURNED, OrderStatus.RETURN_REJECTED));
        transitions.put(OrderStatus.RETURNED, EnumSet.of(OrderStatus.REFUNDED));
        return transitions;
    }
}
