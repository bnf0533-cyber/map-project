import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await loginApi(email, password);
            if (res.success && res.data) {
                setAuth(res.data.user, res.data.token);
                navigate("/");
            } else {
                setError(res.message || "Login failed");
            }
        } catch {
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "60px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>
            {error && (
                <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: 10, borderRadius: 4, marginBottom: 15 }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <div>
                    <label style={{ display: "block", marginBottom: 5 }}>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                        placeholder="user@example.com"
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: 5 }}>Password:</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: 10, backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 15 }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}
