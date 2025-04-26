import React from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    const cardItems = [
        {
            title: "View All Posts",
            icon: "🗂️",
            path: "/all-posts"
        },
        {
            title: "Create My Post",
            icon: "✍️",
            path: "/create-post"
        },
        {
            title: "View My Posts",
            icon: "📄",
            path: "/my-posts"
        }
    ];

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(90deg, #F7931E 0%, #002B5B 100%)",
            minHeight: "100vh",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff"
        }}>
            {/* Title and Logo */}
            <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px"
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginRight: "10px"
                }}>
                    Welcome to <span style={{ color: "#FFD580" }}>Skill Hive</span>
                </h1>

                <img src="/images/logo.png" alt="Logo"

                    style={{
                        width: "40px",
                        height: "auto"
                    }}
                />
            </div>

            <p style={{
                fontSize: "1.2rem",
                opacity: 0.9,
                marginBottom: "2.5rem"
            }}>
                Explore. Learn. Share. <br />A community built to grow your skills together.
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1.5rem",
                maxWidth: "900px",
                width: "100%"
            }}>
                {cardItems.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: "#fff",
                            color: "#002B5B",
                            padding: "1.5rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            textAlign: "center",
                            transition: "transform 0.2s ease-in-out",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(item.path)}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{item.title}</h3>
                        <p style={{ fontSize: "0.875rem", color: "rgba(0, 43, 91, 0.6)" }}>Click to explore</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;


