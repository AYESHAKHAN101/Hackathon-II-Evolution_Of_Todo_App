'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task } from '@/lib/api';
import TaskCard from './TaskCard';

interface DraggableTaskItemProps {
  task: Task;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggleCompletion: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const ItemTypes = {
  TASK: 'task',
};

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
  task,
  index,
  onMove,
  onToggleCompletion,
  onDelete,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={isDragging ? 'opacity-50' : 'opacity-100'}
      style={{ cursor: 'move' }}
    >
      <TaskCard task={task} onToggleCompletion={onToggleCompletion} onDelete={onDelete} />
    </div>
  );
};

interface DraggableTaskListProps {
  tasks: Task[];
  onReorder: (tasks: Task[]) => void;
  onToggleCompletion: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const DraggableTaskList: React.FC<DraggableTaskListProps> = ({
  tasks,
  onReorder,
  onToggleCompletion,
  onDelete,
}) => {
  const moveTask = (fromIndex: number, toIndex: number) => {
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);

    // Update positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index + 1,
    }));

    onReorder(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, index) => (
          <DraggableTaskItem
            key={task.id}
            task={task}
            index={index}
            onMove={moveTask}
            onToggleCompletion={onToggleCompletion}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DraggableTaskList;