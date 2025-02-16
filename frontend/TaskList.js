import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Tasklist = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    department: '',
    minBudget: '',
    maxBudget: '',
    status: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5000/api/tasks?${queryString}`);
      setTasks(response.data);
    } catch (error) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="task-list-container">
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Assignment">Assignment</option>
            <option value="Project">Project</option>
            <option value="Research">Research</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={filters.department}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="minBudget"
            placeholder="Min Budget"
            value={filters.minBudget}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="maxBudget"
            placeholder="Max Budget"
            value={filters.maxBudget}
            onChange={handleFilterChange}
          />

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
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p className="task-description">{task.description}</p>
            <div className="task-details">
              <span>Type: {task.type}</span>
              <span>Budget: ₹{task.budget}</span>
              <span>Department: {task.department}</span>
              <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
              <span>Status: {task.status}</span>
            </div>
            <div className="task-footer">
              <span>Posted by: {task.postedBy.name}</span>
              {user && user.role === 'TaskSolver' && task.status === 'open' && (
                <button className="interest-btn">Express Interest</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Add this to your existing TaskList component's task card rendering

const TaskCard = ({ task }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const isOwner = user && task.postedBy._id === user.id;
  
    return (
      <div className="task-card">
        <h3>{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <div className="task-details">
          <span>Type: {task.type}</span>
          <span>Budget: ₹{task.budget}</span>
          <span>Department: {task.department}</span>
          <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
          <span className={`status ${task.status}`}>Status: {task.status}</span>
        </div>
        <div className="task-footer">
          <span>Posted by: {task.postedBy.name}</span>
          <div className="task-actions">
            {isOwner && (
              <>
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/tasks/${task._id}/edit`)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </>
            )}
            {user && user.role === 'TaskSolver' && task.status === 'open' && (
              <button className="interest-btn">Express Interest</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Task = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    type: '',
    department: '',
    minBudget: '',
    maxBudget: '',
    status: '',
    deadlineFrom: '',
    deadlineTo: ''
  });
  
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Available task types
  const taskTypes = ['Assignment', 'Project', 'Research', 'Other'];

  useEffect(() => {
    fetchTasks();
  }, [filters, sorting]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        ...sorting
      });

      const response = await axios.get(`http://localhost:5000/api/tasks?${queryParams}`);
      setTasks(response.data);
    } catch (error) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSorting(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      department: '',
      minBudget: '',
      maxBudget: '',
      status: '',
      deadlineFrom: '',
      deadlineTo: ''
    });
    setSorting({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="task-list-container">
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters & Sorting</h3>
          <button onClick={resetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>

        <div className="filters-grid">
          {/* Task Type Filter */}
          <div className="filter-group">
            <label>Task Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {taskTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="filter-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={filters.department}
              onChange={handleFilterChange}
            />
          </div>

          {/* Budget Range Filters */}
          <div className="filter-group">
            <label>Budget Range</label>
            <div className="range-inputs">
              <input
                type="number"
                name="minBudget"
                placeholder="Min ₹"
                value={filters.minBudget}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxBudget"
                placeholder="Max ₹"
                value={filters.maxBudget}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Deadline Range Filters */}
          <div className="filter-group">
            <label>Deadline Range</label>
            <div className="range-inputs">
              <input
                type="date"
                name="deadlineFrom"
                value={filters.deadlineFrom}
                onChange={handleFilterChange}
              />
              <input
                type="date"
                name="deadlineTo"
                value={filters.deadlineTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Status Filter */}
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

          {/* Sorting Controls */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              name="sortBy"
              value={sorting.sortBy}
              onChange={handleSortChange}
            >
              <option value="createdAt">Date Posted</option>
              <option value="deadline">Deadline</option>
              <option value="budget">Budget</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort Order</label>
            <select
              name="sortOrder"
              value={sorting.sortOrder}
              onChange={handleSortChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <div className="no-tasks">No tasks found matching your criteria</div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="task-card">
                <h3>{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-details">
                  <span className="task-type">Type: {task.type}</span>
                  <span className="task-budget">Budget: ₹{task.budget}</span>
                  <span className="task-department">Department: {task.department}</span>
                  <span className="task-deadline">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                  <span className={`task-status status-${task.status}`}>
                    Status: {task.status}
                  </span>
                </div>
                <div className="task-footer">
                  <span className="posted-by">Posted by: {task.postedBy.name}</span>
                  {user?.role === 'TaskSolver' && task.status === 'open' && (
                    <button className="interest-btn">Express Interest</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FilterPresets from './FilterPresets';
import axios from 'axios';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });

  // Filter and sort states
  const [filters, setFilters] = useState({
    type: '',
    department: '',
    minBudget: '',
    maxBudget: '',
    status: '',
    deadlineFrom: '',
    deadlineTo: '',
    difficulty: '',
    urgency: '',
    skills: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Available options for filters
  const filterOptions = {
    taskTypes: ['Assignment', 'Project', 'Research', 'Other'],
    difficulties: ['easy', 'medium', 'hard'],
    urgencyLevels: ['low', 'medium', 'high'],
    commonSkills: ['Programming', 'Writing', 'Research', 'Design', 'Analysis']
  };

  useEffect(() => {
    fetchTasks();
  }, [filters, pagination.currentPage, pagination.limit]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.limit
      });

      const response = await axios.get(`http://localhost:5000/api/tasks?${queryParams}`);
      setTasks(response.data.tasks);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.pages,
        total: response.data.pagination.total
      }));
    } catch (error) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handleSkillsChange = (selectedSkills) => {
    setFilters(prev => ({
      ...prev,
      skills: selectedSkills.join(',')
    }));
  };

  const handlePresetApply = (presetFilters) => {
    setFilters(prev => ({
      ...prev,
      ...presetFilters
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      department: '',
      minBudget: '',
      maxBudget: '',
      status: '',
      deadlineFrom: '',
      deadlineTo: '',
      difficulty: '',
      urgency: '',
      skills: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="task-list-container">
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters & Sorting</h3>
          <button onClick={resetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>

        <FilterPresets onApplyPreset={handlePresetApply} />

        <div className="filters-grid">
          {/* Existing filters */}
          {/* ... (previous filter inputs) ... */}

          {/* Additional filters */}
          <div className="filter-group">
            <label>Difficulty Level</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All Difficulties</option>
              {filterOptions.difficulties.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Urgency Level</label>
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
            >
              <option value="">All Urgency Levels</option>
              {filterOptions.urgencyLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Required Skills</label>
            <div className="skills-select">
              {filterOptions.commonSkills.map(skill => (
                <label key={skill} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill)}
                    onChange={(e) => {
                      const currentSkills = filters.skills ? filters.skills.split(',') : [];
                      const newSkills = e.target.checked
                        ? [...currentSkills, skill]
                        : currentSkills.filter(s => s !== skill);
                      handleSkillsChange(newSkills);
                    }}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {/* ... (previous tasks grid code) ... */}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          disabled={pagination.currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <span className="pagination-info">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          disabled={pagination.currentPage === pagination.totalPages}
          className="pagination-btn"
        >
          Next
        </button>

        <select
          value={pagination.limit}
          onChange={(e) => setPagination(prev => ({ 
            ...prev, 
            limit: Number(e.target.value),
            currentPage: 1
          }))}
          className="page-size-select"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  );
};
