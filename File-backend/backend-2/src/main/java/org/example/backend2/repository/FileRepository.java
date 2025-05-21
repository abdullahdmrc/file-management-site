package org.example.backend2.repository;

import org.example.backend2.model.FileEntity;
import org.example.backend2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUser(User user);
    void deleteByUserAndId(User user, Long id);
}