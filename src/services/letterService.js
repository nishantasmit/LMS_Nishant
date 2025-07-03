import axios from "axios";

const API = "http://localhost:5000/api/letters";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const getLetters = async () => {
  try {
    const response = await axios.get(API, {
      headers: getAuthHeaders()
    });
    console.log('letterService: Raw response:', response.data);
    // Handle both formats: { letters: [...] } and [...]
    return response.data.letters || response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch letters");
  }
};

export const getLetterById = async (id) => {
  try {
    const response = await axios.get(`${API}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Letter not found");
  }
};

export const createLetter = async (letterData) => {
  try {
    const response = await axios.post(API, letterData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create letter");
  }
};

export const updateLetter = async (id, updateData) => {
  try {
    const response = await axios.put(`${API}/${id}`, updateData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update letter");
  }
};

export const addLetter = async (letterData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  for (const key in letterData) {
    if (key !== 'pdfFile') {
      formData.append(key, letterData[key]);
    }
  }
  if (letterData.pdfFile) {
    formData.append('pdf', letterData.pdfFile);
  }
  const response = await fetch('http://localhost:5000/api/letters', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Do NOT set Content-Type here!
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to add letter');
  }
  return await response.json();
};
