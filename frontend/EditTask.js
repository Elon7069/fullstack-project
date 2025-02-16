import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    deadline: '',
    budget: '',
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const task = response.data;
      setFormData({
        ...task,
        deadline: new Date(task.deadline).toISOString().slice(0, 16)
      });
    } catch (error) {
      setError('Error fetching task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/tasks/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFormData(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting task');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-task-container">
      <h2>Edit Task</h2>
      
      <div className="status-controls">
        <h3>Current Status: {formData.status}</h3>
        <div className="status-buttons">
          <button
            onClick={() => handleStatusUpdate('open')}
            className={`status-btn ${formData.status === 'open' ? 'active' : ''}`}
          >
            Open
          </button>
          <button
            onClick={() => handleStatusUpdate('assigned')}
            className={`status-btn ${formData.status === 'assigned' ? 'active' : ''}`}
          >
            Assigned
          </button>
          <button
            onClick={() => handleStatusUpdate('completed')}
            className={`status-btn ${formData.status === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
            <option value="Research">Research</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget (₹)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? <div className="loading-spinner"></div> : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="delete-btn"
            onClick={handleDelete}
          >
            Delete Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;