import React, { useEffect, useState } from "react";
import ProjectDialog from "./ProjectDialog";
import AssignUserDialog from "./AssignUserDialog";

// Component Header
function Header() {
    return (
        <header style={{ backgroundColor: '#333', padding: '10px', color: 'white' }}>
            <h1 style={{ margin: 0 }}>Project Management</h1>
        </header>
    );
}


export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
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

    // Delete project
    function deleteProject(projectId) {
        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "DELETE",
        }).then(() => {
            setProjects((prev) => prev.filter((project) => project.id !== projectId)); // Remove from local state
        });
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

    // Mark project as completed
    function markProjectAsCompleted(projectId) {
        const project = projects.find((p) => p.id === projectId);
        const updatedProject = { ...project, completed: !project.completed };

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProject),
        }).then(() => {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? updatedProject : p
                )
            );
        });
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Header />

            <main style={{ padding: '20px' }}>
                <section>
                    <h2 style={{ backgroundColor: "#213555", color: "#F5EFE7", height: "32px", justifyContent: "center", padding: "10px" }}>Projects</h2>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        {projects.map((project) => (
                            <li key={project.id} style={{ marginBottom: '20px' }}>
                                <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    <strong>{project.name}</strong> -{" "}
                                    {project.completed ? "Done" : "In Progress"} -{" "}
                                    {`${Math.round((project.tasks.filter((task) => task.completed).length / project.tasks.length) * 100)}%`}
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
                                    <button onClick={() => toggleAccordion(project.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                        >
                                                            Delete
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex gap-x-3">
                                                <input
                                                    type="text"
                                                    placeholder="Task Name"
                                                    value={taskName}
                                                    onChange={(e) => setTaskName(e.target.value)}
                                                    className="p-2 border rounded"
                                                />
                                                <select
                                                    onChange={(e) => setAssignedTaskUser(e.target.value)}
                                                    value={assignedTaskUser}
                                                    className="p-2 border rounded"
                                                >
                                                    <option value="">Assign User</option>
                                                    {users.reduce((acc, user) => {
                                                        if (project.assignedUsers.includes(user.id)) {
                                                            acc.push(<option key={user.id} value={user.id}>{user.username}</option>);
                                                        }
                                                        return acc;
                                                    }, [])}
                                                </select>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => addTask(project.id)}>
                                                    Add Task
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                                        onClick={() => markProjectAsCompleted(project.id)}
                                    >
                                        Mark as {project.completed ? "Incomplete" : "Complete"}
                                    </button>
                                    <button
                                        className="mt-4 bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                        onClick={() => deleteProject(project.id)}
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <ProjectDialog />

                <AssignUserDialog projects={projects} users={users} setProjects={setProjects} />
            </main>
            <footer style={{
                backgroundColor: "#213555",
                color: "#F5EFE7",
                padding: "10px 0",
                position: "absolute",
                bottom: "0",
                width: "100%",
            }}>
                <h2 style={{ textAlign: "left", padding: "10px" }}>
                    Huỳnh Bảo Hân - 106210046 - 21KTMT</h2><br></br>
                <h2 style={{ textAlign: "left", padding: "10px" }}>
                    Đoàn Đình Cao - 106210229 - 21KTMT2
                </h2>
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