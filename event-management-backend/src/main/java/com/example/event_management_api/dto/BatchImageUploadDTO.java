package com.example.event_management_api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchImageUploadDTO {
    
    @NotEmpty(message = "At least one image is required")
    @Size(max = 4, message = "Maximum 4 images allowed per event")
    private List<@Valid ImageCreationDTO> images;
}