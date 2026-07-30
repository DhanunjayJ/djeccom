package com.dj.eccom_backend.model.dto;

import com.dj.eccom_backend.model.UserRole;

import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(
    @NotNull
    UserRole role
) {
}
