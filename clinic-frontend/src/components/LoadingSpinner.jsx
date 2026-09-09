import React from 'react';

export default function LoadingSpinner({ text = 'Loading data...', size = 'medium' }) {
  const spinnerSizes = {
    small: '24px',
    medium: '44px',
    large: '64px',
  };

  const dimension = spinnerSizes[size] || spinnerSizes.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: size === 'large' ? '300px' : '150px',
      color: '#0cb4c0',
      textAlign: 'center'
    }}>
      <div style={{
        width: dimension,
        height: dimension,
        border: '4px solid rgba(12, 180, 192, 0.2)',
        borderTop: '4px solid #0cb4c0',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '15px'
      }} />
      <p style={{
        color: '#555',
        fontSize: '15px',
        fontWeight: '500',
        fontFamily: "'Poppins', sans-serif"
      }}>
        {text}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
