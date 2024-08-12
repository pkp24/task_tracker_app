import React, { useState, useEffect } from 'react';
import './Calendar.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Calendar = ({ tasks, recurringTasks }) => {
  const [view, setView] = useState('month'); // Default to month view
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // This useEffect ensures recurring tasks are recalculated whenever the currentDate changes.
    calculateRecurringTasks();
  }, [currentDate]);

  const formatTime = (timeString) => {
    if (!timeString) return 'No specific time';

    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;  // Convert to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const calculateRecurringTasks = () => {
    // Calculate recurring tasks based on the current view's date range (month or week)
    recurringTasks.forEach(task => {
      if (task.frequency === 'weekly') {
        task.next_due_date = getNextWeeklyOccurrence(task);
      } else if (task.frequency === 'monthly') {
        task.next_due_date = getNextMonthlyOccurrence(task);
      }
    });
  };

  const getNextWeeklyOccurrence = (task) => {
    const currentDay = currentDate.getDay();
    const taskDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(task.day_of_week.toLowerCase());
    const daysToNextOccurrence = (taskDay - currentDay + 7) % 7;
    return new Date(currentDate.setDate(currentDate.getDate() + daysToNextOccurrence));
  };

  const getNextMonthlyOccurrence = (task) => {
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), task.day_of_month);
    if (nextMonthDate < currentDate) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, task.day_of_month);
    }
    return nextMonthDate;
  };

  const renderTasks = (day) => {
    const tasksForDay = tasks.filter(task => new Date(task.due_date_only).toDateString() === day.toDateString());
    const recurringTasksForDay = recurringTasks.filter(task => task.next_due_date && new Date(task.next_due_date).toDateString() === day.toDateString());

    return (
      <>
        {tasksForDay.map(task => (
          <div className="task non-recurring" key={task.task_id} onClick={() => alert(task.task_description)}>
            {task.task_name} {task.due_time_only ? `(${formatTime(task.due_time_only)})` : ''}
          </div>
        ))}
        {recurringTasksForDay.map(task => (
          <div className="task recurring" key={task.repeat_id} onClick={() => alert(task.task_description)}>
            {task.task_name} {task.time_of_day ? `(${formatTime(task.time_of_day)})` : ''}
          </div>
        ))}
      </>
    );
  };

  const renderMonthView = () => {
    const today = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay() === 0 ? 7 : startOfMonth.getDay();

    let days = [];
    for (let i = 1 - startDay; i <= endOfMonth.getDate(); i++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isCurrentDay = i === today.getDate() && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
      const isCurrentWeek = currentDay >= today && currentDay < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      days.push(
        <div
          key={i}
          className={`calendar-cell ${isCurrentDay ? 'current-day' : ''} ${isCurrentWeek ? 'current-week' : ''}`}
        >
          {i > 0 && i <= endOfMonth.getDate() ? (
            <>
              <div className="date">{i}</div>
              {renderTasks(currentDay)}
            </>
          ) : ''}
        </div>
      );
    }
    return <div className="calendar-grid month-view">{days}</div>;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));

    let days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(
        <div key={i} className="calendar-cell week-view">
          <div className="date">{currentDay.toDateString()}</div>
          {renderTasks(currentDay)}
        </div>
      );
    }
    return <div className="calendar-grid week-view">{days}</div>;
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
      </div>
      <div className="view-toggle">
        <button className="fancy-button" onClick={() => setView('month')}>Month View</button>
        <button className="fancy-button" onClick={() => setView('week')}>Week View</button>
      </div>
      <div className="navigation-buttons">
        <button className="fancy-button" onClick={handlePrevious}>Previous {view === 'month' ? 'Month' : 'Week'}</button>
        <button className="fancy-button" onClick={handleNext}>Next {view === 'month' ? 'Month' : 'Week'}</button>
      </div>
      {view === 'month' ? renderMonthView() : renderWeekView()}
    </div>
  );
};

export default Calendar;
