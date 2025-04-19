import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Task } from "@/types";

export default function EditTaskDialog({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (updatedTask: Task) => void;
}) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [open, setOpen] = useState(false);

    // ✅ Alt görevler için state
    const [subtasks, setSubtasks] = useState<string[]>(
        task.subtasks?.map((s) => s.title) || []
    );
    const [newSubtask, setNewSubtask] = useState("");

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            const updated = [...subtasks, newSubtask.trim()];
            setSubtasks(updated);
            setNewSubtask("");
        }
    };

    const handleUpdate = () => {
        fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                subtasks, // ✅ alt görevleri de gönder
                is_completed: task.is_completed,
            }),
        })
            .then((res) => res.json())
            .then((resJson) => {
                const updated = {
                    ...resJson.data,
                    id: String(resJson.data.id),
                    is_completed: !!resJson.data.is_completed,
                    created_at: resJson.data.created_at,
                };
                onUpdate(updated);
                setOpen(false);
            })
            .catch(() => alert("Güncelleme başarısız oldu"));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Görevi Düzenle</DialogTitle>
                    <DialogDescription>
                        Görevin başlığını ve açıklamasını değiştir.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setDescription(e.target.value)
                        }
                    />

                    <div className="space-y-2">
                        <p className="text-sm font-semibold">Alt Görevler</p>

                        {/* Alt görev ekleme */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Alt görev ekle"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddSubtask();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    if (newSubtask.trim()) {
                                        setSubtasks([...subtasks, newSubtask]);
                                        setNewSubtask("");
                                    }
                                }}
                            >
                                Ekle
                            </Button>
                        </div>

                        {/* Alt görev listesi */}
                        <ul className="list-disc ml-4 space-y-1 text-sm text-muted-foreground">
                            {subtasks.map((sub, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    {sub}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubtasks(
                                                subtasks.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleUpdate}>Kaydet</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
