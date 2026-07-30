package com.dj.eccom_backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.UserRole;
import com.dj.eccom_backend.model.dto.UserResponse;
import com.dj.eccom_backend.model.dto.UserSignUp;
import com.dj.eccom_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void registrationHashesPasswordAndReturnsAccessToken() {
        UserSignUp signup = new UserSignUp("Test User", "plain-password", "TEST@EXAMPLE.COM");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });
        when(jwtService.createAccessToken(any(User.class))).thenReturn("signed-token");
        when(jwtService.getExpirationSeconds()).thenReturn(3600L);

        UserResponse response = userService.register(signup);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertNotEquals("plain-password", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("plain-password", savedUser.getPassword()));
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals(UserRole.CUSTOMER, savedUser.getRole());
        assertEquals(UserRole.CUSTOMER, response.role());
        assertEquals("signed-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(3600L, response.expiresIn());
    }
}
