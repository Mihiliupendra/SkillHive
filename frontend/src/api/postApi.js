import axios from "axios";

const API_URL = "http://localhost:8080/api/posts"; // Change this to your backend URL

// Create Post
export const createPost = async (postData) => {
    try {
        const response = await axios.post(API_URL, postData, {
            headers: {
                "Content-Type": "multipart/form-data", // Required if sending files
                "X-User-ID": "user-id-value", // Pass the user ID header if needed
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

// Get all Posts
// api.js
export const getAllPosts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/posts');
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

// Get a specific post by ID
export const getPost = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

// Update Post
export const updatePost = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

// Delete Post
export const deletePost = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};


