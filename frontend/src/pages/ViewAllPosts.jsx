import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadedMedia, setLoadedMedia] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/posts");
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMediaLoad = (url) => {
        setLoadedMedia(prev => ({ ...prev, [url]: true }));
    };

    const handleMediaError = (e, url) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/600x400?text=Media+Not+Available";
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${postId}`);
                setPosts(prev => prev.filter(post => post._id !== postId));
            } catch (err) {
                alert("Error deleting post: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleEdit = (postId) => {
        alert(`Edit post: ${postId}`);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={styles.errorText}>Error: {error}</p>
                <button style={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>
                Explore the Best Moments
                <br />
                <span style={styles.subtitle}>All Your Favorite Posts in One Place!</span>
            </h2>

            <div style={styles.postsContainer}>
                {posts.length === 0 ? (
                    <p style={styles.noPosts}>No posts yet. Come back later!</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} style={styles.postCard}>
                            {/* User Name Tab */}
                            <div style={styles.userTab}>
                                <span style={styles.userName}>user123</span>
                            </div>

                            <div style={styles.postContent}>
                                <p style={styles.postDescription}>{post.description}</p>
                            </div>

                            {post.media?.length > 0 && (
                                <div
                                    style={{
                                        ...styles.mediaGrid,
                                        gridTemplateColumns: getGridColumns(post.media.length),
                                    }}
                                >
                                    {post.media.map((file, index) => (
                                        <div key={index} style={styles.mediaContainer}>
                                            {!loadedMedia[file.url] && (
                                                <div style={styles.mediaPlaceholder}>Loading...</div>
                                            )}

                                            {file.type.toLowerCase() === "image" ? (
                                                <img
                                                    src={`${file.url}?t=${new Date().getTime()}`}
                                                    alt={file.name || "Post image"}
                                                    style={{
                                                        ...styles.media,
                                                        display: loadedMedia[file.url] ? "block" : "none",
                                                    }}
                                                    onLoad={() => handleMediaLoad(file.url)}
                                                    onError={(e) => handleMediaError(e, file.url)}
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    src={`${file.url}?t=${new Date().getTime()}`}
                                                    style={styles.media}
                                                    onError={(e) => {
                                                        e.target.poster = "https://placehold.co/600x400?text=Video+Not+Available";
                                                    }}
                                                />
                                            )}

                                            <div style={styles.mediaInfo}>{file.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={styles.buttonRow}>
                                <button style={styles.editButton} onClick={() => handleEdit(post.id)}>Edit</button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(post.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const getGridColumns = (count) => {
    if (count === 1) return "1fr";
    if (count === 2) return "1fr 1fr";
    return "1fr 1fr 1fr";
};

const styles = {
    container: {
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(to right, #fdfcfb, #e2d1c3)",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    loadingContainer: {
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(to right, #fdfcfb, #e2d1c3)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(to right, #fdfcfb, #e2d1c3)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    errorText: {
        color: "#ff4d4f",
    },
    retryButton: {
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        background: "#F7931E",
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        cursor: "pointer",
    },
    title: {
        fontSize: "1.6rem",
        marginBottom: "2rem",
        color: "#002B5B",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: "0.5px",
    },
    subtitle: {
        fontStyle: "italic",
        color: "#555",
        fontSize: "1rem",
    },
    postsContainer: {
        width: "100%",
        maxWidth: "820px",
    },
    noPosts: {
        color: "#777",
        fontStyle: "italic",
    },
    postCard: {
        background: "#fff",
        borderRadius: "1rem",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        padding: "2rem 1.5rem 1.5rem 1.5rem",
        marginBottom: "2rem",
        position: "relative",
    },
    userTab: {
        background: "#002B5B",
        color: "white",
        padding: "0.4rem 1rem",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        display: "inline-block",
        fontWeight: "bold",
        fontSize: "0.9rem",
    },
    userName: {
        color: "#fff",
    },
    postContent: {
        backgroundColor: "#f9f9f9",
        padding: "1.5rem",
        borderRadius: "0.8rem",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "1.5rem",
    },
    postDescription: {
        fontSize: "0.85rem",
        color: "#222",
        fontWeight: "normal",
        lineHeight: 1.6,
        letterSpacing: "0.1px",
    },
    mediaGrid: {
        display: "grid",
        gap: "1rem",
        marginBottom: "0.2rem",
    },
    mediaContainer: {
        borderRadius: "0.7rem",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "180px",
    },
    mediaPlaceholder: {
        width: "100%",
        height: "180px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f3f3",
    },
    media: {
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderBottom: "1px solid #eee",
        background: "#f3f3f3",
    },
    mediaInfo: {
        padding: "0.5rem 0.7rem",
        fontSize: "0.92rem",
        color: "#555",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    buttonRow: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.7rem",
        marginTop: "1rem",
    },
    editButton: {
        backgroundColor: "#17A2B8",
        color: "white",
        border: "none",
        padding: "0.4rem 1.2rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        fontSize: "1rem",
    },
    deleteButton: {
        backgroundColor: "#DC3545",
        color: "white",
        border: "none",
        padding: "0.4rem 1.2rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        fontSize: "1rem",
    },
};

export default ViewAllPosts;
