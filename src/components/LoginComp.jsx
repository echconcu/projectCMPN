import React, { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleLogin() {
        console.log('this shit ran');

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((users) => {
                const user = users.find(
                    (u) => u.username === username && u.password === password
                );

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "/dashboard";
                } else {
                    setError("Invalid credentials");
                }
            });
    }

    return (
        <>
            <header style={{ backgroundColor: "#213555", padding: "0.1px",height:"130px", textAlign: "center" , top:"0"}}>
                <h1 style={{ color: "#F5EFE7", fontSize:"50px" }}>Registration</h1>
            </header>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "700px",
            }}>
                <div style={{
                    backgroundColor:"#213555",
                    border: "1px solid #213555",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    width: "400px",
                }}>
                    <h2 style={{ textAlign: "center", color:"#F5EFE7" }}>Login</h2>
                    
                    <label style={{
                        display: "block",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: "#F5EFE7",
                        fontSize: "1.3rem",
                        paddingLeft:"20px"
                    }}>
                        Username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ height:"27px",marginBottom: "10px", width: "90%", paddingLeft: "10px" , fontSize:"20px" }}
                        />

                    <label style={{
                        display: "block",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: "#F5EFE7",
                        fontSize: "1.3rem",
                        paddingLeft:"20px",
                    }}>
                        Password: 
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ height:"27px",marginBottom: "10px", width: "90%", paddingLeft: "10px" , fontSize:"30px"}}
                        />
                    
                    <br />
                    <button
                        onClick={() => handleLogin()}
                        style={{
                            display: "block",
                            width: "30%",
                            padding: "10px",
                            backgroundColor: "#D8C4B6",
                            color: "#3E5879",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize:"20px",
                            height:"40px",
                        
                        }}
                    >
                        <b>Login</b>
                    </button>
                    {error && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>}
                </div>
            </div>
        </>
    );
}

