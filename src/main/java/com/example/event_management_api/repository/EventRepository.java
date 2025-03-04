package com.example.event_management_api.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCreator(User creator);
    List<Event> findByStartTimeAfter(LocalDateTime date);
    List<Event> findByTitleContainingIgnoreCase(String keyword);
    
}
