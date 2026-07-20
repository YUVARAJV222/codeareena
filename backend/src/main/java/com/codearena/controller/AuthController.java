package com.codearena.controller;

import com.codearena.dto.AuthResponse;
import com.codearena.dto.GoogleAuthRequest;
import com.codearena.dto.LoginRequest;
import com.codearena.dto.RegisterRequest;
import com.codearena.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(errorBody(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody("Invalid email or password"));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = authService.loginWithGoogle(request.getIdToken());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(errorBody(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody("Google sign-in failed"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(errorBody("Email is required"));
        }
        try {
            authService.forgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(errorBody(ex.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(errorBody("Token is required"));
        }
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(errorBody("New password is required"));
        }
        try {
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(errorBody(ex.getMessage()));
        }
    }

    private Map<String, String> errorBody(String message) {
        return Map.of("error", message);
    }
}
