import React from 'react';
import { useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import './Reports.css';

const Reports = () => {
  const { letters, loading } = useContext(LetterContext);

  const getStatusCount = () => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      closed: 0
    };
    
    letters.forEach(letter => {
      counts[letter.status] = (counts[letter.status] || 0) + 1;
    });

    return counts;
  };

  return (
    <div className="reports-card">
      <h2>Reports</h2>
      {loading ? (
        <p className="reports-loading">Loading reports...</p>
      ) : (
        <div>
          <h3>Letter Status Summary</h3>
          <ul className="reports-list">
            {Object.entries(getStatusCount()).map(([status, count]) => (
              <li key={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reports;