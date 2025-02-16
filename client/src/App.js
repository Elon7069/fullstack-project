import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Flipkart Clone</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default App; 