package com.example.Backend.Service;

import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.Backend.Model.AlertEntity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.AlertRepository;

import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WeatherService weatherService;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private String port;

    @CacheEvict(value = "historyCache", allEntries = true)
    public AlertEntity saveAlert(AlertEntity alert) {
        String cleanCity = alert.getCity().trim().toLowerCase();
        String cleanEmail = alert.getEmail().trim().toLowerCase();

        AlertEntity savedEntity = null;
        List<AlertEntity> allAlerts = alertRepository.findAll();

        for (AlertEntity existing : allAlerts) {
            if (existing.getEmail().equalsIgnoreCase(cleanEmail) && existing.getCity().equalsIgnoreCase(cleanCity)) {
                existing.setTargetTemp(alert.getTargetTemp());
                existing.setTriggerCondition(alert.getTriggerCondition());
                savedEntity = alertRepository.save(existing);
                break;
            }
        }

        if (savedEntity == null) {
            alert.setCity(cleanCity);
            alert.setEmail(cleanEmail);
            savedEntity = alertRepository.save(alert);
        }

        evaluateAndTriggerSingleAlert(savedEntity);
        return savedEntity;
    }

    public long getActiveAlertCount() {
        return alertRepository.count();
    }

    @Scheduled(fixedRate = 3600000)
    public void checkWeatherAlerts() {
        List<AlertEntity> activeAlerts = alertRepository.findAll();
        for (AlertEntity alert : activeAlerts) {
            evaluateAndTriggerSingleAlert(alert);
        }
    }

    private void evaluateAndTriggerSingleAlert(AlertEntity alert) {
        try {
            WeatherEntity currentLiveWeather = weatherService.getWeather(alert.getCity());
            double currentTemp = currentLiveWeather.getTemparature();
            boolean triggered = false;

            if (alert.getTriggerCondition().equalsIgnoreCase("ABOVE") && currentTemp > alert.getTargetTemp()) {
                triggered = true;
            } else if (alert.getTriggerCondition().equalsIgnoreCase("BELOW") && currentTemp < alert.getTargetTemp()) {
                triggered = true;
            }

            if (triggered) {
                sendNotificationEmail(alert.getEmail(), alert.getCity(), currentTemp, alert.getTargetTemp(), alert.getTriggerCondition());
            }
        } catch (Exception e) {
            System.err.println("Alert evaluation skipped for ID " + alert.getId() + ": " + e.getMessage());
        }
    }

    @Async
    protected void sendNotificationEmail(String toEmail, String city, double currentTemp, double targetTemp, String condition) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("SkySync Weather Alert: " + city.toUpperCase());

            String emailText = String.format(
                "Hello,\n\nYour SkySync weather alert has been triggered.\n\n" +
                "City       : %s\n" +
                "Current    : %.1f°C\n" +
                "Condition  : Temperature is %s %.1f°C\n\n" +
                "Stay prepared.\n\nSkySync Weather Engine",
                city.toUpperCase(), currentTemp, condition.toLowerCase(), targetTemp
            );

            message.setText(emailText);
            Transport.send(message);
        } catch (Exception e) {
            System.err.println("Email dispatch failed: " + e.getMessage());
        }
    }

    @CacheEvict(value = "historyCache", allEntries = true)
    public void deleteSpecificAlert(String email, String city) {
        String cleanEmail = email.trim().toLowerCase();
        String cleanCity = city.trim().toLowerCase();
        List<AlertEntity> activeAlerts = alertRepository.findAll();
        for (AlertEntity alert : activeAlerts) {
            if (alert.getEmail().equalsIgnoreCase(cleanEmail) && alert.getCity().equalsIgnoreCase(cleanCity)) {
                alertRepository.delete(alert);
                break;
            }
        }
    }
}