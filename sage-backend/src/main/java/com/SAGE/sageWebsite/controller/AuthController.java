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

    @GetMapping("/me")
    public ResponseEntity<?> checkSession(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return userRepository.findByEmail(principal.getName())
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole())))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody com.SAGE.sageWebsite.dto.UserUpdateDTO updateRequest,
            java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOptional = userRepository.findByEmail(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty()) {
            Optional<User> existingUsername = userRepository.findByUsername(updateRequest.getUsername());
            if (existingUsername.isPresent() && !existingUsername.get().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body("Username is already in use");
            }
            user.setUsername(updateRequest.getUsername());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
            // Check if email is taken by another user
            Optional<User> existingUser = userRepository.findByEmail(updateRequest.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body("Email is already in use");
            }
            user.setEmail(updateRequest.getEmail());
        }

        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(updateRequest.getPassword()));
        }

        userRepository.save(user);

        // Update security context if email changed (since email is the username in
        // Spring Security here)
        // Note: For simplicity, we might ask the user to re-login if they change their
        // email,
        // but for now we'll just return the updated info.

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> currentUser = userRepository.findByEmail(principal.getName());
        if (currentUser.isEmpty() || !"admin".equalsIgnoreCase(currentUser.get().getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        java.util.List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "role", u.getRole() != null ? u.getRole() : "User",
                        "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(users);
    }
}
