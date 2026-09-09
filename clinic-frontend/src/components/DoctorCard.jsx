import React from 'react';
import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  // Map doctor id to cv anchor tag or route
  const cvLink = `/cv/${doctor.id}`;

  return (
    <div className="ard1 doctor-card-item">
      <div className="mg">
        <img
          src={doctor.image || '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png'}
          alt={doctor.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png';
          }}
        />
      </div>

      <div className="on">
        <h2>{doctor.name}</h2>
        <h3>{doctor.role || 'DENTIST'}</h3>
        <span className="doc-specialty-pill">{doctor.specialty}</span>

        <div className="doc-social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
            <i className="fa-brands fa-twitter"></i>
          </a>
        </div>

        <div className="cv-actions">
          <Link to={cvLink} className="cv-btn" title={`View ${doctor.name} CV`}>
            CV
          </Link>
          <Link
            to={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
            className="book-mini-btn"
            title="Book appointment with this doctor"
          >
            <i className="fa-solid fa-calendar-check"></i> Book
          </Link>
        </div>

        <p>{doctor.bio}</p>
      </div>
    </div>
  );
}
