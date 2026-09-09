import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import '../assets/css/dentist.css';

export default function Dentists() {
  const { doctors, loadingDoctors, errorDoctors, refreshDoctors } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  // Extract unique specialties for the filter dropdown
  const specialties = useMemo(() => {
    const list = new Set();
    doctors.forEach((d) => {
      if (d.role) list.add(d.role);
      if (d.specialty) {
        d.specialty.split('&').forEach((s) => list.add(s.trim()));
      }
    });
    return Array.from(list);
  }, [doctors]);

  // Filter doctors based on search query and selected specialty
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doctor.name.toLowerCase().includes(q) ||
        (doctor.role && doctor.role.toLowerCase().includes(q)) ||
        (doctor.specialty && doctor.specialty.toLowerCase().includes(q)) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(q));

      const matchesSpecialty =
        selectedSpecialty === 'ALL' ||
        (doctor.role && doctor.role.toLowerCase() === selectedSpecialty.toLowerCase()) ||
        (doctor.specialty && doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()));

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('ALL');
  };

  return (
    <div className="page-dentist">
      <div className="thefirstdent">
        <h2>Our Doctors & Medical Team</h2>
        <p>Meet our highly qualified team of dental consultants, surgeons, and healthcare specialists.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-container">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search doctors by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <select
          className="specialty-select"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="ALL">All Specialties & Roles</option>
          <option value="HEAD DENTIST">Head Dentist</option>
          <option value="DENTIST">Dentist</option>
          <option value="Dental Implants">Dental Implants</option>
          <option value="Cosmetic">Cosmetic Dentistry</option>
          <option value="Orthodontics">Orthodontics</option>
          <option value="Pediatric">Pediatric Dentistry</option>
          <option value="NURSE">Nursing & Care Staff</option>
        </select>

        {(searchQuery || selectedSpecialty !== 'ALL') && (
          <button className="clear-btn" onClick={handleClearFilters}>
            <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i> Reset Filters
          </button>
        )}
      </div>

      <div className="theseconddent">
        {errorDoctors && (
          <div style={{ maxWidth: '1000px', margin: '0 auto 20px', padding: '0 20px' }}>
            <AlertMessage
              type="error"
              message={`Error loading doctors: ${errorDoctors}`}
              onClose={refreshDoctors}
            />
          </div>
        )}

        {loadingDoctors ? (
          <LoadingSpinner text="Retrieving doctors directory..." size="large" />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState
            title="No Doctors Found"
            description={`No medical staff match "${searchQuery || selectedSpecialty}". Try modifying your search criteria.`}
            icon="fa-user-doctor"
            actionText="Reset Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <div className="docotors" id="dentist">
            <div className="flex1">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        )}

        <div className="s">
          <Link to="/appointment" title="Book an appointment">
            <i className="fa-solid fa-calendar-check"></i> Make An Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
