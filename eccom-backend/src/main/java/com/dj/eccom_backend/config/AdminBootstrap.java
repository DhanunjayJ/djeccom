package com.dj.eccom_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.UserRole;
import com.dj.eccom_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "bootstrap.admin.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class AdminBootstrap implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${bootstrap.admin.email:}")
    private String adminEmail;

    @Value("${bootstrap.admin.password:}")
    private String adminPassword;

    @Value("${bootstrap.admin.name:Store Administrator}")
    private String adminName;

    @Override
    public void run(String... args) {
        if (userRepository.existsByRole(UserRole.ADMIN) || adminEmail.isBlank()) {
            return;
        }
        if (adminPassword.length() < 12) {
            throw new IllegalStateException(
                    "ADMIN_PASSWORD must contain at least 12 characters when bootstrapping an admin");
        }

        User admin = userRepository.findByEmail(adminEmail.trim().toLowerCase())
                .orElseGet(User::new);
        admin.setEmail(adminEmail.trim().toLowerCase());
        admin.setUserName(adminName.trim());
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);
    }
}
