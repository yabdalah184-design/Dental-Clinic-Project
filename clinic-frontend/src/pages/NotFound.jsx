import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ fontSize: '72px', color: '#0cb4c0', marginBottom: '15px' }}>
        <i className="fa-solid fa-tooth fa-bounce"></i>
      </div>
      <h1 style={{ fontSize: '48px', color: '#1a202c', marginBottom: '10px', fontFamily: "'Poppins', sans-serif" }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '450px', marginBottom: '25px', lineHeight: '24px' }}>
        Oops! The dental clinic page you are looking for might have been moved or does not exist.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: '#0cb4c0',
          color: '#fff',
          textDecoration: 'none',
          padding: '12px 28px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '15px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <i className="fa-solid fa-house"></i> Return to Homepage
      </Link>
    </div>
  );
}
