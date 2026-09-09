import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Copyright &copy; {new Date().getFullYear()} All rights reserved | Designed & Developed with{' '}
          <i className="fa-solid fa-heart" style={{ color: '#ef4444', margin: '0 4px' }}></i>
          {' '}by{' '}
          <Link to="/" style={{ color: '#0cb4c0', fontWeight: 600, textDecoration: 'none' }}>
            ITI Team
          </Link>
        </p>
      </div>
    </footer>
  );
}
