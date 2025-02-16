import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';  // Make sure this import matches exactly

// Configure axios with base URL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

console.log('API URL:', process.env.REACT_APP_API_URL);

// Example of using other environment variables
const config = {
  jwtSecret: process.env.REACT_APP_JWT_SECRET,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
};

const testApi = async () => {
  try {
    const response = await axios.get('/test');
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error);
  }
};

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Welcome to My App</h1>
            <SignedIn>
              <nav>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </nav>
            </SignedIn>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ClerkProvider>
  );
}

const About = () => (
  <div>
    <h2>About Page</h2>
    <p>This is the about page.</p>
  </div>
);

export default App;