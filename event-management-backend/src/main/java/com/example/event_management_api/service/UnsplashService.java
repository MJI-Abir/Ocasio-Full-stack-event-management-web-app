package com.example.event_management_api.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.event_management_api.dto.ImageCreationDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UnsplashService {

    @Value("${unsplash.api.url}")
    private String unsplashApiUrl;

    @Value("${unsplash.api.access-key}")
    private String unsplashAccessKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public UnsplashService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Fetches random images from Unsplash API based on a keyword query
     * 
     * @param keyword The search term to find images for
     * @param count Number of images to retrieve (max 4)
     * @return List of ImageCreationDTO objects with image URLs and display orders
     */
    public List<ImageCreationDTO> getRandomImages(String keyword, int count) {
        // Ensure count is between 1 and 4
        count = Math.min(Math.max(count, 1), 4);
        
        try {
            // Build the URL
            String url = UriComponentsBuilder
                .fromHttpUrl(unsplashApiUrl + "/photos/random")
                .queryParam("query", keyword)
                .queryParam("count", count)
                .queryParam("client_id", unsplashAccessKey)
                .queryParam("orientation", "landscape") // Prefer landscape for better event display
                .build()
                .toUriString();

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // Make the API request
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                String.class
            );
            
            // Process the response
            List<ImageCreationDTO> images = new ArrayList<>();
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            
            // Process array of results
            for (int i = 0; i < rootNode.size(); i++) {
                JsonNode imageNode = rootNode.get(i);
                
                // Get the URL for the regular sized image
                String imageUrl = imageNode.path("urls").path("regular").asText();
                
                // Add attribution as required by Unsplash API Guidelines
                String photographerName = imageNode.path("user").path("name").asText("Unknown");
                String photographerUsername = imageNode.path("user").path("username").asText();
                String unsplashLink = "https://unsplash.com/@" + photographerUsername + "?utm_source=event_management&utm_medium=referral";
                
                // The image URL to use
                String attributedImageUrl = imageUrl + "?utm_source=event_management&utm_medium=referral";
                
                // Create the ImageCreationDTO
                ImageCreationDTO imageDTO = new ImageCreationDTO();
                imageDTO.setImageUrl(attributedImageUrl);
                imageDTO.setDisplayOrder(i + 1);
                
                images.add(imageDTO);
            }
            
            return images;
        } catch (Exception e) {
            log.error("Error fetching images from Unsplash", e);
            throw new RuntimeException("Failed to fetch images from Unsplash: " + e.getMessage(), e);
        }
    }
}