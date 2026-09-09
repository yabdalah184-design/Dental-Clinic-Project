import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/login.css';

export default function LoginChoice() {
  return (
    <div className="thefirstlogin">
      <div className="login-choice-wrapper">
        <div className="choice-header">
          <h1>Select Your Portal</h1>
          <p>Please choose your access level to continue to Elhuda Care</p>
        </div>

        <div className="choice-cards-container">
          <div className="div1">
            <Link to="/loginadmin" id="admin" title="Login as an Administrator">
              <i className="fa-solid fa-user-shield" style={{ marginRight: '10px' }}></i>
              Login as Admin
            </Link>
          </div>

          <div className="div2">
            <Link to="/login" id="user" title="Login as a Patient / User">
              <i className="fa-solid fa-user-injured" style={{ marginRight: '10px' }}></i>
              Login as User
            </Link>
          </div>
        </div>

        <div className="choice-footer-note">
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
            <i className="fa-solid fa-arrow-left"></i> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
