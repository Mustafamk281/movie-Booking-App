import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/api/users/delete-account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('There was an issue deleting your account. Please try again later.');
      }
    }
  };

  const handleAdminActions = () => {
    navigate('/admin-actions');
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (!user) return <p className="text-center mt-5">Profile not found.</p>;

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">User Profile</h2>
          <table className="table table-bordered table-hover table-dark mt-4">
            <tbody>
              <tr>
                <th>Full Name</th>
                <td>{user.full_name}</td>
              </tr>
              <tr>
                <th>Username</th>
                <td>{user.user_name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{user.phone_number}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{user.role}</td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-4">
            <button onClick={handleLogout} className="btn btn-light">
              Logout
            </button>
            <button onClick={handleDeleteAccount} className="btn btn-danger">
              Delete Account
            </button>
            {user.role === 'admin' && (
              <button onClick={handleAdminActions} className="btn btn-warning">
                Admin Actions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
