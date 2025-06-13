package org.example.backend2.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend2.dto.FileDTO;
import org.example.backend2.model.User;
import org.example.backend2.service.FileService;
import org.example.backend2.service.UserService;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
//@RequiredArgsConstructor 
@CrossOrigin(origins = "*")
public class FileController {
    private final FileService fileService;
    private final UserService userService;

    public FileController(FileService fileService, UserService userService) {
        this.fileService = fileService;
        this.userService = userService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {
        try {
            // Kullanıcıyı şifre kontrolü yapmadan doğrudan kullanıcı adıyla bul
            User user = userService.findUserByUsername(username);
            if (user == null) {
                return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
            }
            FileDTO uploadedFile = fileService.uploadFile(file, user);
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listFiles(@RequestParam("username") String username) {
        try {
            // Kullanıcıyı şifre kontrolü yapmadan doğrudan kullanıcı adıyla bul
            User user = userService.findUserByUsername(username);
            if (user == null) {
                return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
            }
            List<FileDTO> files = fileService.getUserFiles(user);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long fileId,
            @RequestParam("username") String username) {
        try {
            // Kullanıcıyı şifre kontrolü yapmadan doğrudan kullanıcı adıyla bul
            User user = userService.findUserByUsername(username);
            if (user == null) {
                return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
            }
            fileService.deleteFile(fileId, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
