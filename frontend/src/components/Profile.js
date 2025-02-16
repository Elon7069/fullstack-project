import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    bio: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${id}`);
      setProfile(response.data.user);
      setRecentTasks(response.data.recentTasks);
      setFormData({
        name: response.data.user.name,
        department: response.data.user.department,
        year: response.data.user.year,
        bio: response.data.user.bio,
        skills: response.data.user.skills,
        socialLinks: response.data.user.socialLinks
      });
    } catch (error) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataObj = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else if (key === 'socialLinks') {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else {
          formDataObj.append(key, formData[key]);
        }
      });

      if (e.target.avatar.files[0]) {
        formDataObj.append('avatar', e.target.avatar.files[0]);
      }

      const response = await axios.put(
        'http://localhost:5000/api/profile/update',
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || '/default-avatar.png'} alt={profile.name} />
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profile.averageRating}</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.completedTasks}</span>
              <span className="stat-label">Tasks Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
          {currentUser?.id === id && (
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" name="avatar" accept="image/*" />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            >
              {[1,2,3,4,5].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                skills: e.target.value.split(',').map(skill => skill.trim())
              })}
              placeholder="Separate skills with commas"
            />
          </div>

          <div className="form-group">
            <label>Social Links</label>
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: {...formData.socialLinks, linkedin: e.target.value}
              })}
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.socialLinks.github}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: {...formData.socialLinks, github: e.target.value}
              })}
            />
            <input
              type="url"
              placeholder="Portfolio URL"
              value={formData.socialLinks.portfolio}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: {...formData.socialLinks, portfolio: e.target.value}
              })}
            />
          </div>

          <button type="submit" className="save-profile-btn">Save Changes</button>
        </form>
      ) : (
        <div className="profile-content">
          <div className="profile-section">
            <h2>About</h2>
            <p>{profile.bio || 'No bio provided'}</p>
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {profile.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Recent Tasks</h2>
            <div className="recent-tasks">
              {recentTasks.map(task => (
                <div key={task._id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Reviews</h2>
            <div className="reviews-list">
              {profile.ratings.map(rating => (
                <div key={rating._id} className="review-card">
                  <div className="review-header">
                    <img 
                      src={rating.reviewerId.avatar || '/default-avatar.png'} 
                      alt={rating.reviewerId.name} 
                    />
                    <div>
                      <h4>{rating.reviewerId.name}</h4>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating.rating ? 'star filled' : 'star'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{rating.review}</p>
                  <small>Task: {rating.taskId.title}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 