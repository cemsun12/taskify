export interface Task {
    id: string;
    title: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    parent_id?: string | null;
    subtasks?: Task[];
}
