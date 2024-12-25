import { useState } from "react";

export default function AddTaskSection({ project, users, projects, setProjects }) {
    const [taskName, setTaskName] = useState("");
    const [assignedTaskUser, setAssignedTaskUser] = useState("");

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


    return <div className="flex gap-x-3">
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
    </div>;
}