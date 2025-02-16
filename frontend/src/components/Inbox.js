import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Inbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      fetchMessages(selectedTask);
    }
  }, [selectedTask]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/messages/conversations',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setConversations(response.data);
    } catch (error) {
      setError('Error fetching conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/messages/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(response.data);
    } catch (error) {
      setError('Error fetching messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        {
          taskId: selectedTask,
          content: newMessage,
          receiverId: getReceiverId()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      setError('Error sending message');
    }
  };

  const handleInterestResponse = async (messageId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/messages/${messageId}/interest`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh messages
      fetchMessages(selectedTask);
    } catch (error) {
      setError('Error updating interest status');
    }
  };

  const getReceiverId = () => {
    const conversation = conversations.find(c => c._id === selectedTask);
    if (!conversation) return null;
    
    return conversation.lastMessage.sender._id === user.id
      ? conversation.lastMessage.receiver._id
      : conversation.lastMessage.sender._id;
  };

  return (
    <div className="inbox-container">
      <div className="conversations-list">
        <h2>Conversations</h2>
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation._id}
              className={`conversation-item ${selectedTask === conversation._id ? 'active' : ''}`}
              onClick={() => setSelectedTask(conversation._id)}
            >
              <div className="conversation-header">
                <h3>{conversation._id.title}</h3>
                {conversation.unreadCount > 0 && (
                  <span className="unread-badge">{conversation.unreadCount}</span>
                )}
              </div>
              <p className="last-message">
                {conversation.lastMessage.content.substring(0, 50)}...
              </p>
              <span className="timestamp">
                {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="messages-container">
        {selectedTask ? (
          <>
            <div className="messages-list">
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {message.content}
                    {message.interestStatus === 'pending' && user.role === 'TaskPoster' && (
                      <div className="interest-actions">
                        <button
                          onClick={() => handleInterestResponse(message._id, 'accepted')}
                          className="accept-btn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleInterestResponse(message._id, 'rejected')}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {message.interestStatus && (
                      <div className={`interest-status ${message.interestStatus}`}>
                        {message.interestStatus.charAt(0).toUpperCase() + message.interestStatus.slice(1)}
                      </div>
                    )}
                  </div>
                  <span className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox; 

