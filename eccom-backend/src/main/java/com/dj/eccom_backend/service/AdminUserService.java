package com.dj.eccom_backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.UserRole;
import com.dj.eccom_backend.model.dto.StaffUserResponse;
import com.dj.eccom_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public List<StaffUserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public StaffUserResponse updateRole(
            Long userId,
            UserRole role,
            String actingAdminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (user.getEmail().equalsIgnoreCase(actingAdminEmail) && role != UserRole.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Administrators cannot remove their own admin role");
        }

        UserRole oldRole = user.getRole();
        user.setRole(role);
        User savedUser = userRepository.save(user);
        auditService.record(
                "USER_ROLE_UPDATED",
                "User",
                userId,
                oldRole + " -> " + role);
        return toResponse(savedUser);
    }

    private StaffUserResponse toResponse(User user) {
        return new StaffUserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRole());
    }
}
