import useProjects from "@/hooks/useProjects";
import { FolderKanban } from "lucide-react";
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

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
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
        <aside
            className={`${
                isMobile
                    ? "w-full max-h-[70vh] overflow-y-auto"
                    : "w-64 h-screen"
            } border-r bg-white dark:bg-zinc-900 flex flex-col justify-between`}
        >
            <div>
                <div className="px-6 py-4 border-b">
                    <h1 className="text-md font-bold flex items-center gap-2">
                        Projelerim
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
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
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
