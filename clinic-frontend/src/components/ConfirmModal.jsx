import React from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px 24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isDanger ? '#fee2e2' : '#e0f2fe',
            color: isDanger ? '#ef4444' : '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            margin: '0 auto 16px',
          }}
        >
          <i className={`fa-solid ${isDanger ? 'fa-triangle-exclamation' : 'fa-circle-question'}`}></i>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          {title}
        </h3>

        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '22px', marginBottom: '24px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 18px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              color: '#475569',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 18px',
              backgroundColor: isDanger ? '#ef4444' : '#0cb4c0',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
