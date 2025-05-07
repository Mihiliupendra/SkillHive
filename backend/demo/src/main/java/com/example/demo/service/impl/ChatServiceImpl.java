package com.example.demo.service.impl;

import com.example.demo.model.ChatMessage;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Override
    public ChatMessage saveMessage(ChatMessage message) {
        message.onCreate();
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Broadcast the message to the community topic
        messagingTemplate.convertAndSend("/topic/community/" + message.getCommunityId(), savedMessage);
        
        return savedMessage;
    }
    
    @Override
    public Page<ChatMessage> getCommunityMessages(String communityId, Pageable pageable) {
        return chatMessageRepository.findByCommunityIdOrderByTimestampDesc(communityId, pageable);
    }
    
    @Override
    public List<ChatMessage> getRecentCommunityMessages(String communityId) {
        return chatMessageRepository.findTop50ByCommunityIdOrderByTimestampDesc(communityId);
    }
}