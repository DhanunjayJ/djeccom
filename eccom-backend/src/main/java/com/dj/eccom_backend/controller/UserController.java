package com.dj.eccom_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.dto.UserLogin;
import com.dj.eccom_backend.model.dto.UserResponse;
import com.dj.eccom_backend.model.dto.UserSignUp;
import com.dj.eccom_backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@RequestBody UserSignUp signupDto) {
        UserResponse response = userService.register(signupDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserLogin loginDto) {
        UserResponse response = userService.login(loginDto);

        return ResponseEntity.ok(response);
    }

}
