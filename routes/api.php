<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectController;

Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);
