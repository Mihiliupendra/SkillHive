package com.example.demo.service;

import com.example.demo.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService {
    
    ChatMessage saveMessage(ChatMessage message);
    
    Page<ChatMessage> getCommunityMessages(String communityId, Pageable pageable);
    
    List<ChatMessage> getRecentCommunityMessages(String communityId);
}