package com.example.Backend.Controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.DTO.AdminStatsDTO;
import com.example.Backend.Service.AdminService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${admin.password}")
    private String adminPassword;

    @Autowired
    private AdminService adminService;

    private boolean isAuthorized(HttpServletRequest request) {
        String token = request.getHeader("X-Admin-Token");
        return adminPassword != null && adminPassword.equals(token);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(HttpServletRequest request) {
        boolean valid = isAuthorized(request);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("verified", valid);
        result.put("message", valid ? "Authentication successful." : "Invalid admin credentials.");
        return result;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpServletRequest request) {
        if (!isAuthorized(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Unauthorized. Invalid admin credentials."));
        }
        AdminStatsDTO stats = adminService.getStats();
        return ResponseEntity.ok(stats);
    }
}