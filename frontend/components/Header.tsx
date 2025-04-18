"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { SidebarTrigger } from "./Sidebar";

export default function Header({
    isDialogOpen,
    setIsDialogOpen,
    newDesc,
    setNewDesc,
    newTask,
    setNewTask,
    addTask,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (val: boolean) => void;
    newDesc: string;
    setNewDesc: (val: string) => void;
    newTask: string;
    setNewTask: (val: string) => void;
    addTask: () => void;
}) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="w-full pl-8"
                />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="hidden md:flex">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Create a new task to add to your list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input
                                id="task-title"
                                placeholder="Enter task title"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="task-desc">Description</Label>
                            <Input
                                id="task-desc"
                                placeholder="Enter description"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={addTask}>Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button
                size="icon"
                className="md:hidden"
                onClick={() => setIsDialogOpen(true)}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </header>
    );
}
