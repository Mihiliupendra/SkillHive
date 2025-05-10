package com.example.demo.controller;

import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.UserInfoResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "*", maxAge = 36000)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private Environment env;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Generate both access and refresh tokens
        String accessToken = jwtUtils.generateTokenFromUsername(userPrincipal.getId(), userPrincipal.getUsername());
        String refreshToken = jwtUtils.generateRefreshTokenFromUsername(userPrincipal.getId(), userPrincipal.getUsername());
        
        // Create cookies for tokens
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userPrincipal.getId(), userPrincipal.getUsername());
        ResponseCookie refreshJwtCookie = jwtUtils.generateRefreshJwtCookie(userPrincipal.getId(), userPrincipal.getUsername());
          // Build the response with tokens and cookies
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshJwtCookie.toString())
                .body(Map.of(
                    "id", userPrincipal.getId(),
                    "username", userPrincipal.getUsername(),
                    "email", userPrincipal.getEmail(),
                    "firstName", userPrincipal.getFirstName() != null ? userPrincipal.getFirstName() : "",
                    "lastName", userPrincipal.getLastName() != null ? userPrincipal.getLastName() : "",
                    "profilePicture", userPrincipal.getProfilePicture() != null ? userPrincipal.getProfilePicture() : "",
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "tokenType", "Bearer"
                ));
    }    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
        ResponseCookie refreshCookie = jwtUtils.getCleanRefreshJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            // Get token from the request
            String idToken = body.get("token");
            
            if (idToken == null || idToken.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: ID token is empty"));
            }
            
            // Verify the token with Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(env.getProperty("spring.security.oauth2.client.registration.google.client-id")))
                    .build();
            
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid ID token"));
            }
            
            // Get user info from token
            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String username = email.split("@")[0];
            
            // Find or create the user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setUsername(username);
                        newUser.setFirstName(name);
                        newUser.setProfilePicture(pictureUrl);
                        newUser.setEnabled(true);
                        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random secure password
                        
                        return userRepository.save(newUser);
                    });
            
            // Generate JWT tokens
            String accessToken = jwtUtils.generateTokenFromUsername(user.getId(), user.getUsername());
            String refreshToken = jwtUtils.generateRefreshTokenFromUsername(user.getId(), user.getUsername());
            
            // Return user info and tokens
            return ResponseEntity.ok().body(new UserInfoResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getProfilePicture(),
                    accessToken,
                    refreshToken
            ));
        } catch (Exception e) {
            log.error("Google authentication error", e);
            return ResponseEntity.status(500).body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            User registeredUser = userService.registerNewUser(registrationDto);
            return ResponseEntity.ok(new UserInfoResponse(
                registeredUser.getId(),
                registeredUser.getUsername(),
                registeredUser.getEmail(),
                registeredUser.getFirstName(),
                registeredUser.getLastName(),
                registeredUser.getProfilePicture()
            ));
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        
        // Validate refresh token
        if (refreshToken != null && jwtUtils.validateJwtToken(refreshToken)) {
            try {
                // Extract username and user ID from the refresh token
                String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
                String userId = jwtUtils.getUserIdFromJwtToken(refreshToken);
                
                // Generate new access token
                String newAccessToken = jwtUtils.generateTokenFromUsername(userId, username);
                
                // Generate new refresh token if configured to rotate tokens
                String newRefreshToken = jwtUtils.generateRefreshTokenFromUsername(userId, username);
                
                // Create cookies for tokens
                ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userId, username);
                ResponseCookie refreshJwtCookie = jwtUtils.generateRefreshJwtCookie(userId, username);
                  // Return new tokens with cookies
                return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshJwtCookie.toString())
                    .body(Map.of(
                        "accessToken", newAccessToken,
                        "refreshToken", newRefreshToken,
                        "tokenType", "Bearer"
                    ));
                
            } catch (Exception e) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid refresh token"));
            }
        }
        
        return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid refresh token"));
    }
}