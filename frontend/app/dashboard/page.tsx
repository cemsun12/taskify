"use client";

import { useState } from "react";
import useTasks from "@/hooks/useTasks";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";

export default function DashboardPage() {
    const { tasks, addTask, deleteTask, updateTask, toggleTaskStatus } =
        useTasks();

    const [newTask, setNewTask] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAdd = () => {
        if (newTask.trim()) {
            addTask(newTask, newDesc, () => {
                setNewTask("");
                setNewDesc("");
                setIsDialogOpen(false);
            });
        }
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
                    addTask={handleAdd}
                    newDesc={newDesc}
                    setNewDesc={setNewDesc}
                />

                <main className="flex-1 p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={() => toggleTaskStatus(task.id)}
                                onDelete={() => deleteTask(task.id)}
                                onUpdate={updateTask}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
