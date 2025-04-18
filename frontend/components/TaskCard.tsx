import { CalendarDays } from "lucide-react";
import { Trash2 } from "lucide-react";
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
import { Task } from "../types";
import { format } from "date-fns";
import { calculateProgress } from "@/utils/progress";
import { Progress } from "@/components/ui/progress";

export default function TaskCard({
    task,
    onToggle,
    onDelete,
    onUpdate,
}: {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
    onUpdate: (updatedTask: Task) => void;
}) {
    const progress = calculateProgress(task);

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
                if (resJson.data) {
                    // ✅ Güncel alt görevleri oluştur
                    const updatedSubtasks = task.subtasks?.map((s) =>
                        s.id === subtaskId
                            ? { ...s, is_completed: newCompleted }
                            : s
                    );

                    // ✅ Tüm alt görevler tamamlandı mı kontrol et
                    const allCompleted =
                        updatedSubtasks?.every((s) => s.is_completed) ?? false;

                    // ✅ Ana görevi de backend'de güncelle
                    if (allCompleted !== task.is_completed) {
                        fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                is_completed: allCompleted,
                            }),
                        });
                    }

                    // ✅ Kartı güncelle
                    onUpdate({
                        ...task,
                        is_completed: allCompleted,
                        subtasks: updatedSubtasks,
                    });
                }
            });
    };

    const handleToggleMainTask = () => {
        const newMainStatus = !task.is_completed;

        // ✅ Ana görev güncelle
        fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_completed: newMainStatus }),
        });

        // ✅ Alt görevleri de güncelle (isteğe bağlı)
        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((sub) => {
                fetch(`http://127.0.0.1:8000/api/tasks/${sub.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_completed: newMainStatus }),
                });
            });
        }

        // ✅ Frontend güncelle
        onUpdate({
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
                        {task.created_at && !isNaN(Date.parse(task.created_at))
                            ? format(new Date(task.created_at), "MMM d, yyyy")
                            : "Geçersiz tarih"}
                    </CardDescription>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                </p>

                {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-3 space-y-1">
                        <p className="text-xs text-muted-foreground font-semibold">
                            Alt Görevler:
                        </p>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <Separator className="my-2" />

                {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground font-semibold">
                            Alt Görevler:
                        </p>
                        <ul className="space-y-1">
                            {task.subtasks.map((sub) => (
                                <li
                                    key={sub.id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={sub.is_completed}
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
                                        {sub.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>

            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-4">
                    <div className="h-2 w-[95%] bg-muted rounded-full overflow-hidden mx-auto">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{
                                width: `${calculateProgress(task)}%`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                        {calculateProgress(task)}% tamamlandı (
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
                <EditTaskDialog task={task} onUpdate={onUpdate} />
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
