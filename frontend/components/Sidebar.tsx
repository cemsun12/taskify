import useProjects from "@/hooks/useProjects";
import { Folder } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function Sidebar() {
    const { projects, addProject } = useProjects();
    const [newProjectName, setNewProjectName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddProject = async () => {
        if (!newProjectName.trim()) return;
        await addProject(newProjectName);
        setNewProjectName("");
    };

    const router = useRouter();

    return (
        <aside className="w-64 h-screen border-r bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <div>
                {/* Sidebar başlığı */}
                <div className="px-6 py-4">
                    <h2 className="text-md font-bold text-primary">
                        Projelerim
                    </h2>
                </div>

                {/* Proje Listesi */}
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

                {/* Yeni Proje Oluştur */}
                <div className="p-4 border-t flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Yeni Proje
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni Proje Oluştur</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    value={newProjectName}
                                    onChange={(e) =>
                                        setNewProjectName(e.target.value)
                                    }
                                    placeholder="Proje adı"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddProject();
                                            setIsDialogOpen(false);
                                        }
                                    }}
                                />
                                <Button
                                    onClick={() => {
                                        handleAddProject();
                                        setIsDialogOpen(false);
                                    }}
                                >
                                    Oluştur
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </aside>
    );
}
