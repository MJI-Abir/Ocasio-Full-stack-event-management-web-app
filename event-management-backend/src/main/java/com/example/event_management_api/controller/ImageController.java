package com.example.event_management_api.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.event_management_api.dto.BatchImageUploadDTO;
import com.example.event_management_api.dto.DtoMapper;
import com.example.event_management_api.dto.ImageCreationDTO;
import com.example.event_management_api.dto.ImageDTO;
import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Image;
import com.example.event_management_api.service.EventService;
import com.example.event_management_api.service.ImageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events/{eventId}/images")
public class ImageController {

    private final ImageService imageService;
    private final EventService eventService;
    private final DtoMapper dtoMapper;

    public ImageController(ImageService imageService, EventService eventService, DtoMapper dtoMapper) {
        this.imageService = imageService;
        this.eventService = eventService;
        this.dtoMapper = dtoMapper;
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> getEventImages(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Image> images = imageService.getImagesByEvent(eventOpt.get());
        List<ImageDTO> imageDTOs = images.stream()
                .map(dtoMapper::toImageDto)
                .toList();

        return ResponseEntity.ok(imageDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageDTO> getImageById(@PathVariable Long eventId, @PathVariable Long id) {
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Image> imageOpt = imageService.getImageById(id);
        if (imageOpt.isEmpty() || !imageOpt.get().getEvent().getId().equals(eventId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dtoMapper.toImageDto(imageOpt.get()));
    }

    @PostMapping
    public ResponseEntity<Object> addImageToEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody ImageCreationDTO imageCreationDTO) {
        
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if event already has the maximum number of images (4)
        long currentImageCount = imageService.getImageCountForEvent(eventId);
        if (currentImageCount >= 4) {
            return ResponseEntity
                    .badRequest()
                    .body("Event already has the maximum number of images (4)");
        }

        Image image = new Image();
        image.setImageUrl(imageCreationDTO.getImageUrl());
        image.setDisplayOrder(imageCreationDTO.getDisplayOrder());
        image.setCreatedAt(LocalDateTime.now());
        image.setEvent(eventOpt.get());

        Image savedImage = imageService.createImage(image);
        return new ResponseEntity<>(dtoMapper.toImageDto(savedImage), HttpStatus.CREATED);
    }
    
    /**
     * Batch upload multiple images for an event
     * 
     * @param eventId The ID of the event to add images to
     * @param batchUploadDTO The batch of images to upload
     * @return A list of created image DTOs
     */
    @PostMapping("/batch")
    public ResponseEntity<Object> batchUploadImages(
            @PathVariable Long eventId,
            @Valid @RequestBody BatchImageUploadDTO batchUploadDTO) {
        
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if adding these images would exceed the limit of 4
        long currentImageCount = imageService.getImageCountForEvent(eventId);
        int newImagesCount = batchUploadDTO.getImages().size();
        
        if (currentImageCount + newImagesCount > 4) {
            return ResponseEntity
                    .badRequest()
                    .body("Cannot add " + newImagesCount + " images as it would exceed the maximum of 4 images per event. " +
                          "Current count: " + currentImageCount);
        }

        Event event = eventOpt.get();
        List<ImageDTO> createdImages = new ArrayList<>();
        
        for (ImageCreationDTO imageDTO : batchUploadDTO.getImages()) {
            Image image = new Image();
            image.setImageUrl(imageDTO.getImageUrl());
            image.setDisplayOrder(imageDTO.getDisplayOrder());
            image.setCreatedAt(LocalDateTime.now());
            image.setEvent(event);
            
            Image savedImage = imageService.createImage(image);
            createdImages.add(dtoMapper.toImageDto(savedImage));
        }
        
        return new ResponseEntity<>(createdImages, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageDTO> updateImageOrder(
            @PathVariable Long eventId,
            @PathVariable Long id,
            @Valid @RequestBody ImageCreationDTO imageCreationDTO) {
        
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Image> imageOpt = imageService.getImageById(id);
        if (imageOpt.isEmpty() || !imageOpt.get().getEvent().getId().equals(eventId)) {
            return ResponseEntity.notFound().build();
        }

        Image updatedImage = imageService.updateImageOrder(id, imageCreationDTO.getDisplayOrder());
        return ResponseEntity.ok(dtoMapper.toImageDto(updatedImage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long eventId, @PathVariable Long id) {
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Image> imageOpt = imageService.getImageById(id);
        if (imageOpt.isEmpty() || !imageOpt.get().getEvent().getId().equals(eventId)) {
            return ResponseEntity.notFound().build();
        }

        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Delete all images for an event
     * 
     * @param eventId The ID of the event to delete images from
     * @return No content response if successful
     */
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllImages(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventService.getEventById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        imageService.deleteAllImagesByEventId(eventId);
        return ResponseEntity.noContent().build();
    }
}