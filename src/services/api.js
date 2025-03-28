import axios from "axios";

const API = axios.create({
  baseURL: "https://reqres.in/api",
});

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch users
export const fetchUsers = async (page) => {
  const response = await API.get(`/users?page=${page}`);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};
