package com.example.Backend.Service;

import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.Backend.Model.AlertEntity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.AlertRepository;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
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

    public AlertEntity saveAlert(AlertEntity alert) {
        String cleanCity = alert.getCity().trim().toLowerCase();
        String cleanEmail = alert.getEmail().trim().toLowerCase();
        
        List<AlertEntity> allAlerts = alertRepository.findAll();
        for (AlertEntity existing : allAlerts) {
            if (existing.getEmail().equalsIgnoreCase(cleanEmail) && existing.getCity().equalsIgnoreCase(cleanCity)) {
                existing.setTargetTemp(alert.getTargetTemp());
                existing.setTriggerCondition(alert.getTriggerCondition());
                return alertRepository.save(existing);
            }
        }
        
        alert.setCity(cleanCity);
        alert.setEmail(cleanEmail);
        return alertRepository.save(alert);
    }

    @Scheduled(fixedRate = 3600000)
    public void checkWeatherAlerts() {
        List<AlertEntity> activeAlerts = alertRepository.findAll();
        
        for (AlertEntity alert : activeAlerts) {
            try {
                WeatherEntity currentLiveWeather = weatherService.getWeather(alert.getCity());
                Double currentTemp = currentLiveWeather.getTemparature();
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
                System.out.println("Skipping alert calculation for ID " + alert.getId() + ": " + e.getMessage());
            }
        }
    }

    private void sendNotificationEmail(String toEmail, String city, double currentTemp, double targetTemp, String condition) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);

        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("🚨 SkySync Weather Alert: " + city.toUpperCase());
            
            String emailText = String.format(
                "Hello!\n\nYour SkySync weather trigger has fired.\n" +
                "The current temperature in %s is %s°C, which is %s your threshold target of %s°C.\n\n" +
                "Stay prepared!\n- SkySync Weather Engine",
                city.toUpperCase(), currentTemp, condition.toLowerCase(), targetTemp
            );
            
            message.setText(emailText);
            Transport.send(message);
            System.out.println("📬 Alert email successfully dispatched to " + toEmail);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to transmit email alert", e);
        }
    }
}