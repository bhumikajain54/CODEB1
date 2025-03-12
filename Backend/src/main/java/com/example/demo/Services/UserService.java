//package com.example.demo.Services;
//
//import java.util.Optional;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import com.example.demo.Entity.User;
//import com.example.demo.Repository.UserRepository;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.beans.factory.annotation.Value;
//import java.util.UUID;
//import java.util.regex.Pattern;
//
//@Service
//public class UserService {
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JavaMailSender mailSender;
//
//    @Value("${app.frontend-url:http://localhost:3000}")
//    private String frontendUrl;
//
//    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.mailSender = mailSender;
//    }
//
//    // Email validation method
//    private boolean isValidEmail(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
//        Pattern pattern = Pattern.compile(emailRegex);
//
//        if (email == null) return false;
//        return pattern.matcher(email).matches();
//    }
//
//    // Generate email verification token
//    private String generateVerificationToken() {
//        return UUID.randomUUID().toString();
//    }
//
//    // Send verification email with proper link
//    private void sendVerificationEmail(User user, String verificationToken) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(user.getEmail());
//        message.setSubject("Email Verification");
//        message.setText("Click the link to verify your email: " +
//                frontendUrl + "/verify?token=" + verificationToken);
//
//        mailSender.send(message);
//    }
//
//    public User registerUser(User user) {
//        // Validate email
//        if (!isValidEmail(user.getEmail())) {
//            throw new IllegalArgumentException("Invalid email format");
//        }
//
//        // Check if email already exists
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new IllegalArgumentException("Email already in use");
//        }
//
//        // Generate verification token
//        String verificationToken = generateVerificationToken();
//        user.setVerificationToken(verificationToken);
//        user.setEnabled(false); // User not enabled until verified
//
//        // Encode password
//        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
//
//        // Save user
//        User savedUser = userRepository.save(user);
//
//        // Send verification email
//        sendVerificationEmail(savedUser, verificationToken);
//
//        return savedUser;
//    }
//
//    public boolean verifyEmail(String token) {
//        Optional<User> userOptional = userRepository.findByVerificationToken(token);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//            user.setEnabled(true);
//            user.setVerificationToken(null);
//            userRepository.save(user);
//            return true;
//        }
//
//        return false;
//    }
//
//    public Optional<User> findByEmail(String email) {
//        return userRepository.findByEmail(email);
//    }
//}
//package com.example.demo.Services;
//
//import java.util.Optional;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import com.example.demo.Entity.User;
//import com.example.demo.Repository.UserRepository;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.beans.factory.annotation.Value;
//import java.time.LocalDateTime;
//import java.util.UUID;
//import java.util.regex.Pattern;
//
//@Service
//public class UserService {
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JavaMailSender mailSender;
//
//    @Value("${app.frontend-url:http://localhost:3000}")
//    private String frontendUrl;
//
//    // Token expiration time in hours
//    private static final int RESET_TOKEN_EXPIRY_HOURS = 24;
//
//    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.mailSender = mailSender;
//    }
//
//    // Email validation method
//    private boolean isValidEmail(String email) {
//        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
//        Pattern pattern = Pattern.compile(emailRegex);
//
//        if (email == null) return false;
//        return pattern.matcher(email).matches();
//    }
//
//    // Generate token (shared for verification and reset)
//    private String generateToken() {
//        return UUID.randomUUID().toString();
//    }
//
//    // Send verification email with proper link
//    private void sendVerificationEmail(User user, String verificationToken) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(user.getEmail());
//        message.setSubject("Email Verification");
//        message.setText("Click the link to verify your email: " +
//                frontendUrl + "/verify?token=" + verificationToken);
//
//        mailSender.send(message);
//    }
//
//    // Send password reset email
//    private void sendPasswordResetEmail(User user, String resetToken) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(user.getEmail());
//        message.setSubject("Password Reset Request");
//        message.setText("Click the link to reset your password: " +
//                frontendUrl + "/reset-password?token=" + resetToken +
//                "\n\nThis link will expire in " + RESET_TOKEN_EXPIRY_HOURS + " hours.");
//
//        mailSender.send(message);
//    }
//
//    public User registerUser(User user) {
//        // Validate email
//        if (!isValidEmail(user.getEmail())) {
//            throw new IllegalArgumentException("Invalid email format");
//        }
//
//        // Check if email already exists
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new IllegalArgumentException("Email already in use");
//        }
//
//        // Generate verification token
//        String verificationToken = generateToken();
//        user.setVerificationToken(verificationToken);
//        user.setEnabled(false); // User not enabled until verified
//
//        // Encode password
//        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
//
//        // Save user
//        User savedUser = userRepository.save(user);
//
//        // Send verification email
//        sendVerificationEmail(savedUser, verificationToken);
//
//        return savedUser;
//    }
//
//    public boolean verifyEmail(String token) {
//        Optional<User> userOptional = userRepository.findByVerificationToken(token);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//            user.setEnabled(true);
//            user.setVerificationToken(null);
//            userRepository.save(user);
//            return true;
//        }
//
//        return false;
//    }
//
//    // Initiate password reset process
//    public boolean forgotPassword(String email) {
//        Optional<User> userOptional = userRepository.findByEmail(email);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//
//            // Generate reset token and set expiry
//            String resetToken = generateToken();
//            user.setResetToken(resetToken);
//            user.setResetTokenExpiry(LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRY_HOURS));
//
//            userRepository.save(user);
//
//            // Send password reset email
//            sendPasswordResetEmail(user, resetToken);
//
//            return true;
//        }
//
//        return false;
//    }
//
//    // Validate reset token
//    public boolean validateResetToken(String token) {
//        Optional<User> userOptional = userRepository.findByResetToken(token);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//
//            // Check if token is expired
//            if (user.getResetTokenExpiry() != null &&
//                    user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
//                return true;
//            }
//        }
//
//        return false;
//    }
//
//    // Reset password using token
//    public boolean resetPassword(String token, String newPassword) {
//        if (!validateResetToken(token)) {
//            return false;
//        }
//
//        Optional<User> userOptional = userRepository.findByResetToken(token);
//
//        if (userOptional.isPresent()) {
//            User user = userOptional.get();
//
//            // Update password
//            user.setPasswordHash(passwordEncoder.encode(newPassword));
//
//            // Clear reset token
//            user.setResetToken(null);
//            user.setResetTokenExpiry(null);
//
//            userRepository.save(user);
//
//            return true;
//        }
//
//        return false;
//    }
//
//    public Optional<User> findByEmail(String email) {
//        return userRepository.findByEmail(email);
//    }
//}
package com.example.demo.Services;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${frontend-url}")
    private String frontendUrl;

    // Token expiration time in hours
    private static final int RESET_TOKEN_EXPIRY_HOURS = 24;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    // Email validation method
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);

        if (email == null) return false;
        return pattern.matcher(email).matches();
    }

    // Generate token (shared for verification and reset)
    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    // Send verification email with proper link
    private void sendVerificationEmail(User user, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Email Verification");
        message.setText("Click the link to verify your email: " +
                frontendUrl + "/verify?token=" + verificationToken);

        mailSender.send(message);
    }

    // Send password reset email
    private void sendPasswordResetEmail(User user, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password: " +
                frontendUrl + "/reset-password?token=" + resetToken +
                "\n\nThis link will expire in " + RESET_TOKEN_EXPIRY_HOURS + " hours.");

        mailSender.send(message);
    }

    public User registerUser(User user) {
        // Validate email
        if (!isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Generate verification token
        String verificationToken = generateToken();
        user.setVerificationToken(verificationToken);
        user.setEnabled(false); // User not enabled until verified

        // Encode password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // Save user
        User savedUser = userRepository.save(user);

        // Send verification email
        sendVerificationEmail(savedUser, verificationToken);

        return savedUser;
    }

    public boolean verifyEmail(String token) {
        Optional<User> userOptional = userRepository.findByVerificationToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setEnabled(true);
            // Keep the verification token instead of setting it to null
            // user.setVerificationToken(null); - removed this line
            userRepository.save(user);
            return true;
        }

        return false;
    }

    // Initiate password reset process
    public boolean forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Generate reset token and set expiry
            String resetToken = generateToken();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRY_HOURS));

            userRepository.save(user);

            // Send password reset email
            sendPasswordResetEmail(user, resetToken);

            return true;
        }

        return false;
    }

    // Validate reset token
    public boolean validateResetToken(String token) {
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Check if token is expired
            if (user.getResetTokenExpiry() != null &&
                    user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
                return true;
            }
        }

        return false;
    }

    // Reset password using token
    public boolean resetPassword(String token, String newPassword) {
        if (!validateResetToken(token)) {
            return false;
        }

        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Update password
            user.setPasswordHash(passwordEncoder.encode(newPassword));

            // Keep the reset token instead of clearing it
            // user.setResetToken(null); - removed this line
            // user.setResetTokenExpiry(null); - removed this line

            userRepository.save(user);

            return true;
        }

        return false;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}