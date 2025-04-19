// hooks/useTasks.ts

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Task } from "@/types";
import { useSearchParams } from "next/navigation";

export default function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project");

    useEffect(() => {
        if (!projectId) return;

        fetch(`http://127.0.0.1:8000/api/tasks?project_id=${projectId}`)
            .then((res) => res.json())
            .then((data) => setTasks(data.data));
    }, [projectId]);

    {
        /*useEffect(() => {
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
    }, []);*/
    }

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
                projectId,
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

    const refetchTasks = () => {
        if (!projectId) return;

        fetch(`http://127.0.0.1:8000/api/tasks?project_id=${projectId}`)
            .then((res) => res.json())
            .then((data) => {
                setTasks(data.data);
                console.log("🔄 Görevler yeniden çekildi:", data.data.length);
            });
    };

    const updateTask = (updatedTask: Task) => {
        fetch(`http://127.0.0.1:8000/api/tasks/${updatedTask.id}`)
            .then((res) => res.json())
            .then((resJson) => {
                const refreshed = resJson.data;

                const newTask: Task = {
                    ...refreshed,
                    id: String(refreshed.id),
                    is_completed: !!refreshed.is_completed,
                    subtasks: (refreshed.subtasks || []).map((s: any) => ({
                        id: String(s.id),
                        title: s.title,
                        is_completed: !!s.is_completed,
                    })),
                };

                setTasks((prevTasks) => {
                    const others = prevTasks.filter((t) => t.id !== newTask.id);
                    const updatedList = [...others, newTask];
                    console.log(
                        "🧠 setTasks → yeni görev sayısı:",
                        updatedList.length
                    );
                    return updatedList;
                });

                toast.success("✅ Görev güncellendi!");
            })
            .catch((err) => {
                toast.error("❌ Güncelleme başarısız oldu");
                console.error("updateTask error:", err);
            });
    };

    {
        /*const updateTask = (updatedTask: Task) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) => {
                if (task.id === updatedTask.id) {
                    const updated = {
                        ...updatedTask,
                        title: updatedTask.title + " ", // 👈 Zorla değişim için boşluk ekliyoruz (SİLİNEBİLİR)
                        subtasks: updatedTask.subtasks?.map((s) => ({
                            ...s,
                            title: s.title + "", // 👈 Her subtask’a da referans kırıcı etki
                        })),
                    };

                    console.log("🛠️ updateTask çalıştı:", updated.title);
                    return updated;
                }
                return task;
            });

            return [...updatedTasks]; // diziyi de zorla değiştiriyoruz
        });
    };*/
    }

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
