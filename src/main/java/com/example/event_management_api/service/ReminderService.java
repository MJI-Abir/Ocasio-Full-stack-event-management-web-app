package com.example.event_management_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;
import com.example.event_management_api.repository.EventRepository;
import com.example.event_management_api.repository.RegistrationRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ReminderService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Autowired
    public ReminderService(EventRepository eventRepository, 
                          RegistrationRepository registrationRepository,
                          EmailService emailService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    // Run daily at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendEventReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneDayFromNow = now.plusDays(1);
        
        // Find events happening in the next 24 hours
        List<Event> upcomingEvents = eventRepository.findByStartTimeAfterAndStartTimeBefore(now, oneDayFromNow);
        
        for (Event event : upcomingEvents) {
            // Get all registrations for the event (using a large page size to get all registrations)
            List<Registration> registrations = registrationRepository.findByEvent(event, PageRequest.of(0, Integer.MAX_VALUE))
                .getContent();
            
            for (Registration registration : registrations) {
                User user = registration.getUser();
                emailService.sendEventReminder(
                    user.getEmail(),
                    user.getName(),
                    event.getTitle(),
                    event.getStartTime().format(formatter),
                    event.getLocation()
                );
            }
        }
    }
}