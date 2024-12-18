import React, { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  function addUser() {
    const newUser = { username, password: "password", role: "user" };
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }).then(() => window.location.reload());
  }

  function deleteUser(id) {
    fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" }).then(() =>
      window.location.reload()
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", color: "#213555", marginBottom: "20px" }}>User Management</h1>

      <section>
        <h2 style={{ backgroundColor: "#213555", color: "#F5EFE7", padding: "10px", borderRadius: "5px" }}>Users</h2>
        <ul style={{ listStyleType: "none", padding: "0", marginTop: "15px" }}>
          {users.map((user) => (
            <li key={user.id} style={{ backgroundColor: "#f0f0f0", margin: "10px 0", padding: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{user.username}</strong> <span style={{ color: "#666" }}>({user.role})</span>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#FF5C58",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 style={{ marginBottom: "15px", color: "#213555" }}>Add User</h2>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          />
        </div>
        <button
          onClick={addUser}
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
          Add User
        </button>
      </section>
      
    </div>
  );
}
