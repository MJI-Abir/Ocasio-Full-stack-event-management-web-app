package com.example.event_management_api.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.event_management_api.dto.DtoMapper;
import com.example.event_management_api.dto.RegistrationDTO;
import com.example.event_management_api.dto.RegistrationRequestDTO;
import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;
import com.example.event_management_api.service.EventService;
import com.example.event_management_api.service.RegistrationService;
import com.example.event_management_api.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationService registrationService;
    private final UserService userService;
    private final EventService eventService;
    private final DtoMapper dtoMapper;

    @Autowired
    public RegistrationController(RegistrationService registrationService, UserService userService, EventService eventService, DtoMapper dtoMapper) {
        this.registrationService = registrationService;
        this.userService = userService;
        this.eventService = eventService;
        this.dtoMapper = dtoMapper;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<RegistrationDTO> registerUserForEvent(@PathVariable Long userId, @Valid @RequestBody RegistrationRequestDTO registrationDTO) {
        Optional<User> userOpt = userService.getUserById(userId);
        Optional<Event> eventOpt = eventService.getEventById(registrationDTO.getEventId());
        
        if (userOpt.isEmpty() || eventOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Registration registration = registrationService.registerUserForEvent(
                    userOpt.get(), eventOpt.get());
            return new ResponseEntity<>(dtoMapper.toRegistrationDto(registration), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Handle business exceptions (e.g., event is full)
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistrationDTO> getRegistrationById(@PathVariable Long id) {
        Optional<Registration> registrationOpt = registrationService.getRegistrationById(id);
        return registrationOpt.map(reg -> ResponseEntity.ok(dtoMapper.toRegistrationDto(reg)))
                            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RegistrationDTO>> getRegistrationsByUser(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<RegistrationDTO> registrations = registrationService.getRegistrationsByUser(userOpt.get())
                .stream()
                .map(dtoMapper::toRegistrationDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(registrations);

    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationDTO>> getRegistrationsByEvent(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<RegistrationDTO> registrations = registrationService.getRegistrationsByEvent(eventOpt.get())
                .stream()
                .map(dtoMapper::toRegistrationDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrations);
                
    }

    @PatchMapping("/{id}/attendance")
    public ResponseEntity<RegistrationDTO> updateAttendance(@PathVariable Long id, @RequestParam boolean attended) {
        Optional<Registration> registrationOpt = registrationService.getRegistrationById(id);
        if (registrationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        registrationService.updateAttendance(id, attended);
        registrationOpt = registrationService.getRegistrationById(id);
        
        return ResponseEntity.ok(dtoMapper.toRegistrationDto(registrationOpt.get()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long id) {

        if (!registrationService.getRegistrationById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        registrationService.cancelRegistration(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<Void> cancelRegistration(@PathVariable Long userId, @PathVariable Long eventId) {
        Optional<User> userOpt = userService.getUserById(userId);
        Optional<Event> eventOpt = eventService.getEventById(eventId);

        if (userOpt.isEmpty() || eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        registrationService.cancelRegistration(userOpt.get(), eventOpt.get());
        return ResponseEntity.noContent().build();
    }
    
}
