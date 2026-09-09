import React from 'react';

export default function AlertMessage({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      bg: '#e6fffa',
      border: '#38b2ac',
      color: '#234e52',
      icon: 'fa-circle-check',
    },
    error: {
      bg: '#fff5f5',
      border: '#e53e3e',
      color: '#742a2a',
      icon: 'fa-circle-exclamation',
    },
    warning: {
      bg: '#fffaf0',
      border: '#dd6b20',
      color: '#7b341e',
      icon: 'fa-triangle-exclamation',
    },
    info: {
      bg: '#ebf8ff',
      border: '#3182ce',
      color: '#2a4365',
      icon: 'fa-circle-info',
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      margin: '15px 0',
      backgroundColor: current.bg,
      borderLeft: `5px solid ${current.border}`,
      borderRadius: '6px',
      color: current.color,
      fontFamily: "'Poppins', sans-serif",
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className={`fa-solid ${current.icon}`} style={{ fontSize: '18px' }}></i>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: current.color,
            cursor: 'pointer',
            fontSize: '16px',
            padding: '2px 6px',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          title="Dismiss"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  );
}
