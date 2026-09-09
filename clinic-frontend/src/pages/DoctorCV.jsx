import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../assets/css/cv.css';

export default function DoctorCV() {
  const { doctorId } = useParams();
  const { doctors, loadingDoctors } = useData();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (doctorId) {
      setSelectedId(Number(doctorId));
    } else if (doctors.length > 0 && !selectedId) {
      setSelectedId(doctors[0].id);
    }
  }, [doctorId, doctors, selectedId]);

  if (loadingDoctors) {
    return (
      <div className="page-cv">
        <LoadingSpinner text="Loading doctor profiles..." size="large" />
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="page-cv">
        <EmptyState
          title="No Doctors Available"
          description="Doctor profiles have not been loaded yet."
          icon="fa-user-doctor"
        />
      </div>
    );
  }

  const currentDoctor = doctors.find((d) => d.id === selectedId) || doctors[0];

  return (
    <div className="page-cv">
      <div className="cv-header-nav">
        <Link to="/dentists" className="back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back to Dentists Directory
        </Link>

        {/* Doctor Selection Tabs */}
        <div className="doctor-tabs">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              className={`tab-btn ${doc.id === currentDoctor.id ? 'active' : ''}`}
              onClick={() => setSelectedId(doc.id)}
            >
              {doc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="cvs">
        <div className="cv1">
          <div className="name">
            <div>
              <h1>{currentDoctor.name}</h1>
              <span>{currentDoctor.role || 'DENTIST'} &bull; {currentDoctor.specialty}</span>
            </div>

            <img
              src={currentDoctor.image || '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png'}
              alt={currentDoctor.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png';
              }}
            />
          </div>

          <div className="f1">
            <div className="info">
              <h3>Contact Details</h3>
              <ul>
                <li><strong>Phone:</strong> {currentDoctor.phone || '01093163715'}</li>
                <li><strong>Email:</strong> {currentDoctor.email || 'info@elhuda.com'}</li>
              </ul>

              <h3>Languages</h3>
              <ul>
                {(currentDoctor.languages || ['Arabic (Native)', 'English (Fluent)']).map((lang, idx) => (
                  <li key={idx}>&bull; {lang}</li>
                ))}
              </ul>

              <h3>Clinic Location</h3>
              <p>{currentDoctor.address || 'Banha, Egypt'}</p>
            </div>

            <div className="aboutme">
              <h3>About Doctor</h3>
              <p>
                {currentDoctor.bio || 'Experienced dental surgeon committed to patient comfort and excellent smile aesthetics.'}
              </p>

              <h3>Education & Credentials</h3>
              <p>
                {currentDoctor.education || 'Faculty of Oral and Dental Medicine, Cairo University.'}
              </p>

              <h3>Work Experiences</h3>
              <ul>
                {(currentDoctor.experience || [
                  'Over 5+ years of active clinical practice in modern restorative dentistry.',
                  'Trained in painless root canal treatments and emergency dental interventions.',
                  'Specialized aesthetic veneer design and dental implantology.'
                ]).map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="social">
            <Link
              to={`/appointment?doctor=${encodeURIComponent(currentDoctor.name)}`}
              style={{
                backgroundColor: '#0cb4c0',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px',
                marginRight: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-calendar-plus"></i> Book With {currentDoctor.name}
            </Link>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
