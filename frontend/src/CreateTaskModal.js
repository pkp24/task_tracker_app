import React, { useState } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CreateTaskModal = ({ isOpen, onClose, onSuccess }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    const [frequency, setFrequency] = useState('none');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const taskData = {
            task_name: taskName,
            task_description: taskDescription,
            due_date_only: dueDate || null,  // Send due_date_only instead of due_date
            due_time_only: timeOfDay || null,  // Send due_time_only instead of time_of_day
            frequency: frequency,
        };

        const response = await fetch(`${backendUrl}/api/tasks/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            alert('Task created successfully!');
            onSuccess();  // Trigger any post-creation success actions (e.g., refreshing tasks)
            onClose();  // Close the modal
        } else {
            alert('Error creating task.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create New Task</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="task_name">Task Name:</label>
                    <input
                        type="text"
                        id="task_name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />

                    <label htmlFor="task_description">Task Description:</label>
                    <textarea
                        id="task_description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />

                    <label htmlFor="due_date">Due Date:</label>
                    <input
                        type="date"
                        id="due_date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />

                    <label htmlFor="time_of_day">Time of Day:</label>
                    <input
                        type="time"
                        id="time_of_day"
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                    />

                    <label htmlFor="frequency">Frequency:</label>
                    <select
                        id="frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                    >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option> {/* Fixed typo from "Monthly" to "Yearly" */}
                    </select>

                    <button type="submit" className="submit-button">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
