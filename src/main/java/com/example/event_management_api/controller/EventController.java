package com.example.event_management_api.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.event_management_api.dto.DtoMapper;
import com.example.event_management_api.dto.EventCreationDTO;
import com.example.event_management_api.dto.EventDTO;
import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;
import com.example.event_management_api.service.EventService;
import com.example.event_management_api.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private DtoMapper dtoMapper;

    @Autowired
    public EventController(EventService eventService, UserService userService, DtoMapper dtoMapper) {
        this.eventService = eventService;
        this.userService = userService;
        this.dtoMapper = dtoMapper;
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventCreationDTO eventDTO,
                                              @RequestParam Long creatorId) {
        Optional<User> creatorOpt = userService.getUserById(creatorId);
        if (creatorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStartTime(eventDTO.getStartTime());
        event.setEndTime(eventDTO.getEndTime());
        event.setLocation(eventDTO.getLocation());
        event.setMaxAttendees(eventDTO.getMaxAttendees());
        event.setCreator(creatorOpt.get());
        
        Event savedEvent = eventService.createEvent(event);
        return new ResponseEntity<>(dtoMapper.toEventDto(savedEvent), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents().stream()
                                          .map(dtoMapper::toEventDto)
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Optional<Event> eventOpt = eventService.getEventById(id);
        return eventOpt.map(event -> ResponseEntity.ok(dtoMapper.toEventDto(event)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            LocalDateTime fromDate) {
        if (fromDate == null) {
            fromDate = LocalDateTime.now();
        }
        List<EventDTO> events = eventService.getUpcomingEvents(fromDate).stream()
                                          .map(dtoMapper::toEventDto)
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchEvents(@RequestParam String keyword) {
        List<EventDTO> events = eventService.searchEvents(keyword).stream()
                                          .map(dtoMapper::toEventDto)
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<EventDTO>> getEventsByCreator(@PathVariable Long creatorId) {
        Optional<User> creatorOpt = userService.getUserById(creatorId);
        if (creatorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<EventDTO> events = eventService.getEventsByCreator(creatorOpt.get()).stream()
                                          .map(dtoMapper::toEventDto)
                                          .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody EventCreationDTO eventDTO) {
        Optional<Event> eventOpt = eventService.getEventById(id);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Event event = eventOpt.get();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStartTime(eventDTO.getStartTime());
        event.setEndTime(eventDTO.getEndTime());
        event.setLocation(eventDTO.getLocation());
        event.setMaxAttendees(eventDTO.getMaxAttendees());
        Event updatedEvent = eventService.updateEvent(event);
        return ResponseEntity.ok(dtoMapper.toEventDto(updatedEvent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!eventService.getEventById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        eventService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    
}
