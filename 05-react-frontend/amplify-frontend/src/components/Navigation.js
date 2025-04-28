import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ user, signOut }) => {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>Video Processing</h1>
        <div className="user-info">
          <span>Hello, {user.username}</span>
          <button onClick={signOut} className="sign-out-button">Sign Out</button>
        </div>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname === '/upload' ? 'active' : ''}>
          <Link to="/upload">Upload Video</Link>
        </li>
        <li className={location.pathname === '/search' ? 'active' : ''}>
          <Link to="/search">Search</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;