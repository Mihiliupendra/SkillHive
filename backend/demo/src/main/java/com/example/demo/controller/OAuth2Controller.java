package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(Authentication authentication) {
        // 1. Extract user info from OAuth2User
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = (String) oauthUser.getAttribute("email");
        String name = (String) oauthUser.getAttribute("name");
        String username = email.split("@")[0];

        // 2. Register or update user in your DB
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(username);
                    newUser.setFirstName(name);
                    // set other fields as needed
                    return userRepository.save(newUser);
                });

        // 3. Generate JWT
        String jwt = jwtUtils.generateTokenFromUsername(user.getId(), user.getUsername());

        // 4. Return user info and JWT
        return ResponseEntity.ok()
                .body(Map.of(
                        "token", jwt,
                        "user", user
                ));
    }
}