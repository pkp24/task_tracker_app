import React, { useState, useEffect } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const TaskList = ({ refreshTasks, setRefreshTasks, deleteMode }) => {
  const [tasksWithoutEndDate, setTasksWithoutEndDate] = useState([]);
  const [tasksWithEndDate, setTasksWithEndDate] = useState([]);
  const [activeRepeatingTasks, setActiveRepeatingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false); // Toggle for showing completed tasks
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [withoutEndDateResponse, withEndDateResponse, repeatingResponse, completedResponse] = await Promise.all([
          fetch(`${backendUrl}/api/tasks/without-end-date`),
          fetch(`${backendUrl}/api/tasks/with-end-date`),
          fetch(`${backendUrl}/api/tasks/repeating`),
          fetch(`${backendUrl}/api/tasks/completed`), // Fetch completed tasks
        ]);

        if (!withoutEndDateResponse.ok || !withEndDateResponse.ok || !repeatingResponse.ok || !completedResponse.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const withoutEndDateData = await withoutEndDateResponse.json();
        const withEndDateData = await withEndDateResponse.json();
        const repeatingData = await repeatingResponse.json();
        const completedData = await completedResponse.json();

        setTasksWithoutEndDate(withoutEndDateData);
        setTasksWithEndDate(withEndDateData);
        setActiveRepeatingTasks(repeatingData);
        setCompletedTasks(completedData); // Set completed tasks
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTasks();
  }, [refreshTasks]); // Re-fetch when refreshTasks changes

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      const response = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
         alert('Task deleted successfully!');
         setRefreshTasks((prev) => !prev);  // Use setRefreshTasks passed from App.js
       } else {
         alert('Error deleting task.');
     }
    }
  };

  const completeTask = async (taskId) => {
    const response = await fetch(`${backendUrl}/api/tasks/mark-complete/${taskId}`, {
      method: 'POST',
    });
    if (response.ok) {
      alert('Task marked as complete!');
      setRefreshTasks((prev) => !prev);  // Use setRefreshTasks passed from App.js
    } else {
      alert('Error completing task.');
    }
  };

  const renderDeleteButton = (taskId) => {
    return deleteMode ? (
      <button className="delete-task-x" onClick={() => deleteTask(taskId)}>
        ❌
      </button>
    ) : null;
  };

  const renderCompleteButton = (taskId) => {
    return (
      <button className="complete-task-check" onClick={() => completeTask(taskId)}>
        ✔️
      </button>
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No specific time';

    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;  // Convert to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    // Convert UTC to local time
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return localTime.toLocaleString('en-US', options);
  };

  const daysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <h1>Task Tracker</h1>

      {error && <p>Error: {error}</p>}

      <h2>Tasks without End Date</h2>
      <ul>
        {tasksWithoutEndDate.map((task) => (
          <li key={task.task_id}>
            {renderDeleteButton(task.task_id)}
            {renderCompleteButton(task.task_id)}
            {task.task_name} - {task.task_description}
          </li>
        ))}
      </ul>

      <h2>Tasks with End Date</h2>
      <ul>
        {tasksWithEndDate.map((task) => (
          <li key={task.task_id}>
            {renderDeleteButton(task.task_id)}
            {renderCompleteButton(task.task_id)}
            {task.task_name} - {task.task_description} - Due in {daysUntilDue(task.due_date_only)} days {task.due_time_only ? `at ${formatTime(task.due_time_only)}` : ''}
          </li>
        ))}
      </ul>

      <h2>Active Repeating Tasks</h2>
      <ul>
        {activeRepeatingTasks.map((task) => (
          <li key={task.repeat_id}>
            {renderDeleteButton(task.task_id)}
            {renderCompleteButton(task.task_id)}
            {task.task_name} - {task.task_description} - Repeats {task.frequency} every {task.interval}
            {task.day_of_week ? ` on ${task.day_of_week}` : ''}
            {task.day_of_month ? ` on the ${task.day_of_month} of each month` : ''} {task.time_of_day ? `at ${formatTime(task.time_of_day)}` : ''}
          </li>
        ))}
      </ul>

      <button className="fancy-button" onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? 'Hide Completed Tasks' : 'View Completed Tasks'}
      </button>

      {showCompleted && (
        <>
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((task) => (
              <li key={task.completion_id}>
                {task.task_name} - {task.task_description} - Completed on {formatDateTime(task.completion_date)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TaskList;
