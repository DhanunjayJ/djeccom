package com.dj.eccom_backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.dj.eccom_backend.model.AuditLog;
import com.dj.eccom_backend.repository.AuditLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void record(String action, String entityType, Object entityId, String details) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        AuditLog log = new AuditLog();
        log.setActorEmail(authentication.getName());
        log.setActorRole(authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("UNKNOWN"));
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(String.valueOf(entityId));
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop200ByOrderByCreatedAtDesc();
    }
}
