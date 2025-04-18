"use client";

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
import { Pencil } from "lucide-react";
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

    const handleUpdate = () => {
        fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
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
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleUpdate}>Kaydet</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
