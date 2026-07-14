package com.dj.eccom_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dj.eccom_backend.exception.UserException;
import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.dto.UserLogin;
import com.dj.eccom_backend.model.dto.UserResponse;
import com.dj.eccom_backend.model.dto.UserSignUp;
import com.dj.eccom_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public UserResponse register(UserSignUp user) {
        if (userRepo.existsByEmail(user.email())) {
            throw new UserException("Email is already taken!");
        }

        User newUser = new User();
        newUser.setEmail(user.email());
        newUser.setPassword(user.password());
        newUser.setUserName(user.userName());

        User savedUser = userRepo.save(newUser);
        return new UserResponse(savedUser.getId(), savedUser.getUserName(), savedUser.getEmail());
    }

    public UserResponse login(UserLogin user) { 
        User userInDB = userRepo.findByEmail(user.email())
                .orElseThrow(() -> new UserException("Invalid email or password"));

        if (!userInDB.getPassword().equals(user.password())) {
            throw new UserException("Invalid email or password");
        }

        return new UserResponse(userInDB.getId(), userInDB.getUserName(), userInDB.getEmail());
    }

}
