package com.example.event_management_api.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.example.event_management_api.dto.PagedResponseDTO;
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
    public ResponseEntity<?> createEvent(@RequestBody EventCreationDTO eventCreateDTO, Authentication authentication) {
        // Get the authenticated user's email
        String userEmail = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(userEmail);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        
        User user = userOpt.get();
        
        // Check if user is an admin
        if (!user.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can create events");
        }
        
        // If user is admin, proceed with creating the event
        try {
            // Convert DTO to entity
            Event event = new Event();
            event.setTitle(eventCreateDTO.getTitle());
            event.setDescription(eventCreateDTO.getDescription());
            event.setLocation(eventCreateDTO.getLocation());
            event.setStartTime(eventCreateDTO.getStartTime());
            event.setEndTime(eventCreateDTO.getEndTime());
            event.setMaxAttendees(eventCreateDTO.getMaxAttendees());
            event.setCreator(user);
            
            // Save the event
            Event savedEvent = eventService.createEvent(event);
            
            // Return DTO
            return ResponseEntity.status(HttpStatus.CREATED).body(dtoMapper.toEventDto(savedEvent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<PagedResponseDTO<EventDTO>> getAllEvents(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "startTime") String sortBy,
        @RequestParam(defaultValue = "desc") String direction) 
        {
            Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
            Page<Event> eventPage = eventService.getAllEvents(pageable);

            List<EventDTO> content = eventPage.getContent().stream().map(dtoMapper::toEventDto).collect(Collectors.toList());
            PagedResponseDTO<EventDTO> response = new PagedResponseDTO<>(
            content,
            eventPage.getNumber(),
            eventPage.getSize(),
            eventPage.getTotalElements(),
            eventPage.getTotalPages(),
            eventPage.isLast()
            );
            return ResponseEntity.ok(response);
        }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Optional<Event> eventOpt = eventService.getEventById(id);
        return eventOpt.map(event -> ResponseEntity.ok(dtoMapper.toEventDto(event)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<PagedResponseDTO<EventDTO>> getUpcomingEvents(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            LocalDateTime fromDate, @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "startTime") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {
            Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
            Page<Event> upcomingEventPage = eventService.getUpcomingEvents(fromDate, pageable);
            List<EventDTO> content = upcomingEventPage.getContent().stream().map(dtoMapper::toEventDto).collect(Collectors.toList());
            PagedResponseDTO<EventDTO> response = new PagedResponseDTO<>(
                content,
                upcomingEventPage.getNumber(),
                upcomingEventPage.getSize(),
                upcomingEventPage.getTotalElements(),
                upcomingEventPage.getTotalPages(),
                upcomingEventPage.isLast()
            );
            return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponseDTO<EventDTO>> searchEvents(@RequestParam String keyword, @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "startTime") String sortBy,
        @RequestParam(defaultValue = "desc") String direction) {
            Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
            Page<Event> resultEventPage = eventService.searchEvents(keyword, pageable);
            List<EventDTO> content = resultEventPage.getContent().stream().map(dtoMapper::toEventDto).collect(Collectors.toList());
            PagedResponseDTO<EventDTO> response = new PagedResponseDTO<>(
                content,
                resultEventPage.getNumber(),
                resultEventPage.getSize(),
                resultEventPage.getTotalElements(),
                resultEventPage.getTotalPages(),
                resultEventPage.isLast()
            );
            return ResponseEntity.ok(response);
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<PagedResponseDTO<EventDTO>> getEventsByCreator(@PathVariable Long creatorId, 
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "startTime") String sortBy,
        @RequestParam(defaultValue = "desc") String direction) {
        Optional<User> creatorOpt = userService.getUserById(creatorId);
        if (creatorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<Event> creatorsEventPage = eventService.getEventsByCreator(creatorOpt.get(), pageable);
        List<EventDTO> content = creatorsEventPage.getContent().stream().map(dtoMapper::toEventDto).collect(Collectors.toList());
        PagedResponseDTO<EventDTO> response = new PagedResponseDTO<>(
                content,
                creatorsEventPage.getNumber(),
                creatorsEventPage.getSize(),
                creatorsEventPage.getTotalElements(),
                creatorsEventPage.getTotalPages(),
                creatorsEventPage.isLast()
            );
        return ResponseEntity.ok(response);
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
