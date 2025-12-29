package com.SAGE.sageWebsite.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "password123"; // You can change this to your desired password
        String encodedPassword = encoder.encode(rawPassword);

        System.out.println("------------------------------------------------");
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Encoded Password: " + encodedPassword);
        System.out.println("------------------------------------------------");
    }
}
