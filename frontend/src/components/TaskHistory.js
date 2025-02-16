import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TaskHistory = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalEarnings: 0,
    totalSpent: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  useEffect(() => {
    fetchTaskHistory();
  }, [filters]);

  const fetchTaskHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(filters);

      const response = await axios.get(
        `http://localhost:5000/api/task-history?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setStatistics(response.data.statistics);
    } catch (error) {
      setError('Error fetching task history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset page when filters change
    }));
  };

  return (
    <div className="task-history-container">
      <div className="statistics-cards">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>₹{statistics.totalEarnings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p>₹{statistics.totalSpent}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>{statistics.completedTasks}</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>View As</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="all">All Tasks</option>
            <option value="poster">Posted Tasks</option>
            <option value="solver">Solved Tasks</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Date</option>
            <option value="budget">Budget</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order</label>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="task-details">
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span>Budget: ₹{task.budget}</span>
                    <span>Type: {task.type}</span>
                    <span>Department: {task.department}</span>
                  </div>
                  
                  <div className="task-users">
                    <div className="user-info">
                      <img
                        src={task.postedBy.avatar || '/default-avatar.png'}
                        alt="Poster"
                      />
                      <span>Posted by: {task.postedBy.name}</span>
                    </div>
                    {task.assignedTo && (
                      <div className="user-info">
                        <img
                          src={task.assignedTo.avatar || '/default-avatar.png'}
                          alt="Solver"
                        />
                        <span>Solved by: {task.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="task-footer">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.completedAt && (
                    <span>
                      Completed: {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.pages}
            </span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.currentPage === pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskHistory; 