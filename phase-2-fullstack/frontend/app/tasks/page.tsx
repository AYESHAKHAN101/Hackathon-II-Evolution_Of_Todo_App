'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, Task } from '@/lib/api';
import { AuthUtils } from '@/lib/auth';
import Link from 'next/link';
import { FaPlus, FaFilter, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import DraggableTaskList from '@/components/ui/DraggableTaskList';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'position' | 'created_at' | 'updated_at'>('position');

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!AuthUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTasks();

    // Setup session timeout
    AuthUtils.setupSessionTimeout(30); // 30 minutes
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiClient.getUserTasks(userId,
        filter === 'completed' ? { completed: true } :
        filter === 'active' ? { completed: false } : undefined
      );

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        // Sort tasks based on selected sort option
        let sortedTasks = [...response.data.data];

        switch (sortBy) {
          case 'position':
            sortedTasks.sort((a, b) => a.position - b.position);
            break;
          case 'created_at':
            sortedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'updated_at':
            sortedTasks.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            break;
        }

        setTasks(sortedTasks);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiClient.toggleTaskCompletion(userId, task.id);

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        // Update the task in the local state
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, ...response.data } : t
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiClient.deleteTask(userId, taskId);

      if (response.error) {
        setError(response.error.message);
      } else {
        // Remove the task from the local state
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  // Function to reorder tasks after drag and drop
  const handleReorderTasks = async (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);

    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Update positions on the server by updating each task individually
      const updatePromises = reorderedTasks.map(async (task, index) => {
        // Only update if position changed
        if (task.position !== index + 1) {
          const response = await apiClient.updateTask(userId, task.id, {
            ...task,
            position: index + 1,
          });

          if (response.error) {
            console.error(`Error updating task ${task.id}:`, response.error.message);
            // Revert the local change if server update failed
            fetchTasks(); // Refetch to get correct state
          }
        }
      });

      await Promise.all(updatePromises);
    } catch (err: any) {
      setError(err.message || 'Failed to update task positions');
      // Revert to previous state if there was an error
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <Link
              href="/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <FaPlus className="mr-2" /> New Task
            </Link>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <label htmlFor="filter" className="mr-2 text-gray-700">Filter:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'position' | 'created_at' | 'updated_at')}
                className="border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="position">Position</option>
                <option value="created_at">Date Created</option>
                <option value="updated_at">Date Updated</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTimes className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? "Get started by creating a new task."
                  : `You have no ${filter} tasks.`}
              </p>
              <div className="mt-6">
                <Link
                  href="/tasks/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Create New Task
                </Link>
              </div>
            </div>
          ) : (
            <DraggableTaskList
              tasks={filteredTasks}
              onReorder={handleReorderTasks}
              onToggleCompletion={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          )}
        </div>
      </div>
  );
};

export default TasksPage;