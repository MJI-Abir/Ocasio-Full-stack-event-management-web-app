package com.example.event_management_api.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    @SuppressWarnings("unused")
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int maxAttendees;
    private UserDTO creator;
    private long registrationCount;
    private boolean isFull;
    private List<ImageDTO> images = new ArrayList<>();
}
