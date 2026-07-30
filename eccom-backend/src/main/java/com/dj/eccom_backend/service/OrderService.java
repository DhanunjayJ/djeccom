package com.dj.eccom_backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dj.eccom_backend.exception.UserException;
import com.dj.eccom_backend.model.Order;
import com.dj.eccom_backend.model.OrderItem;
import com.dj.eccom_backend.model.OrderStatus;
import com.dj.eccom_backend.model.Product;
import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.dto.OrderItemRequest;
import com.dj.eccom_backend.model.dto.OrderRequest;
import com.dj.eccom_backend.repository.OrderRepository;
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
}
