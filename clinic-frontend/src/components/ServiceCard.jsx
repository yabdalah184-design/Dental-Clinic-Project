import React from 'react';

export default function ServiceCard({ service }) {
  return (
    <div className="service-card-item">
      <div className="service-icon-box">
        <img
          src={service.image || '/images/007-dental-care-1.png'}
          alt={service.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/007-dental-care-1.png';
          }}
        />
      </div>
      <h2>{service.title}</h2>
      <div className="service-meta">
        <span className="service-price">{service.price} EG</span>
        {service.category && <span className="service-category">{service.category}</span>}
      </div>
      <p>{service.description}</p>
    </div>
  );
}
