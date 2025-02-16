import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Task Components
import TaskList from './components/tasks/TaskList';
import TaskDetail from './components/tasks/TaskDetail';
import CreateTask from './components/tasks/CreateTask';
import EditTask from './components/tasks/EditTask';

// Profile Components
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

// Messaging Components
import Inbox from './components/messaging/Inbox';
import Conversation from './components/messaging/Conversation';

// Task History Components
import TaskHistory from './components/history/TaskHistory';

// Search Components
import Search from './components/search/Search';
import SearchResults from './components/search/SearchResults';

// Notification Components
import NotificationSettings from './components/notifications/NotificationSettings';

// Dispute Components
import DisputeList from './components/disputes/DisputeList';
import DisputeDetail from './components/disputes/DisputeDetail';
import CreateDispute from './components/disputes/CreateDispute';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import AdminUsers from './components/admin/Users';
import AdminTasks from './components/admin/Tasks';
import AdminDisputes from './components/admin/Disputes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<TaskList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/results" element={<SearchResults />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Task Routes */}
                <Route path="/tasks/create" element={<CreateTask />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/tasks/:id/edit" element={<EditTask />} />

                {/* Profile Routes */}
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />

                {/* Messaging Routes */}
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/inbox/:conversationId" element={<Conversation />} />

                {/* Task History Routes */}
                <Route path="/history" element={<TaskHistory />} />

                {/* Notification Routes */}
                <Route path="/notifications/settings" element={<NotificationSettings />} />

                {/* Dispute Routes */}
                <Route path="/disputes" element={<DisputeList />} />
                <Route path="/disputes/create" element={<CreateDispute />} />
                <Route path="/disputes/:id" element={<DisputeDetail />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/tasks" element={<AdminTasks />} />
                <Route path="/admin/disputes" element={<AdminDisputes />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;