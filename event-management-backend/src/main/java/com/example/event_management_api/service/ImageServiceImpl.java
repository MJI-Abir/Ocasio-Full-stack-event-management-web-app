package com.example.event_management_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.event_management_api.model.Event;
import com.example.event_management_api.model.Image;
import com.example.event_management_api.repository.ImageRepository;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Autowired
    public ImageServiceImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    @Transactional
    public Image createImage(Image image) {
        return imageRepository.save(image);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Image> getImagesByEventId(Long eventId) {
        return imageRepository.findByEventId(eventId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Image> getImagesByEvent(Event event) {
        return imageRepository.findByEventOrderByDisplayOrderAsc(event);
    }

    @Override
    @Transactional
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public void deleteAllImagesByEventId(Long eventId) {
        List<Image> images = imageRepository.findByEventId(eventId);
        imageRepository.deleteAll(images);
    }

    @Override
    @Transactional
    public Image updateImageOrder(Long id, Integer displayOrder) {
        Optional<Image> imageOpt = imageRepository.findById(id);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            image.setDisplayOrder(displayOrder);
            return imageRepository.save(image);
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public long getImageCountForEvent(Long eventId) {
        return imageRepository.countByEventId(eventId);
    }
}