import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await registerApi(email, password);
            if (res.success && res.data) {
                setAuth(res.data.user, res.data.token);
                navigate("/");
            } else {
                setError(res.message || "Registration failed");
            }
        } catch {
            setError("Registration error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <div>{error}</div>}
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
                <div>
                    <label style={{ display: "block", marginBottom: 5 }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email..."
                    />
                </div>
                <div>
                    <label>Password (min 8 chars):</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password..."
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Create Account"}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}
