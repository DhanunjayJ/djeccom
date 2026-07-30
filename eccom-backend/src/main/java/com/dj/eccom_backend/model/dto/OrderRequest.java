package com.dj.eccom_backend.model.dto;

import java.util.List;

public record OrderRequest(
    String shippingAddress,
    List<OrderItemRequest> items
) {
    
}
