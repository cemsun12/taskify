// hooks/useTasks.ts

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types";

export default function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/tasks")
            .then((res) => res.json())
            .then((resJson) => {
                const tasks = resJson.data; // 👈 sadece `data` içindeki diziye eriş
                const formatted = tasks.map((task: any) => ({
                    ...task,
                    id: String(task.id),
                    is_completed: !!task.is_completed,
                }));
                setTasks(formatted);
            })

            .catch((err) => console.error("Görevler alınamadı:", err));
    }, []);

    const addTask = (
        title: string,
        description: string,
        subtasks: string[],
        onSuccess?: () => void
    ) => {
        fetch("http://127.0.0.1:8000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                is_completed: false,
                subtasks,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                const newTask = resJson.data;
                setTasks((prev) => [...prev, newTask]);
                toast.success("🎉 Görev başarıyla eklendi!");
                onSuccess?.();
            })
            .catch((err) => {
                toast.error("Görev eklenemedi 😢");
                console.error("Görev oluşturulamadı:", err);
            });
    };

    const deleteTask = (id: string) => {
        fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    setTasks((prev) => prev.filter((task) => task.id !== id));
                    toast.success("🗑️ Görev silindi!");
                } else {
                    throw new Error("Silinemedi");
                }
            })
            .catch((err) => {
                toast.error("Görev silinirken hata oluştu 😢");
                console.error("Silme hatası:", err);
            });
    };

    const updateTask = (updatedTask: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    const toggleTaskStatus = (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...task, is_completed: !task.is_completed }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                const updatedTaskRaw = resJson.data;
                const updatedTask: Task = {
                    ...updatedTaskRaw,
                    id: String(updatedTaskRaw.id),
                    is_completed: !!updatedTaskRaw.is_completed,
                    created_at: updatedTaskRaw.created_at,
                };

                setTasks((prev) =>
                    prev.map((t) => (t.id === id ? updatedTask : t))
                );
            })
            .catch((err) => {
                console.error("Görev güncellenemedi:", err);
            });
    };

    return {
        tasks,
        addTask,
        deleteTask,
        updateTask,
        toggleTaskStatus,
    };
}
