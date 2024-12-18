import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            window.location.href = "/login";
        }
    }, []);

    function logout() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <>
        <header style={{ backgroundColor: "#213555", padding: "0.1px",height:"200px", textAlign: "center" , top:"0"}}>
        <h1 style={{ color: "#F5EFE7", fontSize:"50px" }}>Welcome, {user?.username}</h1>
        <h2 style={{color: "#F5EFE7", fontSize:"30px"}}>Dự án: Ứng dụng quản lý công việc cho cá nhân, doanh nghiệp nhỏ. </h2>
        </header>
        <div>
            
            <button onClick={logout} style={{height:"40px", width:"100px",fontSize:"20px"}}>Logout</button>
            <ul>
                <li>
                    <a href="/users" style={{height:"40px",padding:"5px",fontSize:"25px", backgroundColor:"#213555", color:"#F5EFE7"}}>User Management</a>
                </li>
                <br></br>
                <li>
                    <a href="/projects" style={{height:"40px",padding:"5px",fontSize:"25px", backgroundColor:"#213555", color:"#F5EFE7"}}>Project Management</a>
                </li>
            </ul>
        </div>
        <div style={{ textAlign: "center" }}>
  <h3 style={{ color: "#213555", fontSize: "40px" }}>Tỷ lệ đóng góp</h3>
  <h4
    style={{
      backgroundColor: "#3E5879",
      color: "#F5EFE7",
      fontSize: "25px",
      width: "400px",
      margin: "10px auto",
      textAlign: "center",
    }}
  >
    Huỳnh Bảo Hân - 55%
  </h4>
  <h5
    style={{
      backgroundColor: "#3E5879",
      color: "#F5EFE7",
      fontSize: "25px",
      width: "350px",
      margin: "10px auto",
      textAlign: "center",
    }}
  >
    Đoàn Đình Cao - 45%
  </h5>
</div>
        <footer style={{
            backgroundColor: "#213555",
            color: "#F5EFE7",
            
            padding: "10px 0",
            position: "absolute",
            bottom: "0",
            width: "100%",
        }}>
            <h style={{textAlign:"left", padding:"10px"}}>
                Huỳnh Bảo Hân - 106210046 - 21KTMT</h><br></br>
                <h style={{textAlign:"left", padding:"10px"}}>   
                Đoàn Đình Cao - 106210229 - 21KTMT2
            </h>
            <p style={{
                margin: "0",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
            }}>
                &copy; {new Date().getFullYear()} Da Nang University of Science and Technology.
            </p>
        </footer>
        </>
    );
}
