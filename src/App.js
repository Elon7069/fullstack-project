import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My React App</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About Page</h2>
      <p>Learn more about us here.</p>
    </div>
  );
}

export default App;