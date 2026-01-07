import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const navStyle = {
    backgroundColor: '#001f3f', // dark blue
    padding: '10px 20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '15px',
  };

  const hoverStyle = {
    color: 'red',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={navStyle}>
      <div className="container-fluid">
        <Link className="navbar-brand" style={{ ...linkStyle, fontWeight: 'bold' }} to="/">
          CINEMAX
        </Link>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/movies"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/shows"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Shows
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/venues"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Venues
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/halls"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Halls
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/my-bookings"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                My Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/contact-us"
                style={linkStyle}
                onMouseOver={e => (e.target.style.color = hoverStyle.color)}
                onMouseOut={e => (e.target.style.color = linkStyle.color)}
              >
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light me-2"
                  style={{ borderColor: 'red', color: 'white' }}
                  onMouseOver={e => (e.target.style.color = 'red')}
                  onMouseOut={e => (e.target.style.color = 'white')}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-outline-light"
                  style={{ borderColor: 'red', color: 'white' }}
                  onMouseOver={e => (e.target.style.color = 'red')}
                  onMouseOut={e => (e.target.style.color = 'white')}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="me-3"
                  style={{ color: 'white', fontSize: '1.5rem' }}
                  onMouseOver={e => (e.target.style.color = 'red')}
                  onMouseOut={e => (e.target.style.color = 'white')}
                >
                  <FontAwesomeIcon icon={faUser} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                  style={{ borderColor: 'red', color: 'white' }}
                  onMouseOver={e => (e.target.style.color = 'red')}
                  onMouseOut={e => (e.target.style.color = 'white')}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
