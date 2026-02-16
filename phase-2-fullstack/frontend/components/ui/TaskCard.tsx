import React from 'react';
import Link from 'next/link';
import { Task } from '@/lib/api';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleCompletion, onDelete }) => {
  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg ${
        task.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-lg leading-6 font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-2 text-base text-gray-500">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleCompletion(task)}
              className={`p-1 rounded-full ${
                task.completed
                  ? 'text-green-500 hover:bg-green-100'
                  : 'text-yellow-500 hover:bg-yellow-100'
              }`}
              title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <FaCheck />
            </button>
            <Link
              href={`/tasks/${task.id}`}
              className="p-1 rounded-full text-blue-500 hover:bg-blue-100"
              title="Edit task"
            >
              <FaEdit />
            </Link>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-full text-red-500 hover:bg-red-100"
              title="Delete task"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>Position: {task.position}</span>
          <span className="mx-2">•</span>
          <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;