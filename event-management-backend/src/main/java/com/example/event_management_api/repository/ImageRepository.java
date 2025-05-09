package com.example.event_management_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByEventOrderByDisplayOrderAsc(Event event);
    List<Image> findByEventId(Long eventId);
    long countByEventId(Long eventId);
}