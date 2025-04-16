package com.example.demo.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class ProfileCompletionDto {
    @Size(max = 100)
    private String professionalHeader;

    private Set<String> skills;

    @Size(max = 50)
    private String country;

    @Size(max = 50)
    private String city;
} 