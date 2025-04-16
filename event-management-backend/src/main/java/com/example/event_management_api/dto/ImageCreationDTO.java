package com.example.event_management_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageCreationDTO {
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    @NotNull(message = "Display order is required")
    private Integer displayOrder;
}