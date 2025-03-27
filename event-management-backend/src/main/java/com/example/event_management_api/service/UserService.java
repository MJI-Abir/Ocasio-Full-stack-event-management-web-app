package com.example.event_management_api.service;

import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.User;

public interface UserService {
    User createUser(User user);
    User updateUser(User user);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    void deleteUser(Long id);
    Boolean existsByEmail(String email);
}
