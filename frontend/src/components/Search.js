import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchType, setSearchType] = useState('tasks'); // 'tasks' or 'users'
  const [searchParams, setSearchParams] = useState({
    keyword: queryParams.get('keyword') || '',
    type: queryParams.get('type') || '',
    department: queryParams.get('department') || '',
    minBudget: queryParams.get('minBudget') || '',
    maxBudget: queryParams.get('maxBudget') || '',
    status: queryParams.get('status') || '',
    skills: queryParams.get('skills') || '',
    minRating: queryParams.get('minRating') || '',
    sortBy: queryParams.get('sortBy') || '',
    page: parseInt(queryParams.get('page')) || 1
  });

  const [results, setResults] = useState({
    items: [],
    pagination: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.keyword) {
      performSearch();
    }
  }, [searchParams.page, searchType]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError('');

      const queryString = new URLSearchParams({
        ...searchParams,
        page: searchParams.page
      }).toString();

      const response = await axios.get(
        `http://localhost:5000/api/search/${searchType}?${queryString}`
      );

      setResults({
        items: searchType === 'tasks' ? response.data.tasks : response.data.users,
        pagination: response.data.pagination
      });

      // Update URL with search params
      navigate(`/search?${queryString}`);
    } catch (error) {
      setError('Error performing search');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 }));
    performSearch();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-type-toggle">
          <button
            className={searchType === 'tasks' ? 'active' : ''}
            onClick={() => setSearchType('tasks')}
          >
            Search Tasks
          </button>
          <button
            className={searchType === 'users' ? 'active' : ''}
            onClick={() => setSearchType('users')}
          >
            Search Solvers
          </button>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleInputChange}
              placeholder={`Search ${searchType}...`}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>

          <div className="filters-section">
            {searchType === 'tasks' ? (
              <>
                <select
                  name="type"
                  value={searchParams.type}
                  onChange={handleInputChange}
                >
                  <option value="">All Types</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Research">Research</option>
                </select>

                <select
                  name="department"
                  value={searchParams.department}
                  onChange={handleInputChange}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                </select>

                <div className="budget-range">
                  <input
                    type="number"
                    name="minBudget"
                    value={searchParams.minBudget}
                    onChange={handleInputChange}
                    placeholder="Min Budget"
                  />
                  <input
                    type="number"
                    name="maxBudget"
                    value={searchParams.maxBudget}
                    onChange={handleInputChange}
                    placeholder="Max Budget"
                  />
                </div>

                <select
                  name="status"
                  value={searchParams.status}
                  onChange={handleInputChange}
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                </select>
              </>
            ) : (
              <>
                <select
                  name="department"
                  value={searchParams.department}
                  onChange={handleInputChange}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                </select>

                <input
                  type="text"
                  name="skills"
                  value={searchParams.skills}
                  onChange={handleInputChange}
                  placeholder="Skills (comma-separated)"
                />

                <select
                  name="minRating"
                  value={searchParams.minRating}
                  onChange={handleInputChange}
                >
                  <option value="">Min Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </>
            )}

            <select
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleInputChange}
            >
              <option value="">Sort By</option>
              <option value="createdAt">Newest</option>
              <option value="budget">Budget</option>
              {searchType === 'users' && <option value="rating">Rating</option>}
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="search-results">
          {searchType === 'tasks' ? (
            <div className="tasks-grid">
              {results.items.map(task => (
                <div key={task._id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-details">
                    <span>Budget: ₹{task.budget}</span>
                    <span>Type: {task.type}</span>
                    <span>Status: {task.status}</span>
                  </div>
                  <div className="task-footer">
                    <span>Posted by: {task.postedBy.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="users-grid">
              {results.items.map(user => (
                <div key={user._id} className="user-card">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <h3>{user.name}</h3>
                  <div className="user-details">
                    <span>Rating: {user.averageRating} ⭐</span>
                    <span>Department: {user.department}</span>
                  </div>
                  <div className="skills-list">
                    {user.skills.map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.pagination && (
            <div className="pagination">
              <button
                onClick={() => setSearchParams(prev => ({
                  ...prev,
                  page: prev.page - 1
                }))}
                disabled={results.pagination.currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {results.pagination.currentPage} of {results.pagination.pages}
              </span>
              <button
                onClick={() => setSearchParams(prev => ({
                  ...prev,
                  page: prev.page + 1
                }))}
                disabled={results.pagination.currentPage === results.pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 