package com.example.event_management_api.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    private Long id;
    private UserDTO user;
    private EventDTO event;
    private LocalDateTime registrationTime;
    private Boolean attended;
}
