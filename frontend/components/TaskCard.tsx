"use client";

import { CalendarDays, Trash2 } from "lucide-react";
import EditTaskDialog from "./EditTaskDialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { format } from "date-fns";
import { calculateProgress } from "@/utils/progress";
import { Progress } from "@/components/ui/progress";
import useTasks from "@/hooks/useTasks";

export default function TaskCard({
    taskId,
    onDelete,
    onToggle,
}: {
    taskId: string;
    onDelete: () => void;
    onToggle: () => void;
}) {
    const { tasks, updateTask } = useTasks();
    const task = tasks.find((t) => String(t.id) === String(taskId));

    {
        /*..*/
    }

    if (!task) return null;
    const progress = calculateProgress(task);
    {
        /*..*/
    }

    const handleToggleSubtask = (subtaskId: string) => {
        const subtask = task.subtasks?.find((s) => s.id === subtaskId);
        if (!subtask) return;

        const newCompleted = !subtask.is_completed;

        fetch(`http://127.0.0.1:8000/api/tasks/${subtaskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_completed: newCompleted }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                const updatedSubtasks = task.subtasks?.map((s) =>
                    s.id === subtaskId
                        ? { ...s, is_completed: newCompleted }
                        : s
                );
                const allCompleted =
                    updatedSubtasks?.every((s) => s.is_completed) ?? false;

                if (allCompleted !== task.is_completed) {
                    fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ is_completed: allCompleted }),
                    });
                }

                updateTask({
                    ...task,
                    is_completed: allCompleted,
                    subtasks: updatedSubtasks,
                });
            });
    };

    const handleToggleMainTask = () => {
        const newMainStatus = !task.is_completed;

        fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_completed: newMainStatus }),
        });

        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((sub) => {
                fetch(`http://127.0.0.1:8000/api/tasks/${sub.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_completed: newMainStatus }),
                });
            });
        }

        updateTask({
            ...task,
            is_completed: newMainStatus,
            subtasks: task.subtasks?.map((s) => ({
                ...s,
                is_completed: newMainStatus,
            })),
        });
    };

    return (
        <Card
            className={
                task.is_completed ? "border-green-200 bg-green-50/50" : ""
            }
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {format(new Date(task.created_at), "MMM d, yyyy")}
                    </CardDescription>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                </p>
            </CardHeader>

            <CardContent>
                <Separator className="my-2" />

                {/* Alt görev sayısı test logu */}
                <div className="text-xs text-blue-500 mt-2">
                    Alt görev sayısı (render test): {task.subtasks?.length ?? 0}
                </div>

                {/* Alt görevler varsa çiz */}
                {Array.isArray(task.subtasks) && task.subtasks.length > 0 ? (
                    <>
                        <p className="text-xs text-muted-foreground font-semibold mt-2">
                            Alt Görevler:
                        </p>
                        <ul className="space-y-1 mt-2">
                            {task.subtasks.map((sub, index) => (
                                <li
                                    key={sub.id || index}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!sub.is_completed}
                                        onChange={() =>
                                            handleToggleSubtask(sub.id)
                                        }
                                        className="w-4 h-4 accent-green-600"
                                    />
                                    <span
                                        className={
                                            sub.is_completed
                                                ? "line-through text-muted-foreground"
                                                : ""
                                        }
                                    >
                                        {sub.title || "[Başlıksız alt görev]"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-xs text-red-500 mt-2">
                        Alt görev bulunamadı veya boş.
                    </p>
                )}
            </CardContent>

            {/* İlerleme çubuğu */}
            {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
                <div className="mt-4">
                    <div className="h-2 w-[95%] bg-muted rounded-full overflow-hidden mx-auto">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                        {progress}% tamamlandı (
                        {task.subtasks.filter((s) => s.is_completed).length}/
                        {task.subtasks.length})
                    </p>
                </div>
            )}

            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Switch
                        id={`task-${task.id}`}
                        checked={task.is_completed}
                        onCheckedChange={handleToggleMainTask}
                    />
                    <Label htmlFor={`task-${task.id}`}>
                        {task.is_completed ? "Tamamlandı" : "Tamamlanmadı"}
                    </Label>
                </div>
                <EditTaskDialog task={task} />
                <button
                    onClick={onDelete}
                    className="flex items-center px-2 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    title="Görevi Sil"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Sil</span>
                </button>
            </CardFooter>
        </Card>
    );
}
