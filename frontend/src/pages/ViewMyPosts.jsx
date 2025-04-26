import React, { useEffect, useState } from "react";

const ViewMyPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetching data from your backend API that connects to MongoDB
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/posts"); // Replace with your actual API endpoint
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div
            style={{
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(to right, #fdfcfb, #e2d1c3)",
                minHeight: "100vh",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h2
                style={{
                    fontSize: "1.6rem", // Smaller font size for the title
                    marginBottom: "2rem",
                    color: "#002B5B",
                    fontWeight: "bold",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                }}
            >
                Explore the Best Moments
                <br />
                <span style={{ fontStyle: "italic", color: "#555", fontSize: "1rem" }}>
                    All Your Favorite Posts in One Place!
                </span>
            </h2>

            <div style={{ width: "100%", maxWidth: "820px" }}>
                {posts.length === 0 ? (
                    <p style={{ color: "#777", fontStyle: "italic" }}>
                        No posts yet. Come back later!
                    </p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post._id} // MongoDB usually returns _id instead of id
                            style={{
                                background: "#fff",
                                borderRadius: "1rem",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                                padding: "2rem 1.5rem 1.5rem 1.5rem",
                                marginBottom: "2rem",
                                transition: "box-shadow 0.2s",
                                position: "relative",
                            }}
                        >
                            {/* Description wrapped in a box */}
                            <div
                                style={{
                                    backgroundColor: "#f9f9f9", // Light background for the description box
                                    padding: "1.5rem",
                                    borderRadius: "0.8rem",
                                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "0.85rem", // Smaller font size for the description
                                        marginBottom: "1.2rem",
                                        color: "#222",
                                        fontWeight: "normal", // Non-bold
                                        lineHeight: 1.6,
                                        letterSpacing: "0.1px",
                                    }}
                                >
                                    {post.description} {/* Dynamic description from MongoDB */}
                                </p>
                            </div>

                            {/* Media Files in Responsive Grid */}
                            {post.media && post.media.length > 0 && (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            post.media.length === 1
                                                ? "1fr"
                                                : post.media.length === 2
                                                    ? "1fr 1fr"
                                                    : "1fr 1fr 1fr",
                                        gap: "1rem",
                                        marginBottom: "0.2rem",
                                    }}
                                >
                                    {post.media.map((file, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                borderRadius: "0.7rem",
                                                overflow: "hidden",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                                                background: "#fafafa",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                minHeight: "180px",
                                            }}
                                        >
                                            {file.type === "image" ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "180px",
                                                        objectFit: "cover",
                                                        borderBottom: "1px solid #eee",
                                                        background: "#f3f3f3",
                                                    }}
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    src={file.url}
                                                    style={{
                                                        width: "100%",
                                                        height: "180px",
                                                        objectFit: "cover",
                                                        borderBottom: "1px solid #eee",
                                                        background: "#f3f3f3",
                                                    }}
                                                />
                                            )}
                                            <div
                                                style={{
                                                    padding: "0.5rem 0.7rem",
                                                    fontSize: "0.92rem",
                                                    color: "#555",
                                                    textAlign: "center",
                                                    backgroundColor: "#f5f5f5",
                                                    width: "100%",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                                title={file.name}
                                            >
                                                {file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Responsive styles */}
            <style>
                {`
                @media (max-width: 700px) {
                    .post-media-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ViewMyPosts;
