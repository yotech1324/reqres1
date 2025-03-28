import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Ensure AuthContext is correctly imported
import { Table, Button, Container, Alert, Pagination } from "react-bootstrap";

const Users = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchUsers(page);
    }
  }, [page, isAuthenticated, navigate]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch {
      setError("Failed to load users.");
    }
  };

  // Update user list dynamically after editing
  const updateUser = (id, updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === parseInt(id) ? { ...user, ...updatedUser } : user))
    );
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setMessage("User deleted successfully.");
    } catch {
      setError("Failed to delete user.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Users List</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td><img src={user.avatar} alt="avatar" width="50" /></td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/edit-user/${user.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                  <Button variant="danger" size="sm" onClick={() => deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default Users;
