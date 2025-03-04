package com.example.event_management_api.service;

import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;

public interface RegistrationService {
    List<Registration> findAll();
    List<Registration> findByUser(User user);
    List<Registration> findByEvent(Event event);
    Optional<Registration> findByUserAndEvent(User user, Event event);
    boolean existsByUserAndEvent(User user, Event event);
    Long countByEventId(Long eventId);
    Registration save(Registration registration);
    void deleteById(Long id);
}
