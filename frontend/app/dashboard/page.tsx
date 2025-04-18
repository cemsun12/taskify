"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 🔁 Laravel'den görevleri al
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/tasks")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((task: any) => ({
                    ...task,
                    id: String(task.id),
                }));
                setTasks(formatted);
            })

            .catch((err) => console.error("Görevler alınamadı:", err));
    }, []);

    const addTask = () => {
        if (newTask.trim()) {
            fetch("http://127.0.0.1:8000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newTask,
                    description: newDesc,
                    is_completed: false,
                }),
            })
                .then((res) => res.json())
                .then((resJson) => {
                    const newTask = resJson.data;
                    setTasks((prev) => [...prev, newTask]);
                    setNewTask("");
                    setNewDesc("");
                    setIsDialogOpen(false);

                    toast.success("🎉 Görev başarıyla eklendi!");
                })
                .catch((err) => {
                    toast.error("Görev eklenemedi 😢");
                    console.error("Görev oluşturulamadı:", err);
                });
        }
    };

    const toggleTaskStatus = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...task, is_completed: !task.completed }),
        })
            .then((res) => res.json())
            .then((updatedTask) => {
                setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
            });
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    addTask={addTask}
                    newDesc={newDesc}
                    setNewDesc={setNewDesc}
                />

                <main className="flex-1 p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks
                            .filter((task) => !!task.id)
                            .map((task) => (
                                <TaskCard
                                    key={String(task.id)}
                                    task={task}
                                    onToggle={() => toggleTaskStatus(task.id)}
                                />
                            ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
