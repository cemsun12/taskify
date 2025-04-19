"use client";

import { useState } from "react";
import useTasks from "@/hooks/useTasks";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useProjects from "@/hooks/useProjects";

export default function DashboardPage() {
    const { tasks, addTask, deleteTask, updateTask, toggleTaskStatus } =
        useTasks();

    const [newTask, setNewTask] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const incompleteTasks = tasks.filter((task) => !task.is_completed);
    const completeTasks = tasks.filter((task) => task.is_completed);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { projects } = useProjects();

    const projectId = searchParams.get("project");

    useEffect(() => {
        if (!projectId && projects.length > 0) {
            router.replace(`/dashboard?project=${projects[0].id}`);
        }
    }, [projectId, projects]);

    if (!projectId && projects.length === 0) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold">
                        Henüz projeniz yok
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Lütfen bir proje oluşturarak başlayın.
                    </p>
                </div>
            </div>
        );
    }

    // ✅ Alt görevleri Header kendi içinde yönetecek, burada tanımlamaya gerek yok.

    // ✅ Görev eklendikten sonra liste güncelleme işlemleri burada yapılabilir
    /*const handleAdd = () => {
        // Bu fonksiyon artık kullanılmıyor çünkü Header içinden fetch yapılıyor.
    };*/

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>
            <div className="flex flex-1 flex-col">
                <Header
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    newDesc={newDesc}
                    setNewDesc={setNewDesc}
                    onTaskCreated={() => {
                        // istersen sayfayı yenileyebilirsin veya burada görevleri yeniden çekebilirsin
                        window.location.reload();
                    }}
                />
                <main className="flex-1 p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {incompleteTasks.length > 0 && (
                            <div className="col-span-full mt-4">
                                <h4 className="text-sm font-semibold text-muted-foreground">
                                    Devam Eden Görevler
                                </h4>
                            </div>
                        )}
                        {incompleteTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                taskId={task.id}
                                onToggle={() => toggleTaskStatus(task.id)}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))}

                        {/* Başlık: Tamamlanan Görevler */}
                        {completeTasks.length > 0 && (
                            <div className="col-span-full mt-4">
                                <h4 className="text-sm font-semibold text-muted-foreground">
                                    Tamamlanan Görevler
                                </h4>
                            </div>
                        )}

                        {/* Tamamlanan Görevler */}
                        {completeTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                taskId={task.id}
                                onToggle={() => toggleTaskStatus(task.id)}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
