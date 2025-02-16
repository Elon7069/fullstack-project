import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DisputeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [dispute, setDispute] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDispute();
  }, [id]);

  const fetchDispute = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/disputes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDispute(response.data);
    } catch (error) {
      setError('Error fetching dispute details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('message', newMessage);
      files.forEach(file => formData.append('attachments', file));

      await axios.post(
        `http://localhost:5000/api/disputes/${id}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setNewMessage('');
      setFiles([]);
      fetchDispute();
    } catch (error) {
      setError('Error sending message');
    }
  };

  const handleResolveDispute = async (decision, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/disputes/${id}/resolve`,
        { decision, action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchDispute();
    } catch (error) {
      setError('Error resolving dispute');
    }
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;
  if (!dispute) return <div>Dispute not found</div>;

  return (
    <div className="dispute-detail-container">
      <div className="dispute-header">
        <h2>{dispute.title}</h2>
        <span className={`status-badge ${dispute.status.toLowerCase()}`}>
          {dispute.status}
        </span>
      </div>

      <div className="dispute-info">
        <div className="info-group">
          <label>Type:</label>
          <span>{dispute.type.replace(/_/g, ' ')}</span>
        </div>
        <div className="info-group">
          <label>Task:</label>
          <span>{dispute.taskId.title}</span>
        </div>
        <div className="info-group">
          <label>Created:</label>
          <span>{new Date(dispute.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="dispute-parties">
        <div className="party-card">
          <img
            src={dispute.raisedBy.avatar || '/default-avatar.png'}
            alt="Raised by"
          />
          <div className="party-info">
            <h4>Raised by</h4>
            <p>{dispute.raisedBy.name}</p>
            <p>{dispute.raisedBy.email}</p>
          </div>
        </div>
        <div className="party-card">
          <img
            src={dispute.againstUser.avatar || '/default-avatar.png'}
            alt="Against"
          />
          <div className="party-info">
            <h4>Against</h4>
            <p>{dispute.againstUser.name}</p>
            <p>{dispute.againstUser.email}</p>
          </div>
        </div>
      </div>

      <div className="dispute-description">
        <h3>Description</h3>
        <p>{dispute.description}</p>
      </div>

      {dispute.evidence.length > 0 && (
        <div className="evidence-section">
          <h3>Evidence</h3>
          <div className="evidence-files">
            {dispute.evidence.map((file, index) => (
              <a
                key={index}
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="evidence-file"
              >
                <i className="fas fa-file"></i>
                Evidence #{index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {dispute.resolution && (
        <div className="resolution-section">
          <h3>Resolution</h3>
          <div className="resolution-details">
            <p><strong>Decision:</strong> {dispute.resolution.decision}</p>
            <p><strong>Action Taken:</strong> {dispute.resolution.action}</p>
            <p>
              <strong>Resolved by:</strong> {dispute.resolution.resolvedBy.name}
              <span className="resolution-date">
                {new Date(dispute.resolution.resolvedAt).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="messages-section">
        <h3>Messages</h3>
        <div className="messages-list">
          {dispute.messages.map((message, index) => (
            <div key={index} className="message-item">
              <strong>{message.sender.name}:</strong>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail; 