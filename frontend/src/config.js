// Check if we're in a browser environment and if import.meta.env exists
const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}

// Provide default values for API endpoints
export const API_BASE_URL = env.VITE_API_BASE_URL || "http://localhost:8080"
export const WS_BASE_URL = env.VITE_WS_BASE_URL || "ws://localhost:8080/ws"
