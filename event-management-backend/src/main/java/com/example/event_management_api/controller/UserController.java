package com.example.event_management_api.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.event_management_api.dto.DtoMapper;
import com.example.event_management_api.dto.UserDTO;
import com.example.event_management_api.dto.UserRegistrationDTO;
import com.example.event_management_api.model.User;
import com.example.event_management_api.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final DtoMapper dtoMapper;

    @Autowired
    public UserController(UserService userService, DtoMapper dtoMapper) {
        this.userService = userService;
        this.dtoMapper = dtoMapper;
    }

    // Get current authenticated user
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        Optional<User> userOpt = userService.getUserByEmail(email);
        System.out.println("User: " + userOpt);
        return userOpt
                .map(user -> ResponseEntity.ok(dtoMapper.toUserDto(user)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // create a new user
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRegistrationDTO userDto){

        if (userService.existsByEmail(userDto.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        User savedUser = userService.createUser(user);
        return new ResponseEntity<>(dtoMapper.toUserDto(savedUser), HttpStatus.CREATED);
    }

    // get user by id
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id){
        Optional<User> userOpt = userService.getUserById(id);
        return userOpt.map(user -> ResponseEntity.ok(dtoMapper.toUserDto(user)))
                     .orElse(ResponseEntity.notFound().build());
    }

    // get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream()
                                        .map(dtoMapper::toUserDto)
                                        .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // update user
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, 
                                            @Valid @RequestBody UserRegistrationDTO userDTO) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        user.setName(userDTO.getName());
        
        // Check if email changed and if new email already exists
        if (!user.getEmail().equals(userDTO.getEmail()) && 
            userService.existsByEmail(userDTO.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(userDTO.getPassword()); // In a real app, you'd hash this
        }
        
        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(dtoMapper.toUserDto(updatedUser));
    }

    // delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.getUserById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}