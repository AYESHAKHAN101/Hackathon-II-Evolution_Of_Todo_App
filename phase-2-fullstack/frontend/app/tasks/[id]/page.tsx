'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, Task } from '@/lib/api';
import { AuthUtils } from '@/lib/auth';
import TaskForm from '@/components/ui/TaskForm';

const EditTaskPage: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!AuthUtils.isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTask();
  }, [id, router]);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const taskId = Number(id);
      if (isNaN(taskId)) {
        setError('Invalid task ID');
        return;
      }

      const response = await apiClient.getTask(userId, taskId);

      if (response.error) {
        setError(response.error.message);
      } else if (response.data) {
        setTask(response.data);
      } else {
        setError('Task not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData: Partial<Task>) => {
    try {
      const userId = AuthUtils.getUserId();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiClient.updateTask(userId, Number(id), taskData);

      if (response.error) {
        setError(response.error.message);
      } else {
        // Redirect to tasks list
        router.push('/tasks');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  if (!AuthUtils.isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-red-800">Error</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-red-600">{error}</p>
              <div className="mt-4">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Task Not Found</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-600">The requested task could not be found.</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/tasks')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back to Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <TaskForm task={task} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;