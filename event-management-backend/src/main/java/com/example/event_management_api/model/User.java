package com.example.event_management_api.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean isAdmin = false; // Default value is false

    // User can create multiple events
    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    private Set<Event> createdEvents = new HashSet<>();

    // User can register for multiple events
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Registration> registrations = new HashSet<>();
    
    // Constructor
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = false;
    }
}
