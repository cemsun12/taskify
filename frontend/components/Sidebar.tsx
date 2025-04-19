import useProjects from "@/hooks/useProjects";
import { Plus, Folder } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const { projects, addProject } = useProjects();
    const [newProjectName, setNewProjectName] = useState("");

    const handleAddProject = async () => {
        if (!newProjectName.trim()) return;
        await addProject(newProjectName);
        setNewProjectName("");
    };

    const router = useRouter();

    return (
        <aside className="w-64 h-screen border-r bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div>
                <div className="px-6 py-4 border-b">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Folder className="w-5 h-5 text-primary" />
                        Projeler
                    </h1>
                </div>

                <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[70vh]">
                    {projects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() =>
                                router.push(`/dashboard?project=${project.id}`)
                            }
                            className="text-left text-sm px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {project.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t flex gap-2">
                    <input
                        className="w-full text-sm px-2 py-1 rounded-md border"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Yeni proje"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddProject();
                        }}
                    />
                    <button
                        onClick={handleAddProject}
                        className="p-2 bg-primary text-white rounded-md"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
