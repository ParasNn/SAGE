package com.SAGE.sageWebsite.controller;

import com.SAGE.sageWebsite.model.User;
import com.SAGE.sageWebsite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private org.springframework.security.web.context.SecurityContextRepository securityContextRepository = new org.springframework.security.web.context.HttpSessionSecurityContextRepository();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest,
            jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        try {
            org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email,
                            password));

            org.springframework.security.core.context.SecurityContext context = org.springframework.security.core.context.SecurityContextHolder
                    .createEmptyContext();
            context.setAuthentication(authentication);
            org.springframework.security.core.context.SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                System.out.println("LOGIN SUCCESS: " + user.getEmail());
                return ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found after auth");
            }

        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String username = registerRequest.get("username");
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String role = registerRequest.get("role");

        if (username == null || email == null || password == null || role == null) {
            return ResponseEntity.badRequest().body("All fields (username, email, password, role) are required");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setRole(role);
        newUser.setCreatedAt(java.time.LocalDateTime.now());

        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }
}
