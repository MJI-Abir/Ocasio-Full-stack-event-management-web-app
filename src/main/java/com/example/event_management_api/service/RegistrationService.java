package com.example.event_management_api.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;

public interface RegistrationService {
    Registration registerUserForEvent(User user, Event event);
    void cancelRegistration(Long registrationId);
    void cancelRegistration(User user, Event event);
    Optional<Registration> getRegistrationById(Long id);
    Optional<Registration> getRegistrationByUserAndEvent(User user, Event event);
    Page<Registration> getRegistrationsByUser(User user, Pageable pageable);
    Page<Registration> getRegistrationsByEvent(Event event, Pageable pageable);
    boolean isUserRegisteredForEvent(User user, Event event);
    long getEventRegistrationCount(Long eventId);
    void updateAttendance(Long registrationId, boolean attended);
}
