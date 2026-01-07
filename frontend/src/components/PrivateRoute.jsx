import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Access denied: You need to log in.");
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token); 
    console.log(decoded); 

    const isAdmin = decoded.role === 'admin'; 

    if (!isAdmin) {
      alert("Access denied: Admins only!");
      return <Navigate to="/home" />;
    }

    return element; 
  } catch (error) {
    alert("Invalid token");
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
