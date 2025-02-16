import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DisputeList = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 1
  });

  useEffect(() => {
    fetchDisputes();
  }, [filters]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(filters);

      const response = await axios.get(
        `http://localhost:5000/api/disputes?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDisputes(response.data.disputes);
    } catch (error) {
      setError('Error fetching disputes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disputes-container">
      <div className="disputes-header">
        <h2>Disputes</h2>
        <Link to="/disputes/new" className="create-dispute-btn">
          Create New Dispute
        </Link>
      </div>

      <div className="filters-section">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
        >
          <option value="">All Types</option>
          <option value="PAYMENT_ISSUE">Payment Issue</option>
          <option value="QUALITY_ISSUE">Quality Issue</option>
          <option value="COMMUNICATION_ISSUE">Communication Issue</option>
          <option value="DEADLINE_BREACH">Deadline Breach</option>
          <option value="INAPPROPRIATE_BEHAVIOR">Inappropriate Behavior</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="disputes-list">
          {disputes.map(dispute => (
            <Link
              key={dispute._id}
              to={`/disputes/${dispute._id}`}
              className="dispute-card"
            >
              <div className="dispute-header">
                <h3>{dispute.title}</h3>
                <span className={`status-badge ${dispute.status.toLowerCase()}`}>
                  {dispute.status}
                </span>
              </div>
              
              <div className="dispute-details">
                <span>Type: {dispute.type.replace(/_/g, ' ')}</span>
                <span>Task: {dispute.taskId.title}</span>
                <span>
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="dispute-parties">
                <div className="party">
                  <img
                    src={dispute.raisedBy.avatar || '/default-avatar.png'}
                    alt="Raised by"
                  />
                  <span>Raised by: {dispute.raisedBy.name}</span>
                </div>
                <div className="party">
                  <img
                    src={dispute.againstUser.avatar || '/default-avatar.png'}
                    alt="Against"
                  />
                  <span>Against: {dispute.againstUser.name}</span>
                </div>
              </div>

              {dispute.resolution && (
                <div className="resolution-preview">
                  <i className="fas fa-gavel"></i>
                  Resolved by Admin
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputeList; 