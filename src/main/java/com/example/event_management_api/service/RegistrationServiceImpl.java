package com.example.event_management_api.service;

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

    @Autowired
    public RegistrationServiceImpl(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    // Implement the methods of the RegistrationService interface
    @Override
    @Transactional(readOnly = true)
    public List<Registration> findAll() {
        return registrationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> findByEvent(Event event) {
        return registrationRepository.findByEvent(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Registration> findByUser(User user) {
        return registrationRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Registration> findByUserAndEvent(User user, Event event) {
        return registrationRepository.findByUserAndEvent(user, event);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUserAndEvent(User user, Event event) {
        return registrationRepository.existsByUserAndEvent(user, event);
    }

    @Override
    @Transactional
    public Registration save(Registration registration) {
        return registrationRepository.save(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByEventId(Long eventId) {
        return registrationRepository.countByEventId(eventId);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        registrationRepository.deleteById(id);
    }
    
}
