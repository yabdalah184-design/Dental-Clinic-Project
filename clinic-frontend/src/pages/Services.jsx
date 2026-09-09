import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import '../assets/css/services.css';

export default function Services() {
  const { services, loadingServices, errorServices, refreshServices } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((serv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        serv.title.toLowerCase().includes(q) ||
        (serv.description && serv.description.toLowerCase().includes(q)) ||
        (serv.category && serv.category.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || serv.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [services, searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
  };

  return (
    <div className="page-services">
      <div className="serv1div">
        <h2>Our Comprehensive Dental Services</h2>
        <p>Advanced cosmetic, surgical, restorative, and pediatric dental care for your whole family.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="services-filter-bar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search services (e.g., Whitening, Crown, Extraction)..."
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
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Service Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat} Dentistry
            </option>
          ))}
        </select>

        {(searchQuery || selectedCategory !== 'ALL') && (
          <button className="clear-btn" onClick={handleClearFilters}>
            <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i> Reset Filters
          </button>
        )}
      </div>

      {errorServices && (
        <div style={{ maxWidth: '1100px', margin: '0 auto 20px', padding: '0 20px' }}>
          <AlertMessage
            type="error"
            message={`Error loading services: ${errorServices}`}
            onClose={refreshServices}
          />
        </div>
      )}

      {loadingServices ? (
        <LoadingSpinner text="Retrieving dental services..." size="large" />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description={`No dental services match "${searchQuery || selectedCategory}". Try adjusting your keywords.`}
          icon="fa-tooth"
          actionText="Reset Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Middle Consultation Callout Banner */}
      <div className="middleservices">
        <h3>
          You can easily book or inquire about any dental service by calling our clinic.
          <br />
          We guarantee exceptional care, pain-free procedures, and lifelong smiles.
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/appointment">
            <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }}></i> Make An Appointment
          </Link>
          <Link to="/contact" style={{ backgroundColor: '#1a202c' }}>
            <i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
