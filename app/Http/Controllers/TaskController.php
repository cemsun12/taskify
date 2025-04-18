<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return Task::all(); // Tüm görevleri getir

        return response()->json([
            'status' => 'success',
            'data' => $tasks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
        ]);

        $task = Task::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Görev Başarıyla Oluşturuldu!',
            'data' => $task
        ], 201);;
    }

    public function show(Task $task)
    {
        return response()->json([
            'status' => 'success',
            'data' => $task
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string|nullable',
            'is_completed' => 'sometimes|boolean',
        ]);

        $task->update($request->all());

        /*return response()->json([
            'status' => 'success',
            'message' => 'Task updated successfully',
            'data' => $task
        ]);;*/

        return response()->json([
            'status' => 'success',
            'message' => 'Task updated successfully',
            'data' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'is_completed' => $task->is_completed,
                'created_at' => $task->created_at,
            ]
        ]);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Görev Başarıyla Silindi!'
        ], 204); // No Content
    }
}
