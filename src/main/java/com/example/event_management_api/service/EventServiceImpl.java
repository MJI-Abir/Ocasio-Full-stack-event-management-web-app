package com.example.event_management_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;
import com.example.event_management_api.repository.EventRepository;
import com.example.event_management_api.repository.RegistrationRepository;

@Service
public class EventServiceImpl implements EventService{
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
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
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getEventsByCreator(User creator) {
        return eventRepository.findByCreator(creator);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> getUpcomingEvents(LocalDateTime fromDate) {
        return eventRepository.findByStartTimeAfter(fromDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> searchEvents(String keyword) {
        return eventRepository.findByTitleContainingIgnoreCase(keyword);
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
}
