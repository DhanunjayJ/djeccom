package com.dj.eccom_backend.model.dto;

public record OrderItemRequest(
    Long productId,
    Integer quantity
) {
    
}
