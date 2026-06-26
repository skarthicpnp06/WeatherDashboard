package com.example.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.DTO.FarmerAdvisoryDTO;
import com.example.Backend.Exception.InvalidRequestException;
import com.example.Backend.Service.FarmerService;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @GetMapping("/advisory")
    public FarmerAdvisoryDTO getAdvisory(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter is required.");
        }
        return farmerService.generateAdvisory(city.trim());
    }
}