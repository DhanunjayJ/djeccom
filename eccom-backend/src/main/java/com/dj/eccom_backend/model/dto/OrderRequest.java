package com.dj.eccom_backend.model.dto;

import java.util.List;

public record OrderRequest(
    String email,
    String shippingAddress,
    List<OrderItemRequest> items
) {
    
}
