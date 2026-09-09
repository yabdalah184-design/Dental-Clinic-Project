import React from 'react';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filter keywords.',
  icon = 'fa-folder-open',
  actionText,
  onAction,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px 20px',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      margin: '30px auto',
      maxWidth: '600px',
      border: '2px dashed #cbd5e1'
    }}>
      <div style={{
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        color: '#64748b'
      }}>
        <i className={`fa-solid ${icon}`} style={{ fontSize: '28px' }}></i>
      </div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '8px',
        fontFamily: "'Poppins', sans-serif"
      }}>
        {title}
      </h3>
      <p style={{
        color: '#64748b',
        fontSize: '14px',
        maxWidth: '400px',
        marginBottom: actionText ? '20px' : '0',
        fontFamily: "'Poppins', sans-serif"
      }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            backgroundColor: '#0cb4c0',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#088a94')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#0cb4c0')}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
