package com.dj.eccom_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.User;
import com.dj.eccom_backend.model.UserRole;


public interface UserRepository extends JpaRepository<User,Long>{
    boolean existsByUserName(String name);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    boolean existsByRole(UserRole role);
}
