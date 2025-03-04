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

@Service
public class EventServiceImpl implements EventService{
    private final EventRepository eventRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Implement the methods of the EventService interface

    @Override
    @Transactional(readOnly = true)
    public List<Event> findAll() {
        return eventRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findByCreator(User creator) {
        return eventRepository.findByCreator(creator);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findByStartTimeAfter(LocalDateTime date) {
        return eventRepository.findByStartTimeAfter(date);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Event> findByTitleContainingIgnoreCase(String keyword) {
        return eventRepository.findByTitleContainingIgnoreCase(keyword);
    }

    @Override
    @Transactional
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

}
