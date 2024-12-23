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
            <div className="h-full flex items-center justify-center ">
                <div className="border border-[#213555] p-5 rounded-lg shadow-md w-[400px]">
                    <h2 className="text-4xl font-medium text-center">21N44-21</h2>

                    <label className="block font-bold mb-2 text-lg">
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </label>

                    <label className="block font-bold mb-2 text-lg">
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </label>

                    <br />
                    <button
                        onClick={() => handleLogin()}
                        className="w-full p-3 border hover:bg-slate-300 transition-all duration-150 rounded"
                    >
                        <b>Login</b>
                    </button>
                    {error && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>}
                </div>
            </div>
        </>
    );
}

