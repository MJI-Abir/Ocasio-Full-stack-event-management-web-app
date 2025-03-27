package com.example.event_management_api.dto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;
import com.example.event_management_api.service.EventService;
import com.example.event_management_api.service.RegistrationService;

@Component
public class DtoMapper {
    private final EventService eventService;
    private final RegistrationService registrationService;

    @Autowired
    public DtoMapper(EventService eventService, RegistrationService registrationService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    // User entity to UserDTO
    public UserDTO toUserDto(User user){
        if (user == null) {
            return null;
        }
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        return userDto;
    }

    // Event entity to EventDTO
    public EventDTO toEventDto(Event event){
        if (event == null) {
            return null;
        }
        EventDTO eventDto = new EventDTO();
        eventDto.setId(event.getId());
        eventDto.setTitle(event.getTitle());
        eventDto.setDescription(event.getDescription());
        eventDto.setLocation(event.getLocation());
        eventDto.setStartTime(event.getStartTime());
        eventDto.setEndTime(event.getEndTime());
        eventDto.setMaxAttendees(event.getMaxAttendees());
        eventDto.setCreator(toUserDto(event.getCreator()));
        // Add registration count and full status
        if (event.getId() != null) {
            long regCount = registrationService.getEventRegistrationCount(event.getId());
            eventDto.setRegistrationCount(regCount);
            eventDto.setFull(eventService.isEventFull(event.getId()));
        }
        
        return eventDto;
    }

    // Registration entity to RegistrationDTO
    public RegistrationDTO toRegistrationDto(Registration registration){
        if (registration == null) {
            return null;
        }
        RegistrationDTO registrationDto = new RegistrationDTO();
        registrationDto.setId(registration.getId());
        registrationDto.setUser(toUserDto(registration.getUser()));
        registrationDto.setEvent(toEventDto(registration.getEvent()));
        registrationDto.setRegistrationTime(registration.getRegistrationTime());
        registrationDto.setAttended(registration.getAttended());
        return registrationDto;
    }
}
