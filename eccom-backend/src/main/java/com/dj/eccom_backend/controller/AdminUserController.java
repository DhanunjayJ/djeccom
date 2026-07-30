package com.dj.eccom_backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.dto.RoleUpdateRequest;
import com.dj.eccom_backend.model.dto.StaffUserResponse;
import com.dj.eccom_backend.service.AdminUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<StaffUserResponse> getUsers() {
        return adminUserService.getUsers();
    }

    @PatchMapping("/{id}/role")
    public StaffUserResponse updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return adminUserService.updateRole(id, request.role(), jwt.getSubject());
    }
}
