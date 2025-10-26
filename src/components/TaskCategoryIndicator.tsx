import React from 'react';

type TaskCategoryProps = {
  category: 'red' | 'blue' | 'green' | 'purple' | 'orange';
};

const TaskCategoryIndicator: React.FC<TaskCategoryProps> = ({ category }) => {
  return (
    <div className={`w-6 h-6 rounded task-category-${category}`}></div>
  );
};

export default TaskCategoryIndicator;