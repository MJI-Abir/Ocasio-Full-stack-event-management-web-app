package com.example.event_management_api.util;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;
import com.example.event_management_api.repository.EventRepository;
import com.example.event_management_api.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if events table is empty
        if (eventRepository.count() == 0) {
            seedEvents();
        }
    }

    private void seedEvents() {
        // Get an admin user to assign as creator
        Optional<User> adminUser = userRepository.findByEmail("admin@example.com");
        
        // If admin doesn't exist, create one
        User creator;
        if (adminUser.isEmpty()) {
            // Use the first user in the database
            List<User> users = userRepository.findAll();
            if (users.isEmpty()) {
                // If no users exist, we can't create events
                System.out.println("No users found in the database. Events cannot be seeded.");
                return;
            }
            creator = users.get(0);
        } else {
            creator = adminUser.get();
        }

        // Create and save 10 dummy events
        LocalDateTime now = LocalDateTime.now();
        
        Event event1 = new Event();
        event1.setTitle("Tech Conference 2024");
        event1.setDescription("Join us for the biggest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.");
        event1.setLocation("Convention Center, New York");
        event1.setStartTime(now.plusDays(30));
        event1.setEndTime(now.plusDays(32));
        event1.setMaxAttendees(500);
        event1.setCreator(creator);
        eventRepository.save(event1);
        
        Event event2 = new Event();
        event2.setTitle("Web Development Workshop");
        event2.setDescription("Learn the latest web development technologies including React, Node.js, and GraphQL in this hands-on workshop.");
        event2.setLocation("Tech Hub, San Francisco");
        event2.setStartTime(now.plusDays(15));
        event2.setEndTime(now.plusDays(15).plusHours(8));
        event2.setMaxAttendees(50);
        event2.setCreator(creator);
        eventRepository.save(event2);
        
        Event event3 = new Event();
        event3.setTitle("AI and Machine Learning Summit");
        event3.setDescription("Explore the future of artificial intelligence and machine learning with expert panels and demonstrations of cutting-edge technologies.");
        event3.setLocation("Science Center, Boston");
        event3.setStartTime(now.plusDays(45));
        event3.setEndTime(now.plusDays(46));
        event3.setMaxAttendees(300);
        event3.setCreator(creator);
        eventRepository.save(event3);
        
        Event event4 = new Event();
        event4.setTitle("Mobile App Development Hackathon");
        event4.setDescription("Put your coding skills to the test in this 48-hour hackathon focused on creating innovative mobile applications.");
        event4.setLocation("Innovation Lab, Seattle");
        event4.setStartTime(now.plusDays(20));
        event4.setEndTime(now.plusDays(22));
        event4.setMaxAttendees(100);
        event4.setCreator(creator);
        eventRepository.save(event4);
        
        Event event5 = new Event();
        event5.setTitle("Cybersecurity Conference");
        event5.setDescription("Stay ahead of cyber threats with insights from security experts on the latest trends, attacks, and defense strategies.");
        event5.setLocation("Digital Security Center, Washington DC");
        event5.setStartTime(now.plusDays(60));
        event5.setEndTime(now.plusDays(61));
        event5.setMaxAttendees(250);
        event5.setCreator(creator);
        eventRepository.save(event5);
        
        Event event6 = new Event();
        event6.setTitle("UX/UI Design Masterclass");
        event6.setDescription("Enhance your design skills with this comprehensive masterclass on user experience and interface design principles.");
        event6.setLocation("Design Studio, Chicago");
        event6.setStartTime(now.plusDays(10));
        event6.setEndTime(now.plusDays(10).plusHours(6));
        event6.setMaxAttendees(40);
        event6.setCreator(creator);
        eventRepository.save(event6);
        
        Event event7 = new Event();
        event7.setTitle("Blockchain and Cryptocurrency Forum");
        event7.setDescription("Understand the fundamentals of blockchain technology and the future of cryptocurrency in this educational forum.");
        event7.setLocation("Financial District, Miami");
        event7.setStartTime(now.plusDays(25));
        event7.setEndTime(now.plusDays(26));
        event7.setMaxAttendees(150);
        event7.setCreator(creator);
        eventRepository.save(event7);
        
        Event event8 = new Event();
        event8.setTitle("Data Science Bootcamp");
        event8.setDescription("Immerse yourself in data analysis, visualization, and predictive modeling in this intensive bootcamp for aspiring data scientists.");
        event8.setLocation("Analytics Center, Austin");
        event8.setStartTime(now.plusDays(40));
        event8.setEndTime(now.plusDays(45));
        event8.setMaxAttendees(60);
        event8.setCreator(creator);
        eventRepository.save(event8);
        
        Event event9 = new Event();
        event9.setTitle("Cloud Computing Symposium");
        event9.setDescription("Explore cloud infrastructure, migration strategies, and best practices with leading experts in cloud computing.");
        event9.setLocation("Tech Campus, Denver");
        event9.setStartTime(now.plusDays(55));
        event9.setEndTime(now.plusDays(56));
        event9.setMaxAttendees(200);
        event9.setCreator(creator);
        eventRepository.save(event9);
        
        Event event10 = new Event();
        event10.setTitle("IoT Innovation Showcase");
        event10.setDescription("Discover the latest Internet of Things devices and applications transforming homes, cities, and industries.");
        event10.setLocation("Smart Living Expo, Los Angeles");
        event10.setStartTime(now.plusDays(70));
        event10.setEndTime(now.plusDays(72));
        event10.setMaxAttendees(350);
        event10.setCreator(creator);
        eventRepository.save(event10);
        
        System.out.println("10 dummy events have been seeded successfully.");
    }
} 