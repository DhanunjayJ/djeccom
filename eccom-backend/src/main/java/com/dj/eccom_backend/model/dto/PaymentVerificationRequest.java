package com.dj.eccom_backend.model.dto;

public record PaymentVerificationRequest(
    String razorpayPaymentId,
    String razorpayOrderId,
    String razorpaySignature,
    OrderRequest orderRequest
) {
    
}
