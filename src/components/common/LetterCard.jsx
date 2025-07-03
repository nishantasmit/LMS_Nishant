import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/helpers';

const LetterCard = ({ letter }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa500';
      case 'pending_review':
        return '#ff6b35';
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      case 'closed':
        return '#9e9e9e';
      default:
        return '#2196f3';
    }
  };

  return (
    <div className="letter-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          <h3 style={{ margin: '0', color: '#333', fontSize: '18px' }}>
            {letter.subject}
          </h3>
          <span style={{
            backgroundColor: getStatusColor(letter.status),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {letter.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ 
            margin: '4px 0', 
            color: '#666', 
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            <strong>From:</strong> {letter.sender}
          </p>
          <p style={{ 
            margin: '4px 0', 
            color: '#666', 
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            <strong>To:</strong> {letter.receiver}
          </p>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ 
            margin: '4px 0', 
            color: '#333', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {letter.message.length > 100 
              ? `${letter.message.substring(0, 100)}...` 
              : letter.message
            }
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #e0e0e0',
        paddingTop: '12px',
        fontSize: '12px',
        color: '#999'
      }}>
        <p style={{ margin: '0' }}>
          <strong>Created:</strong> {formatDate(letter.createdAt)}
        </p>
        {letter.updatedAt && letter.updatedAt !== letter.createdAt && (
          <p style={{ margin: '4px 0 0 0' }}>
            <strong>Updated:</strong> {formatDate(letter.updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

LetterCard.propTypes = {
  letter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    receiver: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string
  }).isRequired
};

export default LetterCard;