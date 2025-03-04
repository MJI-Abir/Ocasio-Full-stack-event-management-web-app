package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;

public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Event event);
    Optional<Event> getEventById(Long id);
    List<Event> getAllEvents();
    List<Event> getEventsByCreator(User creator);
    List<Event> getUpcomingEvents(LocalDateTime fromDate);
    List<Event> searchEvents(String keyword);
    void deleteById(Long id);
    Boolean isEventFull(Long eventId);
}
