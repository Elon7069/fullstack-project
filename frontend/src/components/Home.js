import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [apiStatus, setApiStatus] = useState('Checking connection...');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/test`);
        setApiStatus(response.data.message);
      } catch (error) {
        setApiStatus('Error connecting to API');
        console.error('API Error:', error);
      }
    };

    checkApi();
  }, []);

  return (
    <div className="home">
      <h2>Home Page</h2>
      <p>API Status: {apiStatus}</p>
    </div>
  );
};

export default Home;