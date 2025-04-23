package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;
import com.example.event_management_api.repository.EventRepository;
import com.example.event_management_api.repository.ImageRepository;
import com.example.event_management_api.repository.RegistrationRepository;

@Service
public class EventServiceImpl implements EventService{
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final ImageRepository imageRepository;

    public EventServiceImpl(EventRepository eventRepository, 
                           RegistrationRepository registrationRepository,
                           ImageRepository imageRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.imageRepository = imageRepository;
    }

    // Implement the methods of the EventService interface

    @Override
    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getEventsByCreator(User creator, Pageable pageable) {
        return eventRepository.findByCreator(creator, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> getUpcomingEvents(LocalDateTime fromDate, Pageable pageable) {
        LocalDateTime effectiveFromDate = (fromDate != null) ? fromDate : LocalDateTime.now();
        return eventRepository.findByStartTimeAfter(effectiveFromDate, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Event> searchEvents(String keyword, Pageable pageable) {
        return eventRepository.findByTitleContainingIgnoreCase(keyword, pageable);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean isEventFull(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            if(event.getMaxAttendees()<0) {
                return false; // No limit on attendees
            }
            long currentRegistrations = registrationRepository.countByEventId(eventId);
            return currentRegistrations >= event.getMaxAttendees();
        }
        return false; // Event not found
    }

    @Override
    @Transactional
    public boolean deleteEvent(Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isEmpty()) {
            return false;
        }
        
        try {
            // Use native query to delete images first, bypassing Hibernate's entity management
            imageRepository.deleteImagesByEventIdNative(id);
            
            // Then delete the event itself
            eventRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            // Log the error for debugging purposes
            System.err.println("Error deleting event: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
