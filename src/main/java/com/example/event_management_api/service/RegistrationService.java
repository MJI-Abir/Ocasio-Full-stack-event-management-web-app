package com.example.event_management_api.service;

import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;

public interface RegistrationService {
    Registration registerUserForEvent(User user, Event event);
    void cancelRegistration(Long registrationId);
    void cancelRegistration(User user, Event event);
    Optional<Registration> getRegistrationById(Long id);
    Optional<Registration> getRegistrationByUserAndEvent(User user, Event event);
    List<Registration> getRegistrationsByUser(User user);
    List<Registration> getRegistrationsByEvent(Event event);
    boolean isUserRegisteredForEvent(User user, Event event);
    long getEventRegistrationCount(Long eventId);
    void updateAttendance(Long registrationId, boolean attended);
}
