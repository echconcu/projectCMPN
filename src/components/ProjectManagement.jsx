import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProjectDialog from "./ProjectDialog";
import AssignUserDialog from "./AssignUserDialog";
import AddTaskSection from "./AddTaskSection";

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
    const [accordionOpen, setAccordionOpen] = useState({});
    const [user, setUser] = useState(null);
    
    const fetchProjects = useCallback(() => {
        fetch("http://localhost:3000/projects")
            .then((res) => res.json())
            .then(setProjects);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            window.location.href = "/login";
        }
    }, []);

    // Fetch projects and users
    useEffect(() => {
        fetchProjects();

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

    const tasksNum = useMemo(() => {
        return projects.reduce((acc, project) => acc + project.tasks.length, 0);
    }, [projects]);
    return (
        <div>
            <Header />

            <div className="p-5">
                <section>
                    <p style={{ backgroundColor: "#213555", color: "#F5EFE7", height: "32px", justifyContent: "center", padding: "10px" }}>Projects</p>
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
                                            const currentUser = users.find((u) => u.id === userId);
                                            return currentUser ? (
                                                <li key={currentUser.id}>
                                                    {`${currentUser.username} - ${((project.tasks.filter((task) => task.assignee === userId)?.length/tasksNum)*100).toFixed(2)}%`}{" "}
                                                    {user.role === "admin" && <button
                                                        onClick={() => removeUserFromProject(project.id, user.id)}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Remove
                                                    </button>}
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                    <button onClick={() => toggleAccordion(project.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        {accordionOpen[project.id] ? "Hide Tasks" : "Show Tasks"}
                                    </button>
                                    {accordionOpen[project.id] && (
                                        <div style={{ marginLeft: "20px", marginTop: '10px' }}>
                                            <p>Tasks:</p>
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
                                            <AddTaskSection project={project} projects={projects} setProjects={setProjects} users={users} key={`${project.id}-add-task`} />
                                        </div>
                                    )}
                                    {user?.role === "admin" && <>
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
                                        </button></>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {user?.role === "admin" && (<div className="flex gap-x-2">
                    <ProjectDialog projects={projects} setProjects={setProjects} fetchProjects={fetchProjects} />
                    <AssignUserDialog projects={projects} users={users} setProjects={setProjects} />
                </div>
                )}
            </div>
        </div>
    );
}