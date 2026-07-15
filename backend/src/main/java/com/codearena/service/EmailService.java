package com.codearena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to CodeArena!";
        String body = "Hi " + name + ",\n\n"
                + "Your CodeArena account has been created successfully.\n"
                + "You can now log in and start solving problems.\n\n"
                + "Happy coding!\nTeam CodeArena";
        send(toEmail, subject, body);
    }

    @Async
    public void sendLoginAlertEmail(String toEmail, String name) {
        String subject = "New login to your CodeArena account";
        String body = "Hi " + name + ",\n\n"
                + "We noticed a new login to your CodeArena account.\n"
                + "If this wasn't you, please reset your password immediately.\n\n"
                + "Team CodeArena";
        send(toEmail, subject, body);
    }

    @Async
    public void sendGoogleWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to CodeArena!";
        String body = "Hi " + name + ",\n\n"
                + "Your CodeArena account has been created using your Google account.\n"
                + "You can now log in anytime with the \"Sign in with Google\" button.\n\n"
                + "Happy coding!\nTeam CodeArena";
        send(toEmail, subject, body);
    }

    private void send(String toEmail, String subject, String body) {
        if (!mailEnabled || fromAddress == null || fromAddress.isBlank()) {
            log.info("Mail disabled/unconfigured - skipping email to {} (subject: {})", toEmail, subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Failed to send email to {}: {}", toEmail, ex.getMessage());
        }
    }
}
