import React, { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle Registration
    const handleRegister = () => {
        if (!username || !password) {
            setError("Username and Password are required!");
            return;
        }

        // Create a new user object
        const newUser = {
            id: Date.now(),
            username,
            password,
            role,
        };

        // Send the user data to json-server
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        })
            .then((res) => {
                if (res.ok) {
                    setSuccess("Registration successful!");
                    setError("");
                    setUsername("");
                    setPassword("");
                    setRole("user");
                } else {
                    setError("Failed to register user.");
                }
            })
            .catch(() => setError("Error connecting to the server."));
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <h2 style={{ textAlign: "center", color: "#213555", marginBottom: "20px" }}>Register</h2>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#333" }}>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#333" }}>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#333" }}>Role:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button
                onClick={handleRegister}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#213555",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                Register
            </button>
            
        </div>
    );
}
