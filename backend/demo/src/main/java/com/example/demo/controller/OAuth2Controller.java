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
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OAuth2Controller.class);

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(Authentication authentication) {
        try {
            log.info("OAuth2 authentication successful: {}", authentication.getName());
            
            // 1. Extract user info from OAuth2User
            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oauthUser.getAttributes();
            log.info("OAuth2 user attributes: {}", attributes);
            
            String email = (String) oauthUser.getAttribute("email");
            String name = (String) oauthUser.getAttribute("name");
            String picture = (String) oauthUser.getAttribute("picture");
            String username = email.split("@")[0];

            // 2. Register or update user in your DB
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        log.info("Creating new user for email: {}", email);
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setUsername(username);
                        newUser.setFirstName(name);
                        newUser.setProfilePicture(picture);
                        newUser.setEnabled(true);
                        return userRepository.save(newUser);
                    });            // 3. Generate JWT tokens
            String accessToken = jwtUtils.generateTokenFromUsername(user.getId(), user.getUsername());
            String refreshToken = jwtUtils.generateRefreshTokenFromUsername(user.getId(), user.getUsername());

            // 4. Return user info and JWT
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("accessToken", accessToken);
            responseMap.put("token", accessToken); // For backward compatibility
            responseMap.put("refreshToken", refreshToken);
            responseMap.put("tokenType", "Bearer");
            responseMap.put("id", user.getId());
            responseMap.put("username", user.getUsername());
            responseMap.put("email", user.getEmail());
            responseMap.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
            responseMap.put("lastName", user.getLastName() != null ? user.getLastName() : "");
            responseMap.put("profilePicture", user.getProfilePicture() != null ? user.getProfilePicture() : "");
            
            return ResponseEntity.ok().body(responseMap);
        } catch (Exception e) {
            log.error("Error in OAuth2 success handler", e);
            return ResponseEntity.status(500).body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
}