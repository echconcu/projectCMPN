import React from "react";
import Dialog from "./Dialog";

const ProjectDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");

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

    return <>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setOpen(true) }}>Add Project</button>
        <Dialog isOpen={open} onClose={() => { setOpen(false) }}>
            <div>
                <h2>Add Project</h2>
                <label className="flex flex-col gap-y-1">
                    Project Name:
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </label>
                <button className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addProject}>Add</button>
            </div>
        </Dialog>
    </>;
}

export default ProjectDialog;