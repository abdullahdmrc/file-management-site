package org.example.backend2.service;

import lombok.RequiredArgsConstructor;
import org.example.backend2.config.FileStorageProperties;
import org.example.backend2.dto.FileDTO;
import org.example.backend2.model.FileEntity;
import org.example.backend2.model.User;
import org.example.backend2.repository.FileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class FileService {
    private final FileRepository fileRepository;
    private final FileStorageProperties fileStorageProperties;

    public FileService(FileRepository fileRepository, FileStorageProperties fileStorageProperties) {
        this.fileRepository = fileRepository;
        this.fileStorageProperties = fileStorageProperties;
    }

    public FileDTO uploadFile(MultipartFile file, User user) throws IOException {
        String fileName = file.getOriginalFilename();
        Path uploadPath = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String filePath = uploadPath.resolve(fileName).toString();
        Files.copy(file.getInputStream(), Paths.get(filePath));

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(fileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFilePath(filePath);
        fileEntity.setFileSize(file.getSize());
        fileEntity.setUser(user);
        fileEntity.setUploadDate(LocalDateTime.now());

        FileEntity savedFile = fileRepository.save(fileEntity);
        return convertToDTO(savedFile);
    }

    public List<FileDTO> getUserFiles(User user) {
        return fileRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long fileId, User user) throws IOException {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("Dosya bulunamadı"));

        if (!file.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bu dosyayı silme yetkiniz yok");
        }

        Files.deleteIfExists(Paths.get(file.getFilePath()));
        fileRepository.deleteByUserAndId(user, fileId);
    }

    private FileDTO convertToDTO(FileEntity file) {
        FileDTO dto = new FileDTO();
        dto.setId(file.getId());
        dto.setFileName(file.getFileName());
        dto.setFileType(file.getFileType());
        dto.setFileSize(file.getFileSize());
        dto.setUploadDate(file.getUploadDate());
        return dto;
    }
}