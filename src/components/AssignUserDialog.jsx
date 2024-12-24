import React, { useState } from "react";
import Dialog from "./Dialog";

const AssignUserDialog = ({ projects, users, setProjects }) => {
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [open, setOpen] = useState(false);

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

    return <>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setOpen(true) }}>Assign User</button>
        <Dialog isOpen={open} onClose={() => { setOpen(false) }}>
            <section>
                <h2>Assign User to Project</h2>
                <label className="flex flex-col gap-y-1">
                    Select Project:
                    <select
                        onChange={(e) => setSelectedProject(e.target.value)}
                        value={selectedProject}
                        className="border p-2"
                    >
                        <option value="">Select Project</option>
                        {projects.map((project, index) => (
                            <option key={`${project.id}-${index}`} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-y-1">
                    Select User:
                    <select
                        onChange={(e) => setSelectedUser(e.target.value)}
                        value={selectedUser}
                        className="border p-2"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </label>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={assignUserToProject}>Assign User</button>
            </section>
        </Dialog>
    </>;
}

export default AssignUserDialog;