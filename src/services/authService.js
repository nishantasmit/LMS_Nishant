import axios from "axios";

const API = "http://localhost:5000/api";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API}/login`, credentials);
    return response.data; // { token, username, role }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const logout = async () => {
  return Promise.resolve();
};

export const changePassword = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API}/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Password change failed");
  }
};
