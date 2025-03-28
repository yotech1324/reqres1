import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import "bootstrap/dist/css/bootstrap.min.css";

// Private Route Handling
const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<PrivateRoute element={<Users />} />} />
          <Route path="/edit-user/:id" element={<PrivateRoute element={<EditUser />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
