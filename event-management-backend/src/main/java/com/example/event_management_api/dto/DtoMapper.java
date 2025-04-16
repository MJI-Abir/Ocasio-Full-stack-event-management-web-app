package com.example.event_management_api.dto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Image;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;
import com.example.event_management_api.service.EventService;
import com.example.event_management_api.service.ImageService;
import com.example.event_management_api.service.RegistrationService;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DtoMapper {
    private final EventService eventService;
    private final RegistrationService registrationService;
    private final ImageService imageService;

    @Autowired
    public DtoMapper(EventService eventService, RegistrationService registrationService, ImageService imageService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
        this.imageService = imageService;
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
            
            // Add event images
            List<ImageDTO> images = imageService.getImagesByEventId(event.getId())
                .stream()
                .map(this::toImageDto)
                .collect(Collectors.toList());
            eventDto.setImages(images);
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
    
    // Image entity to ImageDTO
    public ImageDTO toImageDto(Image image) {
        if (image == null) {
            return null;
        }
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setId(image.getId());
        imageDTO.setImageUrl(image.getImageUrl());
        imageDTO.setDisplayOrder(image.getDisplayOrder());
        imageDTO.setCreatedAt(image.getCreatedAt());
        return imageDTO;
    }
}
