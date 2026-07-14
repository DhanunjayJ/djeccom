package com.dj.eccom_backend.model.dto;

public record UserSignUp(
    String userName,
    String password,
    String email
) {
  
}
