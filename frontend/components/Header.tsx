"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FolderKanban } from "lucide-react";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

import NavigationLinks from "@/components/NavigationLinks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

export default function Header({
    isDialogOpen,
    setIsDialogOpen,
    newDesc,
    setNewDesc,
    newTask,
    setNewTask,
    onTaskCreated,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (val: boolean) => void;
    newDesc: string;
    setNewDesc: (val: string) => void;
    newTask: string;
    setNewTask: (val: string) => void;
    onTaskCreated?: () => void;
}) {
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [newSubtask, setNewSubtask] = useState("");

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            const updated = [...subtasks, newSubtask.trim()];
            setSubtasks(updated);
            setNewSubtask("");
        }
    };

    const searchParams = useSearchParams();
    const projectIdParam = searchParams?.get("project");
    const projectId = projectIdParam ? Number(projectIdParam) : null;
    const [openMobileProjects, setOpenMobileProjects] = useState(false);

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
            {/* Mobilde Projelerim + Menü */}
            <div className="flex md:hidden items-center gap-2">
                {/* Projelerim */}

                <Dialog
                    open={openMobileProjects}
                    onOpenChange={setOpenMobileProjects}
                >
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Projelerim">
                            <FolderKanban className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Projelerim</DialogTitle>
                        </DialogHeader>
                        {/* ✨ Buraya önemli değişiklik */}
                        <Sidebar
                            onProjectSelect={() => setOpenMobileProjects(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Menü */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Menü">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <NavigationLinks />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold">Taskify</span>
            </div>

            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="w-full pl-8"
                />
            </div>

            <div className="hidden md:flex gap-4">
                <NavigationLinks /> {/* Geniş ekran için linkler */}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="hidden md:flex">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Create a new task to add to your list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input
                                id="task-title"
                                placeholder="Enter task title"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="task-desc">Description</Label>
                            <Input
                                id="task-desc"
                                placeholder="Enter description"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 mt-4">
                            <h4 className="text-sm font-semibold">
                                Alt Görevler
                            </h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Alt görev ekle"
                                    value={newSubtask}
                                    onChange={(e) =>
                                        setNewSubtask(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddSubtask();
                                        }
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        if (newSubtask.trim()) {
                                            const updated = [
                                                ...subtasks,
                                                newSubtask,
                                            ];
                                            console.log(
                                                "🧪 Yeni subtasks:",
                                                updated
                                            ); // ✅ bunu ekle
                                            setSubtasks(updated);
                                            setNewSubtask("");
                                        }
                                    }}
                                >
                                    Ekle
                                </Button>
                            </div>

                            <ul className="list-disc ml-4 text-sm text-muted-foreground">
                                {subtasks.map((sub, index) => (
                                    <li key={index}>{sub}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (!newTask.trim()) return;

                                console.log(
                                    "🔍 GÖNDERİLEN project_id:",
                                    projectId
                                );

                                fetch("http://127.0.0.1:8000/api/tasks", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        title: newTask,
                                        description: newDesc,
                                        is_completed: false,
                                        subtasks,
                                        project_id: Number(projectId),
                                    }),
                                })
                                    .then((res) => res.json())
                                    .then((resJson) => {
                                        console.log(
                                            "🎯 Görev oluşturuldu:",
                                            resJson
                                        );
                                        setNewTask("");
                                        setNewDesc("");
                                        setSubtasks([]);
                                        setIsDialogOpen(false);
                                        if (onTaskCreated) onTaskCreated(); // opsiyonel tetikleme
                                    })
                                    .catch(() => alert("Görev oluşturulamadı"));
                            }}
                        >
                            Görev Oluştur
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button
                size="icon"
                className="md:hidden"
                onClick={() => setIsDialogOpen(true)}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </header>
    );

    function MobileMenu() {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="block md:hidden p-2 text-muted-foreground hover:text-foreground">
                        <Menu className="w-5 h-5" />
                    </button>
                </DialogTrigger>
                <DialogContent className="p-6 space-y-4">
                    <NavigationLinks />
                </DialogContent>
            </Dialog>
        );
    }
}
