"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';

type Task = {
  title: string;
  description: string;
  dueDate?: string;
  priority: string;
  status: string;
};

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState("Loading...");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      setMessage(data.message || "");
    } catch (error) {
      setMessage("Error fetching tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredTasks = tasks.filter(task => {
    const search = searchTerm.toLowerCase();
    return (
      (task.title.toLowerCase().includes(search) ||
        (task.description?.toLowerCase().includes(search) ?? false)) &&
      (filter.status ? task.status === filter.status : true) &&
      (filter.priority ? task.priority === filter.priority : true)
    );
  });

  return (
    <div>
      <h1>Task Management Dashboard</h1>
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <>
          <div>{message}</div>

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ margin: "10px 0", padding: "5px" }}
          />

          <select name="status" onChange={handleFilterChange} style={{ marginRight: "10px" }}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select name="priority" onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div style={{ marginTop: "20px" }}>
            {filteredTasks.length === 0 ? (
              <div>No tasks found.</div>
            ) : (
              filteredTasks.map((task, index) => (
                <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                  <p><strong>Due Date:</strong> {task.dueDate}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskManagement;