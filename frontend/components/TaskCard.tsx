import { CalendarDays } from "lucide-react";
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
}: {
    task: Task;
    onToggle: () => void;
}) {
    return (
        <Card
            className={task.completed ? "border-green-200 bg-green-50/50" : ""}
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
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                    <Switch
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={onToggle}
                    />
                    <Label htmlFor={`task-${task.id}`}>
                        {task.completed ? "Completed" : "Not completed"}
                    </Label>
                </div>
            </CardFooter>
        </Card>
    );
}
