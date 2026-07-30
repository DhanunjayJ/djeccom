package com.dj.eccom_backend.service;

import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dj.eccom_backend.exception.UserException;
import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.UserRole;
import com.dj.eccom_backend.model.dto.UserLogin;
import com.dj.eccom_backend.model.dto.UserResponse;
import com.dj.eccom_backend.model.dto.UserSignUp;
import com.dj.eccom_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserResponse register(UserSignUp user) {
        String normalizedEmail = normalizeEmail(user.email());
        
        if (userRepo.existsByEmail(normalizedEmail)) {
            throw new UserException("User Already Present, Login");
        }

        User newUser = new User();
        newUser.setEmail(normalizedEmail);
        newUser.setPassword(passwordEncoder.encode(user.password()));
        newUser.setUserName(user.userName().trim());
        newUser.setRole(UserRole.CUSTOMER);

        User savedUser = userRepo.save(newUser);
        return authenticatedResponse(savedUser);
    }

    public UserResponse login(UserLogin user) { 
        User userInDB = userRepo.findByEmail(normalizeEmail(user.email()))
                .orElseThrow(() -> new UserException("Invalid email or password"));

        if (!passwordEncoder.matches(user.password(), userInDB.getPassword())) {
            throw new UserException("Invalid email or password");
        }

        return authenticatedResponse(userInDB);
    }

    private UserResponse authenticatedResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRole(),
                jwtService.createAccessToken(user),
                "Bearer",
                jwtService.getExpirationSeconds());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

}
