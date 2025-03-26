package com.example.event_management_api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    @Async
    public void sendRegistrationConfirmation(String to, String userName, String eventTitle, 
                                           String eventDate, String eventLocation) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Registration Confirmation: " + eventTitle);
            
            String emailContent = buildRegistrationEmail(userName, eventTitle, eventDate, eventLocation);
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error
        }
    }
    
    @Async
    public void sendEventReminder(String to, String userName, String eventTitle, 
                                String eventDate, String eventLocation) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("Reminder: " + eventTitle + " is Coming Up!");
            
            String emailContent = buildReminderEmail(userName, eventTitle, eventDate, eventLocation);
            helper.setText(emailContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error
        }
    }
    
    private String buildRegistrationEmail(String userName, String eventTitle, 
                                        String eventDate, String eventLocation) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h2>Registration Confirmation</h2>");
        sb.append("<p>Hello ").append(userName).append(",</p>");
        sb.append("<p>Thank you for registering for <strong>").append(eventTitle).append("</strong>.</p>");
        sb.append("<p>Event details:</p>");
        sb.append("<ul>");
        sb.append("<li>Date: ").append(eventDate).append("</li>");
        sb.append("<li>Location: ").append(eventLocation).append("</li>");
        sb.append("</ul>");
        sb.append("<p>We look forward to seeing you there!</p>");
        sb.append("<p>Best regards,<br>The Event Management Team</p>");
        sb.append("</body></html>");
        return sb.toString();
    }
    
    private String buildReminderEmail(String userName, String eventTitle, 
                                    String eventDate, String eventLocation) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h2>Event Reminder</h2>");
        sb.append("<p>Hello ").append(userName).append(",</p>");
        sb.append("<p>This is a reminder that <strong>").append(eventTitle).append("</strong> is coming up soon.</p>");
        sb.append("<p>Event details:</p>");
        sb.append("<ul>");
        sb.append("<li>Date: ").append(eventDate).append("</li>");
        sb.append("<li>Location: ").append(eventLocation).append("</li>");
        sb.append("</ul>");
        sb.append("<p>We look forward to seeing you there!</p>");
        sb.append("<p>Best regards,<br>The Event Management Team</p>");
        sb.append("</body></html>");
        return sb.toString();
    }
}