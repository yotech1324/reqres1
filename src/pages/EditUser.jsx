import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Ensure you have AuthContext
import { Container, Form, Button, Alert } from "react-bootstrap";

const EditUser = ({ updateUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    axios.get(`https://reqres.in/api/users/${id}`)
      .then((response) => setUser(response.data.data))
      .catch(() => setError("Failed to fetch user data."));
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      setMessage("User updated successfully.");
      setError("");

      // **UPDATE USERS LIST WITHOUT RELOADING**
      updateUser(id, user);

      // Navigate back to user list after a slight delay
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      setError("Failed to update user backend error.");
      setMessage("");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit User</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" name="first_name" value={user.first_name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" name="last_name" value={user.last_name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={user.email} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Update User</Button>
      </Form>
    </Container>
  );
};

export default EditUser;
