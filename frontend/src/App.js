import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskList from './TaskList';
import MenuBar from './MenuBar';
import CreateTaskModal from './CreateTaskModal';
import Calendar from './Calendar';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [recurringTasks, setRecurringTasks] = useState([]); // State to hold recurring tasks

  useEffect(() => {
    const fetchTasks = async () => {
      const [tasksResponse, recurringResponse] = await Promise.all([
        fetch(`${backendUrl}/api/tasks/with-end-date`),
        fetch(`${backendUrl}/api/tasks/repeating`)
      ]);
      const tasksData = await tasksResponse.json();
      const recurringData = await recurringResponse.json();

      setTasks(tasksData);
      setRecurringTasks(recurringData);
    };
    fetchTasks();
  }, [refreshTasks]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskCreationSuccess = () => {
    setRefreshTasks(!refreshTasks);
    closeModal();
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="App">
      <MenuBar />
      <Routes>
        <Route path="/" element={<TaskList refreshTasks={refreshTasks} setRefreshTasks={setRefreshTasks} deleteMode={deleteMode} />} />
        <Route path="/calendar" element={<Calendar tasks={tasks} recurringTasks={recurringTasks} />} />
      </Routes>
      <button className="create-task-button fancy-button" onClick={openModal}>
        Create Task
      </button>
      <button className="delete-task-button fancy-button" onClick={toggleDeleteMode}>
        {deleteMode ? 'Cancel Delete' : 'Delete Tasks'}
      </button>
      <CreateTaskModal isOpen={isModalOpen} onClose={closeModal} onSuccess={handleTaskCreationSuccess} />
    </div>
  );
}

export default App;
