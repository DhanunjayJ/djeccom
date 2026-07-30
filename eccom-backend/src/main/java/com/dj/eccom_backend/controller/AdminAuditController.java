package com.dj.eccom_backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dj.eccom_backend.model.AuditLog;
import com.dj.eccom_backend.service.AuditService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {

    private final AuditService auditService;

    @GetMapping
    public List<AuditLog> getRecentLogs() {
        return auditService.getRecentLogs();
    }
}
