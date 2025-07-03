import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/helpers';
import { LETTER_STATUS } from '../../utils/constants';

const LetterTable = ({ letters, onAction, role, isLoading }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      [LETTER_STATUS.DRAFT]: 'bg-yellow-100 text-yellow-800',
      [LETTER_STATUS.PENDING]: 'bg-blue-100 text-blue-800',
      [LETTER_STATUS.APPROVED]: 'bg-green-100 text-green-800',
      [LETTER_STATUS.REJECTED]: 'bg-red-100 text-red-800',
      [LETTER_STATUS.CLOSED]: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusMap[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (letters.length === 0) {
    return <p className="text-center py-4">No letters found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {letters.map((letter) => (
            <tr key={letter.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{letter.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{letter.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{letter.from}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(letter.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getStatusBadge(letter.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {role === 'ssm' && letter.status === LETTER_STATUS.DRAFT && (
                  <button
                    onClick={() => onAction('send', letter.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Send
                  </button>
                )}
                {role === 'gm' && letter.status === LETTER_STATUS.PENDING && (
                  <>
                    <button
                      onClick={() => onAction('approve', letter.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction('reject', letter.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onAction('close', letter.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Close
                    </button>
                  </>
                )}
                <a 
                  href={`/letters/${letter.id}`} 
                  className="text-indigo-600 hover:text-indigo-900 ml-3"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LetterTable.propTypes = {
  letters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      rbLetterNo: PropTypes.string
    })
  ).isRequired,
  onAction: PropTypes.func.isRequired,
  role: PropTypes.oneOf(['user', 'ssm', 'gm']).isRequired,
  isLoading: PropTypes.bool
};

LetterTable.defaultProps = {
  isLoading: false
};

export default LetterTable;