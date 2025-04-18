<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
{
    $tasks = Task::with('subtasks')->whereNull('parent_id')->get();

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
        'parent_id' => 'nullable|exists:tasks,id',
        'subtasks' => 'nullable|array',
        'subtasks.*' => 'required|string',
    ]);

    // Ana görev
    $task = Task::create([
        'title' => $request->title,
        'description' => $request->description,
        'is_completed' => $request->is_completed ?? false,
        'parent_id' => $request->parent_id, // null ise ana görevdir
    ]);

    // Alt görevler varsa
    if ($request->has('subtasks') && is_array($request->subtasks)) {
        foreach ($request->subtasks as $subtaskTitle) {
            Task::create([
                'title' => $subtaskTitle,
                'description' => '',
                'is_completed' => false,
                'parent_id' => $task->id, // ✅ İşte burası alt görev ilişkisi!
            ]);
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Görev başarıyla oluşturuldu!',
        'data' => $task->load('subtasks')
    ], 201);
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
        'subtasks' => 'nullable|array',
        'subtasks.*' => 'required|string',
    ]);

    $task->update($request->only(['title', 'description', 'is_completed']));

    // ✅ Alt görevleri güncelle (eskiyi sil, yenileri ekle)
    if ($request->has('subtasks') && is_array($request->subtasks)) {
        // Mevcut alt görevleri sil
        foreach ($task->subtasks as $subtask) {
            $subtask->delete();
        }

        // Yeni alt görevleri ekle
        foreach ($request->subtasks as $title) {
            Task::create([
                'title' => $title,
                'description' => '',
                'is_completed' => false,
                'parent_id' => $task->id,
            ]);
        }
    }

    // ✅ Güncellenmiş görevle birlikte alt görevleri döndür
    return response()->json([
        'status' => 'success',
        'message' => 'Task updated successfully',
        'data' => $task->load('subtasks'), // alt görevlerle birlikte
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
