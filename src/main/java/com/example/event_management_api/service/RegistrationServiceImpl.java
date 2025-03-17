package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.event_management_api.model.*;
import com.example.event_management_api.repository.RegistrationRepository;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventService eventService;

    @Autowired
    public RegistrationServiceImpl(RegistrationRepository registrationRepository, EventService eventService) {
        this.registrationRepository = registrationRepository;
        this.eventService = eventService;
    }

    // Implement the methods of the RegistrationService interface
    @Override
    @Transactional
    public Registration registerUserForEvent(User user, Event event) {
        // Check if event is full
        if (eventService.isEventFull(event.getId())) {
            throw new RuntimeException("Event is already full");
        }
        
        // Check if user is already registered
        if (isUserRegisteredForEvent(user, event)) {
            throw new RuntimeException("User is already registered for this event");
        }
        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegistrationTime(LocalDateTime.now());
        registration.setAttended(false);
        return registrationRepository.save(registration);
    }

    @Override
    @Transactional
    public void cancelRegistration(Long registrationId) {
        registrationRepository.deleteById(registrationId);
    }

    @Override
    @Transactional
    public void cancelRegistration(User user, Event event) {
        Optional<Registration> registration = getRegistrationByUserAndEvent(user, event);
        registration.ifPresent(r -> registrationRepository.deleteById(r.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Registration> getRegistrationByUserAndEvent(User user, Event event) {
        return registrationRepository.findByUserAndEvent(user, event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByUser(User user) {
        return registrationRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> getRegistrationsByEvent(Event event) {
        return registrationRepository.findByEvent(event);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserRegisteredForEvent(User user, Event event) {
        return registrationRepository.existsByUserAndEvent(user, event);
    }

    @Override
    @Transactional(readOnly = true)
    public long getEventRegistrationCount(Long eventId) {
        return registrationRepository.countByEventId(eventId);
    }

    @Override
    @Transactional
    public void updateAttendance(Long registrationId, boolean attended) {
        Optional<Registration> registration = getRegistrationById(registrationId);
        registration.ifPresent(r -> {
            r.setAttended(attended);
            registrationRepository.save(r);
        });
    }
    
}
