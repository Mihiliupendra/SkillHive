package com.example.demo.config;
import com.example.demo.security.UserPrincipal;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.services.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.List;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketSecurityConfig.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extract authorization header
                    List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");
                    List<String> refreshTokenHeaders = accessor.getNativeHeader("X-Refresh-Token");
                    String token = null;
                    String refreshToken = null;
                    
                    // Get access token
                    if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                        String authHeader = authorizationHeaders.get(0);
                        if (authHeader.startsWith("Bearer ")) {
                            token = authHeader.substring(7);
                        } else {
                            token = authHeader;
                        }
                    }
                    
                    // Get refresh token
                    if (refreshTokenHeaders != null && !refreshTokenHeaders.isEmpty()) {
                        refreshToken = refreshTokenHeaders.get(0);
                    }
                    
                    boolean authenticated = false;
                    
                    // Try to authenticate with access token
                    if (token != null && jwtUtils.validateJwtToken(token)) {
                        try {
                            String username = jwtUtils.getUserNameFromJwtToken(token);
                            
                            // Load user details
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            UserPrincipal userPrincipal = (UserPrincipal) userDetails;
                            
                            // Set the principal
                            accessor.setUser(new Principal() {
                                @Override
                                public String getName() {
                                    return userPrincipal.getId();
                                }
                            });
                            
                            // Log successful authentication
                            logger.debug("WebSocket authenticated with access token for user: {}", userPrincipal.getUsername());
                            authenticated = true;
                        } catch (Exception e) {
                            // Log error but continue
                            logger.error("Error authenticating WebSocket connection with access token: {}", e.getMessage());
                        }
                    }
                    
                    // If access token failed, try refresh token
                    if (!authenticated && refreshToken != null && jwtUtils.validateJwtToken(refreshToken)) {
                        try {
                            String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
                            String userId = jwtUtils.getUserIdFromJwtToken(refreshToken);
                            
                            // Set principal directly from token claims
                            accessor.setUser(new Principal() {
                                @Override
                                public String getName() {
                                    return userId;
                                }
                            });
                            
                            // Log successful refresh token authentication
                            logger.debug("WebSocket authenticated with refresh token for username: {}", username);
                            authenticated = true;
                        } catch (Exception e) {
                            logger.error("Error authenticating WebSocket connection with refresh token: {}", e.getMessage());
                        }
                    }
                    
                    // Fallback to user ID header if token auth fails
                    if (!authenticated) {
                        List<String> userIdHeader = accessor.getNativeHeader("X-User-Id");
                        if (userIdHeader != null && !userIdHeader.isEmpty()) {
                            String userId = userIdHeader.get(0);
                            
                            // Set simple principal with user ID
                            accessor.setUser(new Principal() {
                                @Override
                                public String getName() {
                                    return userId;
                                }
                            });
                            
                            logger.debug("WebSocket connection using fallback X-User-Id header for: {}", userId);
                        } else {
                            logger.warn("WebSocket connection attempted without valid authentication");
                        }
                    }
                }
                return message;
            }
        });
    }
}
