import axios from "axios";

const API = "http://localhost:5000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch users");
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/users`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create user");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API}/users/${userId}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete user");
  }
}; 