package com.example.event_management_api.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.User;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAll(Pageable pageable);
    Page<Event> findByCreator(User creator, Pageable pageable);
    Page<Event> findByStartTimeAfter(LocalDateTime date, Pageable pageable);
    Page<Event> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
}
