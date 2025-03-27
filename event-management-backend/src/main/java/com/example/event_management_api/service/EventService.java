package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;

public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Event event);
    Optional<Event> getEventById(Long id);
    Page<Event> getAllEvents(Pageable pageable);
    Page<Event> getEventsByCreator(User creator, Pageable pageable);
    Page<Event> getUpcomingEvents(LocalDateTime fromDate, Pageable pageable);
    Page<Event> searchEvents(String keyword, Pageable pageable);
    void deleteById(Long id);
    Boolean isEventFull(Long eventId);
}
