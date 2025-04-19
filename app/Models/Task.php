<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'is_completed','project_id', 'parent_id'];
    public $timestamps = true;

    public function subtasks()
    {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function project()
{
    return $this->belongsTo(Project::class);
}



    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }
}
