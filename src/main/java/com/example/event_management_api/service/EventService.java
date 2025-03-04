package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;

public interface EventService {
    List<Event> findAll();
    Optional<Event> findById(Long id);
    List<Event> findByCreator(User creator);
    List<Event> findByStartTimeAfter(LocalDateTime date);
    List<Event> findByTitleContainingIgnoreCase(String keyword);
    Event save(Event event);
    void deleteById(Long id);
}
