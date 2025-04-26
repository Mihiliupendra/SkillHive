import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [description, setDescription] = useState('');
    const [type, setType] = useState('SKILL_SHARING');
    const [tags, setTags] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const userId = "user123";

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const allowedFiles = selectedFiles.slice(0, 3 - files.length); // limit to 3
        const newFiles = [...files, ...allowedFiles];

        if (newFiles.length > 3) {
            alert("You can only upload a maximum of 3 files.");
            return;
        }

        setFiles(newFiles);

        const newPreviews = allowedFiles.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image') ? 'image' : 'video',
            name: file.name
        }));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('type', type);

            if (tags) {
                tags.split(',').forEach(tag => {
                    if (tag.trim()) formData.append('tags', tag.trim());
                });
            }

            files.forEach(file => {
                formData.append('media', file);
            });

            const response = await axios.post(
                'http://localhost:8080/api/posts',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-User-ID': userId
                    }
                }
            );

            console.log('Response:', response.data);
            navigate('/all-posts');
        } catch (err) {
            console.error('Error details:', err.response?.data || err.message);
            alert(`Error: ${err.response?.data?.message || 'Failed to create post'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(to right, #fdfcfb, #e2d1c3)",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            padding: "2rem"
        }}>
            <form onSubmit={handleSubmit} style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "600px"
            }}>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    fontSize: "1.8rem",
                    color: "#002B5B"
                }}>
                    Create New Post
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        placeholder="What's on your mind?"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                            resize: "vertical"
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                        Post Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc"
                        }}
                    >
                        <option value="SKILL_SHARING">Skill Sharing</option>
                        <option value="LEARNING_PROGRESS">Learning Progress</option>
                        <option value="LEARNING_PLAN">Learning Plan</option>
                    </select>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. programming, design, marketing"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem" }}>
                        Media Upload (Max 3 files)
                    </label>
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            border: "2px dashed #ccc",
                            borderRadius: "0.5rem",
                            padding: "1.5rem",
                            textAlign: "center",
                            background: "#fafafa",
                            cursor: "pointer",
                            marginBottom: "1rem"
                        }}
                    >
                        <p style={{ color: "#888", margin: 0 }}>
                            Click to upload images or videos
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                        gap: "1rem"
                    }}>
                        {previews.map((preview, index) => (
                            <div key={index} style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}>
                                {preview.type === 'image' ? (
                                    <img
                                        src={preview.url}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={preview.url}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    style={{
                                        position: "absolute",
                                        top: "4px",
                                        right: "4px",
                                        backgroundColor: "#ff4d4d",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        background: "linear-gradient(90deg, #F7931E 60%, #FFB347 100%)",
                        color: "#fff",
                        padding: "0.85rem 1.7rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        width: "100%",
                        transition: "opacity 0.3s",
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? "Uploading..." : "Create Post"}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
