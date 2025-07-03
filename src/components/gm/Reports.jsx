import React from 'react';
import { useContext } from 'react';
import { LetterContext } from '../../context/LetterContext';
import './Reports.css';

const Reports = () => {
  const { letters, loading } = useContext(LetterContext);

  const getStatistics = () => {
    const stats = {
      total: letters.length,
      pending: letters.filter(l => l.status === 'pending_review').length,
      approved: letters.filter(l => l.status === 'approved').length,
      rejected: letters.filter(l => l.status === 'rejected').length,
      closed: letters.filter(l => l.status === 'closed').length
    };
    return stats;
  };

  return (
    <div className="reports-card">
      <h2>GM Reports</h2>
      {loading ? (
        <p className="reports-loading">Loading reports...</p>
      ) : (
        <div>
          <h3>Letter Statistics</h3>
          <ul className="reports-list">
            {Object.entries(getStatistics()).map(([key, value]) => (
              <li key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reports;