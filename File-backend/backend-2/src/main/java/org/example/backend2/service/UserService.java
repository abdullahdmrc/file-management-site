package org.example.backend2.service;

import lombok.RequiredArgsConstructor;
import org.example.backend2.dto.UserDTO;
import org.example.backend2.model.User;
import org.example.backend2.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor 
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Kullanıcı adı zaten mevcut");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("E-posta zaten mevcut");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); 
        user.setEmail(userDTO.getEmail());

        return userRepository.save(user);
    }

    public User login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password)) 
                .orElseThrow(() -> new RuntimeException("Geçersiz kullanıcı adı veya şifre"));
    }


    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }
}
