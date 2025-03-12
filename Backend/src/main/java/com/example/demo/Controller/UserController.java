//package com.example.demo.Controller;
//
//import com.example.demo.Entity.User;
//import com.example.demo.Security.JwtTokenProvider;
//import com.example.demo.Services.UserService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.DisabledException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//import java.util.Map;
//import java.util.HashMap;
//
//@CrossOrigin(origins = "*")
//@RestController
//@RequestMapping("/api/auth")
//public class UserController {
//    private final UserService userService;
//    private final AuthenticationManager authenticationManager;
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
//        this.userService = userService;
//        this.authenticationManager = authenticationManager;
//        this.jwtTokenProvider = jwtTokenProvider;
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        try {
//            User registeredUser = userService.registerUser(user);
//            return ResponseEntity.ok(Map.of(
//                    "message", "Registration successful. Please check your email to verify your account.",
//                    "userId", registeredUser.getId()
//            ));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//
//    @GetMapping("/verify")
//    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
//        boolean verified = userService.verifyEmail(token);
//        if (verified) {
//            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
//        } else {
//            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired verification token"));
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
//        try {
//            // Authenticate the user
//            Authentication auth = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.get("email"), loginRequest.get("password"))
//            );
//
//            // Set the authentication in the SecurityContext
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//            // Generate the JWT token
//            String token = jwtTokenProvider.generateToken(auth);
//
//            // Get the user's role
//            String role = auth.getAuthorities().stream()
//                    .findFirst()
//                    .orElseThrow(() -> new RuntimeException("User has no roles assigned"))
//                    .getAuthority()
//                    .replace("ROLE_", "");
//
//            // Return token and role in response
//            Map<String, Object> response = new HashMap<>();
//            response.put("token", token);
//            response.put("role", role);
//            response.put("email", auth.getName());
//
//            return ResponseEntity.ok(response);
//
//        } catch (DisabledException e) {
//            return ResponseEntity.status(403).body(Map.of("error", "Account not verified. Please check your email to verify your account."));
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
//        } catch (AuthenticationException e) {
//            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed: " + e.getMessage()));
//        }
//    }
//}
package com.example.demo.Controller;

import com.example.demo.Entity.User;
import com.example.demo.Security.JwtTokenProvider;
import com.example.demo.Services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful. Please check your email to verify your account.",
                    "userId", registeredUser.getId()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean verified = userService.verifyEmail(token);
        if (verified) {
            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired verification token"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            // Authenticate the user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.get("email"), loginRequest.get("password"))
            );

            // Set the authentication in the SecurityContext
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Generate the JWT token
            String token = jwtTokenProvider.generateToken(auth);

            // Get the user's role
            String role = auth.getAuthorities().stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("User has no roles assigned"))
                    .getAuthority()
                    .replace("ROLE_", "");

            // Return token and role in response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("email", auth.getName());

            return ResponseEntity.ok(response);

        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Account not verified. Please check your email to verify your account."));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        boolean emailSent = userService.forgotPassword(email);

        // Always return success (even if email doesn't exist) to prevent email enumeration attacks
        return ResponseEntity.ok(Map.of("message",
                "If the email address exists in our system, you will receive password reset instructions"));
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = userService.validateResetToken(token);

        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Token is valid"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Reset token is required"));
        }

        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
        }

        boolean success = userService.resetPassword(token, newPassword);

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reset password. Invalid or expired token"));
        }
    }
}