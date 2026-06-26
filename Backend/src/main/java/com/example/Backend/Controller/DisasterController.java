package com.example.Backend.Controller;

import com.example.Backend.DTO.DisasterAlertDTO;
import com.example.Backend.Exception.InvalidRequestException;
import com.example.Backend.Model.DisasterAlertEntity;
import com.example.Backend.Service.DisasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/disaster")
public class DisasterController {

    @Autowired
    private DisasterService disasterService;

    @GetMapping("/assess")
    public DisasterAlertDTO assessRisk(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter is required.");
        }
        return disasterService.assessRisk(city.trim());
    }

    @GetMapping("/history")
    public List<DisasterAlertEntity> getHistory(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter is required.");
        }
        return disasterService.getAlertHistory(city.trim());
    }
}