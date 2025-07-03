import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Letter Monitoring System</h1>
      <nav>
        <Link to="/dashboard">Go to Dashboard</Link>
      </nav>
    </div>
  );
};

export default Home;