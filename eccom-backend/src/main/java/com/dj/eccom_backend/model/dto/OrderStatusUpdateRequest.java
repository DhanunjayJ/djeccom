package com.dj.eccom_backend.model.dto;

import com.dj.eccom_backend.model.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
    @NotNull
    OrderStatus status,
    String note
) {
}
