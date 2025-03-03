package com.example.event_management_api.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String location;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    // Many events can be created by one user
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    // One event can have multiple registrations
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private Set<Registration> registrations = new HashSet<>();
    
}
