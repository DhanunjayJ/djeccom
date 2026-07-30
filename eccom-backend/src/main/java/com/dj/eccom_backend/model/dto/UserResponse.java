package com.dj.eccom_backend.model.dto;

public record UserResponse(
    Long id,
    String userName,
    String email,
    String accessToken,
    String tokenType,
    long expiresIn
) { 
    
}
