import React, { useEffect, useState } from "react";

// Component Header
function Header() {
    return (
        <header style={{ backgroundColor: '#333', padding: '10px', color: 'white' }}>
            <h1 style={{ margin: 0 }}>Project Management</h1>
        </header>
    );
}

// Component Footer
function Footer() {
    return (
        <footer style={{ backgroundColor: '#333', padding: '10px', color: 'white', textAlign: 'center' }}>
            <p>&copy; 2024 Project Management System</p>
        </footer>
    );
}

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [taskName, setTaskName] = useState("");
    const [assignedTaskUser, setAssignedTaskUser] = useState("");
    const [accordionOpen, setAccordionOpen] = useState({});

    // Fetch projects and users
    useEffect(() => {
        fetch("http://localhost:3000/projects")
            .then((res) => res.json())
            .then(setProjects);

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then(setUsers);
    }, []);

    // Add new project
    function addProject() {
        const newProject = { name, completed: false, assignedUsers: [], tasks: [] };
        fetch("http://localhost:3000/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
        }).then(() => {
            setProjects((prev) => [...prev, newProject]); // Add project to local state
        });
    }

    // Delete project
    function deleteProject(projectId) {
        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "DELETE",
        }).then(() => {
            setProjects((prev) => prev.filter((project) => project.id !== projectId)); // Remove from local state
        });
    }

    // Assign user to project
    function assignUserToProject() {
        const project = projects.find((p) => p.id === selectedProject);
        if (project) {
            const updatedUsers = [...new Set([...project.assignedUsers, selectedUser])];

            fetch(`http://localhost:3000/projects/${selectedProject}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedUsers: updatedUsers }),
            }).then(() => {
                setProjects((prev) =>
                    prev.map((p) =>
                        p.id === selectedProject ? { ...p, assignedUsers: updatedUsers } : p
                    )
                );
            });
        }
    }

    // Remove user from project
    function removeUserFromProject(projectId, userId) {
        const project = projects.find((p) => p.id === projectId);
        const updatedUsers = project.assignedUsers.filter((id) => id !== userId);

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignedUsers: updatedUsers }),
        }).then(() => {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, assignedUsers: updatedUsers } : p
                )
            );
        });
    }

    // Add task to project
    function addTask(projectId) {
        const project = projects.find((p) => p.id === projectId);
        const newTask = { id: Date.now(), name: taskName, assignee: assignedTaskUser, completed: false };
        const updatedTasks = [...project.tasks, newTask];

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: updatedTasks }),
        }).then(() => {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, tasks: updatedTasks } : p
                )
            );
            setTaskName("");
            setAssignedTaskUser("");
        });
    }

    // Toggle task completion
    function toggleTaskCompletion(projectId, taskId) {
        const project = projects.find((p) => p.id === projectId);
        const updatedTasks = project.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: updatedTasks }),
        }).then(() => {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, tasks: updatedTasks } : p
                )
            );
        });
    }

    // Remove task from project
    function removeTask(projectId, taskId) {
        const project = projects.find((p) => p.id === projectId);
        const updatedTasks = project.tasks.filter((task) => task.id !== taskId);

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: updatedTasks }),
        }).then(() => {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, tasks: updatedTasks } : p
                )
            );
        });
    }

    // Toggle accordion
    function toggleAccordion(projectId) {
        setAccordionOpen((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Header />

            <main style={{ padding: '20px' }}>
                <section>
                    <h2 style={{backgroundColor:"#213555", color:"#F5EFE7", height:"32px", justifyContent:"center", padding:"10px"}}>Projects</h2>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {projects.map((project) => (
                            <li key={project.id} style={{ marginBottom: '20px' }}>
                                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    <strong>{project.name}</strong> -{" "}
                                    {project.completed ? "Done" : "In Progress"}
                                    <br />
                                    <strong>Assigned Users:</strong>
                                    <ul>
                                        {project.assignedUsers.map((userId) => {
                                            const user = users.find((u) => u.id === userId);
                                            return user ? (
                                                <li key={user.id}>
                                                    {user.username}{" "}
                                                    <button
                                                        onClick={() => removeUserFromProject(project.id, user.id)}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                    <button onClick={() => toggleAccordion(project.id)} style={{ marginTop: '10px' }}>
                                        {accordionOpen[project.id] ? "Hide Tasks" : "Show Tasks"}
                                    </button>
                                    {accordionOpen[project.id] && (
                                        <div style={{ marginLeft: "20px", marginTop: '10px' }}>
                                            <h4>Tasks:</h4>
                                            <ul>
                                                {project.tasks.map((task) => (
                                                    <li key={task.id} style={{ marginBottom: '10px' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed}
                                                            onChange={() => toggleTaskCompletion(project.id, task.id)}
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                        {task.name} -{" "}
                                                        {task.assignee &&
                                                            users.find((user) => user.id === task.assignee)?.username}
                                                        <button
                                                            onClick={() => removeTask(project.id, task.id)}
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <input
                                                type="text"
                                                placeholder="Task Name"
                                                value={taskName}
                                                onChange={(e) => setTaskName(e.target.value)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <select
                                                onChange={(e) => setAssignedTaskUser(e.target.value)}
                                                value={assignedTaskUser}
                                            >
                                                <option value="">Assign User</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.username}
                                                    </option>
                                                ))}
                                            </select>
                                            <button onClick={() => addTask(project.id)} style={{ marginLeft: '10px' }}>
                                                Add Task
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section style={{ marginTop: '40px' }}>
                    <h2>Add Project</h2>
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={addProject}>Add</button>
                </section>

                <section style={{ marginTop: '40px' }}>
                    <h2>Assign User to Project</h2>
                    <select
                        onChange={(e) => setSelectedProject(e.target.value)}
                        value={selectedProject}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>

                    <select
                        onChange={(e) => setSelectedUser(e.target.value)}
                        value={selectedUser}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>

                    <button onClick={assignUserToProject}>Assign User</button>
                </section>
            </main>
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
        </div>
    );
}
