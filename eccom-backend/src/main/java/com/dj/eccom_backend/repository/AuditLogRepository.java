package com.dj.eccom_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dj.eccom_backend.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop200ByOrderByCreatedAtDesc();
}
