import React, { useContext, useEffect } from 'react';
import { LetterContext } from '../context/LetterContext';

const Dashboard = () => {
  const { letters, fetchLetters } = useContext(LetterContext);

  useEffect(() => {
    fetchLetters();
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: 'white', color: 'black' }}>
      <h2>
        <img src="/indianrailways-whitebg.png" alt="Indian Railways" style={{ height: '1.2em', verticalAlign: 'middle', marginRight: '0.5em' }} />
        Letters Dashboard
      </h2>
      {letters && letters.length > 0 ? (
        <ul>
          {letters.map((letter) => (
            <li key={letter._id}>
              <strong>{letter.subject}</strong> — {letter.status} <br />
              From: {letter.from} → To: {letter.to} <br />
              Date: {letter.date}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No letters found.</p>
      )}
    </div>
  );
};

export default Dashboard;
