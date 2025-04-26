import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [formData, setFormData] = useState({
        description: "",
        tags: [],
        type: "SKILL_SHARING"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
                setPost(response.data);
                setFormData({
                    description: response.data.description,
                    tags: response.data.tags || [],
                    type: response.data.type
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load post");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`http://localhost:8080/api/posts/${id}`, formData);
            navigate(`/all-posts`); // Navigate to all posts after successful update
            // Or navigate(`/posts/${id}`) to view the updated post
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update post");
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="edit-post-container">
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Post Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="SKILL_SHARING">Skill Sharing</option>
                        <option value="LEARNING_PROGRESS">Learning Progress</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags.join(",")}
                        onChange={(e) => {
                            const tagsArray = e.target.value.split(",").map(tag => tag.trim());
                            setFormData(prev => ({ ...prev, tags: tagsArray }));
                        }}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Post"}
                </button>

                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default EditPost;