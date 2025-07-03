import React, { createContext, useState, useEffect } from 'react';
import { getLetters, createLetter, updateLetter } from '../services/letterService';

export const LetterContext = createContext();

export const LetterProvider = ({ children }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLetters = async () => {
    try {
      console.log('LetterContext: Starting fetchLetters');
      setLoading(true);
      setError(null);
      const data = await getLetters();
      console.log('LetterContext: Received data:', data);
      console.log('LetterContext: Data type:', typeof data);
      console.log('LetterContext: Data length:', Array.isArray(data) ? data.length : 'not an array');
      setLetters(data);
      console.log('LetterContext: Letters state set');
    } catch (err) {
      console.error("Error fetching letters:", err);
      setError(err.message);
    } finally {
      console.log('LetterContext: Setting loading to false');
      setLoading(false);
    }
  };

  const addLetter = async (letterData) => {
    try {
      const newLetter = await createLetter(letterData);
      setLetters(prev => [newLetter, ...prev]);
      return newLetter;
    } catch (err) {
      console.error("Error creating letter:", err);
      throw err;
    }
  };

  const modifyLetter = async (letterId, updateData) => {
    try {
      const updatedLetter = await updateLetter(letterId, updateData);
      setLetters(prev => 
        prev.map(letter => 
          letter._id === letterId ? updatedLetter : letter
        )
      );
      return updatedLetter;
    } catch (err) {
      console.error("Error updating letter:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  return (
    <LetterContext.Provider value={{ 
      letters, 
      loading, 
      error,
      fetchLetters, 
      addLetter,
      modifyLetter
    }}>
      {children}
    </LetterContext.Provider>
  );
};
