package com.example.event_management_api.service;

import java.util.List;
import java.util.Optional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Image;

public interface ImageService {
    Image createImage(Image image);
    Optional<Image> getImageById(Long id);
    List<Image> getImagesByEventId(Long eventId);
    List<Image> getImagesByEvent(Event event);
    void deleteImage(Long id);
    Image updateImageOrder(Long id, Integer displayOrder);
    long getImageCountForEvent(Long eventId);
}