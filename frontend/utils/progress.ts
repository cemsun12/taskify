import { Task } from "@/types";

export function calculateProgress(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0)
        return task.is_completed ? 100 : 0;

    const completed = task.subtasks.filter((t) => t.is_completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
}
