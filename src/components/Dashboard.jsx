import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/projects")
            .then((res) => res.json())
            .then(setProjects);

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then(setUsers);
    }, []);

    return (
        <div className="flex flex-col h-full flex-1">
            <div className="bg-[#213555] py-5 text-center flex-col flex justify-center items-center">
                <h1 className="text-[#F5EFE7] text-5xl font-bold">Welcome, {user?.username}</h1>
                <h2 className="text-[#F5EFE7] text-3xl">Dự án: Ứng dụng quản lý công việc cho cá nhân, doanh nghiệp nhỏ. </h2>
            </div>
            <div className="text-center flex flex-col items-center justify-center flex-1">
                <h2 className="text-4xl font-bold text-[#213555]">Project Management</h2>
                <div className="flex gap-x-1">
                    <p className="text-2xl font-bold text-[#213555]">Projects: {projects.length}</p>
                </div>
            </div>
        </div>
    );
}

