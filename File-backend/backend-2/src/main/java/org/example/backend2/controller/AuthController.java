package org.example.backend2.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend2.dto.UserDTO;
import org.example.backend2.model.User;
import org.example.backend2.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@RequiredArgsConstructor // Lombok'un @RequiredArgsConstructor'ı kullanılıyorsa bu satır aktif edilebilir
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            User user = userService.register(userDTO);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        try {
            User user = userService.login(userDTO.getUsername(), userDTO.getPassword());
            // Gerçek bir uygulamada burada bir JWT token döndürülmelidir.
            // Şimdilik, kullanıcı nesnesini döndürüyoruz.
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}