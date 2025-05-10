package com.example.demo.security.services;

import com.example.demo.model.Post;
import com.example.demo.model.PostType;
import com.example.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostServices {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MediaStorageService mediaStorageService;

    public Post createPost(String userId, String description,
            List<MultipartFile> mediaFiles,
            PostType type,
            List<String> tags) throws IOException {

        if (mediaFiles == null) {
            mediaFiles = new ArrayList<>();
        }

        if (mediaFiles.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 media items allowed");
        }

        List<Post.Media> mediaList = mediaStorageService.uploadMedia(mediaFiles);

        Post post = new Post();
        post.setUserId(userId);
        post.setDescription(description);
        post.setMedia(mediaList);
        post.setType(type);
        post.setTags(tags);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public Post getPost(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll(); // assuming you're using MongoRepository
    }

    public void deletePost(String id) {
        if (postRepository.existsById(id)) {
            Post post = postRepository.findById(id).get();

            // Delete associated media from Supabase
            for (Post.Media media : post.getMedia()) {
                try {
                    mediaStorageService.deleteMediaFromSupabase(media.getPublicId());
                } catch (IOException e) {
                    System.err.println("Failed to delete media from Supabase: " + media.getPublicId());
                }
            }

            // Delete the post from MongoDB
            postRepository.deleteById(id);
        }
    }

    public Post updatePost(String id, String description, List<MultipartFile> mediaFiles, PostType type,
            List<String> tags) throws IOException {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (description != null) {
            post.setDescription(description);
        }

        if (type != null) {
            post.setType(type);
        }

        if (tags != null) {
            post.setTags(tags);
        }

        if (mediaFiles != null && !mediaFiles.isEmpty()) {
            if (mediaFiles.size() > 3) {
                throw new IllegalArgumentException("Maximum 3 media items allowed");
            }

            // 🔥 Delete old media from Supabase
            if (post.getMedia() != null) {
                for (Post.Media media : post.getMedia()) {
                    mediaStorageService.deleteMediaFromSupabase(media.getPublicId());
                }
            }

            // 🚀 Upload new media
            List<Post.Media> mediaList = mediaStorageService.uploadMedia(mediaFiles);
            post.setMedia(mediaList);
        }

        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

}
