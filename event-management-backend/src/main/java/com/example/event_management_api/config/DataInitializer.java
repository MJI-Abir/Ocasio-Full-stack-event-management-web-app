package com.example.event_management_api.config;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Registration;
import com.example.event_management_api.model.User;
import com.example.event_management_api.repository.EventRepository;
import com.example.event_management_api.repository.RegistrationRepository;
import com.example.event_management_api.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner{

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Autowired
    public DataInitializer(UserRepository userRepository, EventRepository eventRepository, RegistrationRepository registrationRepository){
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0){
            return;
        }

        // Create users
        User john = new User();
        john.setName("John Doe");
        john.setEmail("john@example.com");
        john.setPassword("password123");

        User jane = new User();
        jane.setName("Jane Smith");
        jane.setEmail("jane@example.com");
        jane.setPassword("password456");

        User bob = new User();
        bob.setName("Bob Johnson");
        bob.setEmail("bob@example.com");
        bob.setPassword("password789");

        List<User> users = Arrays.asList(john, jane, bob);
        userRepository.saveAll(users);

        // Create events
        Event techTalk = new Event();
        techTalk.setTitle("Spring Boot Tech Talk");
        techTalk.setDescription("Learn about Spring Boot features and best practices");
        techTalk.setStartTime(LocalDateTime.now().plusDays(7));
        techTalk.setEndTime(LocalDateTime.now().plusDays(7).plusHours(2));
        techTalk.setLocation("Tech Hub, Room 101");
        techTalk.setMaxAttendees(50);
        techTalk.setCreator(john);

        Event workshop = new Event();
        workshop.setTitle("Java Workshop");
        workshop.setDescription("Hands-on Java development workshop");
        workshop.setStartTime(LocalDateTime.now().plusDays(14));
        workshop.setEndTime(LocalDateTime.now().plusDays(14).plusHours(4));
        workshop.setLocation("Learning Center");
        workshop.setMaxAttendees(20);
        workshop.setCreator(jane);

        Event hackathon = new Event();
        hackathon.setTitle("Annual Hackathon");
        hackathon.setDescription("24-hour coding competition");
        hackathon.setStartTime(LocalDateTime.now().plusDays(30));
        hackathon.setEndTime(LocalDateTime.now().plusDays(31));
        hackathon.setLocation("Innovation Building");
        hackathon.setMaxAttendees(100);
        hackathon.setCreator(bob);

        List<Event> events = Arrays.asList(techTalk, workshop, hackathon);
        eventRepository.saveAll(events);

        // Create registrations
        Registration reg1 = new Registration();
        reg1.setUser(jane);
        reg1.setEvent(techTalk);
        reg1.setRegistrationTime(LocalDateTime.now().minusDays(2));

        Registration reg2 = new Registration();
        reg2.setUser(bob);
        reg2.setEvent(techTalk);
        reg2.setRegistrationTime(LocalDateTime.now().minusDays(1));

        Registration reg3 = new Registration();
        reg3.setUser(john);
        reg3.setEvent(workshop);
        reg3.setRegistrationTime(LocalDateTime.now().minusDays(3));

        List<Registration> registrations = Arrays.asList(reg1, reg2, reg3);
        registrationRepository.saveAll(registrations);
    }
    
}
