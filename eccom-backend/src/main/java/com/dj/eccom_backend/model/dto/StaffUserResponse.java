package com.dj.eccom_backend.model.dto;

import com.dj.eccom_backend.model.UserRole;

public record StaffUserResponse(
    Long id,
    String userName,
    String email,
    UserRole role
) {
}
