<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // 🔍 Tüm projeleri ve ilişkili görevleri getir
    public function index()
    {
        return Project::with('tasks')->get();
    }

    // ➕ Yeni proje oluştur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string',
        ]);

        return Project::create($validated);
    }

    // 📄 Belirli bir projeyi göster
    public function show($id)
    {
        return Project::with('tasks')->findOrFail($id);
    }

    // ✏️ Projeyi güncelle
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string',
        ]);

        $project->update($validated);

        return $project;
    }

    // ❌ Projeyi sil
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Proje silindi']);
    }
}
