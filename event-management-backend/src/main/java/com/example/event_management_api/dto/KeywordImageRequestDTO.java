package com.example.event_management_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordImageRequestDTO {
    
    @NotBlank(message = "Keyword is required")
    private String keyword;
    
    @Min(value = 1, message = "At least 1 image must be requested")
    @Max(value = 4, message = "Maximum 4 images can be requested")
    private int count = 4; // Default to 4 images
}