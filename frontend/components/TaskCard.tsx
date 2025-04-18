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
    return (
        <Card
            className={
                task.is_completed ? "border-green-200 bg-green-50/50" : ""
            }
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="flex items-center">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {task.created_at && !isNaN(Date.parse(task.created_at))
                        ? format(new Date(task.created_at), "MMM d, yyyy")
                        : "Geçersiz tarih"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground">
                    {task.description}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Switch
                        id={`task-${task.id}`}
                        checked={task.is_completed}
                        onCheckedChange={onToggle}
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
