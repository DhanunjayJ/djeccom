package com.dj.eccom_backend.model.dto;

import com.dj.eccom_backend.model.UserRole;

public record UserResponse(
    Long id,
    String userName,
    String email,
    UserRole role,
    String accessToken,
    String tokenType,
    long expiresIn
) { 
    
}
