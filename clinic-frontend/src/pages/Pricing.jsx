import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { INITIAL_OFFER_PLANS } from '../services/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../assets/css/pricing.css';

export default function Pricing() {
  const { pricingSections, loadingServices } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return pricingSections
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          const matchesSearch = !q || item.name.toLowerCase().includes(q);

          let matchesPrice = true;
          const numericPrice = typeof item.price === 'number' ? item.price : parseInt(item.price, 10) || 0;

          if (priceFilter === 'LOW') {
            matchesPrice = numericPrice < 300;
          } else if (priceFilter === 'MID') {
            matchesPrice = numericPrice >= 300 && numericPrice <= 1000;
          } else if (priceFilter === 'HIGH') {
            matchesPrice = numericPrice > 1000;
          }

          return matchesSearch && matchesPrice;
        });

        return { ...section, items: filteredItems };
      })
      .filter((section) => section.items.length > 0);
  }, [pricingSections, searchQuery, priceFilter]);

  const totalFilteredCount = filteredSections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="page-pricing">
      <div className="pricing-hero">
        <h1>Transparent & Affordable Pricing</h1>
        <p>Explore our clear fees for general, surgical, restorative dental procedures, and digital X-rays.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="pricing-filter-bar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Filter price list by procedure name..."
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

        <div className="price-filter-group">
          <button
            className={`filter-chip ${priceFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setPriceFilter('ALL')}
          >
            All Prices
          </button>
          <button
            className={`filter-chip ${priceFilter === 'LOW' ? 'active' : ''}`}
            onClick={() => setPriceFilter('LOW')}
          >
            &lt; 300 EG
          </button>
          <button
            className={`filter-chip ${priceFilter === 'MID' ? 'active' : ''}`}
            onClick={() => setPriceFilter('MID')}
          >
            300 - 1000 EG
          </button>
          <button
            className={`filter-chip ${priceFilter === 'HIGH' ? 'active' : ''}`}
            onClick={() => setPriceFilter('HIGH')}
          >
            &gt; 1000 EG
          </button>
        </div>
      </div>

      {loadingServices ? (
        <LoadingSpinner text="Loading price lists..." size="large" />
      ) : totalFilteredCount === 0 ? (
        <EmptyState
          title="No Procedures Found"
          description={`No pricing items match "${searchQuery}".`}
          icon="fa-file-invoice-dollar"
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setPriceFilter('ALL');
          }}
        />
      ) : (
        filteredSections.map((section, idx) => (
          <div key={idx}>
            <div className="section-title-wrap">
              <h2 className="section-title">{section.title}</h2>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Service Procedure</th>
                    <th>Price (EG)</th>
                    <th>Available Schedule</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <span className="price-tag">{item.price} EG</span>
                      </td>
                      <td>{item.time}</td>
                      <td>
                        <Link
                          to={`/appointment?service=${encodeURIComponent(item.name)}`}
                          style={{
                            backgroundColor: '#1a202c',
                            color: '#fff',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}
                        >
                          Book Now
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Special Offer Packages Section (from original pricing.html) */}
      <section className="pricing-offers-section">
        <div className="offers-header">
          <span className="offers-badge">Exclusive Clinic Packages</span>
          <h2>Special Discount Plans & Offers</h2>
          <p>
            Choose one of our bundled treatment packages designed to give you optimal dental care with maximum savings.
          </p>
        </div>

        <div className="offers-grid">
          {INITIAL_OFFER_PLANS.map((plan) => (
            <div key={plan.id} className={`offer-card offer-card-${plan.colorTheme}`}>
              <div className="offer-card-badge">{plan.badge}</div>
              <h3 className="offer-card-title">{plan.name}</h3>
              <p className="offer-card-desc">{plan.description}</p>
              <div className="offer-discount-pill">{plan.discount}</div>
              <ul className="offer-features-list">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={`/appointment?service=${encodeURIComponent(plan.name)}`}
                className="offer-book-btn"
              >
                <i className="fa-solid fa-calendar-check"></i> Book This Plan
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
