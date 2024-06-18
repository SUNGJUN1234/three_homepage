import { useState, useEffect } from 'react';
import axios from 'axios';

const ServerStatus = () => {
  const [status, setStatus] = useState('');
  const [dbStatus, setDbStatus] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/status');
        setStatus(response.data.status);
        setDbStatus(response.data.db);
      } catch (error) {
        setStatus('Server is down');
        setDbStatus('Disconnected');
      }
    };

    fetchStatus();
  }, []);

  return (
    <div>
      <h1>Server Status</h1>
      <p>{`Server: ${status}`}</p>
      <p>{`Database: ${dbStatus}`}</p>
    </div>
  );
};

export default ServerStatus;
