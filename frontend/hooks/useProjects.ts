import { useEffect, useState } from "react";

export interface Project {
    id: number;
    name: string;
    color?: string;
    created_at: string;
}

export default function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = () => {
        fetch("http://127.0.0.1:8000/api/projects")
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            });
    };

    const addProject = (name: string, color?: string) => {
        return fetch("http://127.0.0.1:8000/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, color }),
        })
            .then((res) => res.json())
            .then((newProject) => {
                setProjects((prev) => [...prev, newProject]);
                return newProject;
            });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return { projects, loading, addProject };
}
