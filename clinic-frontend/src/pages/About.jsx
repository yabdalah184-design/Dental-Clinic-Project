import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/about.css';

export default function About() {
  return (
    <div className="page-about">
      <div className="thefirst">
        <div className="contact">
          <h1>About Us</h1>
          <p>Discover our journey, our values, and our commitment to world-class dental care.</p>
        </div>
      </div>

      <div className="teeth">
        <div className="heading">
          <h1>Keep your teeth healthy</h1>
          <h2>Keep smiling</h2>
        </div>

        <img
          src="/images/istockphoto-1167383362-612x612.jpg"
          alt="Happy dental patient"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/Dental-Clinic02.jpg';
          }}
        />
      </div>

      <div className="about-story-box">
        <h3>
          In this part we will tell a little story of a small group of friends who were sitting together
          laughing and having fun, and they looked up to the sky and one of them said: "we have to make an impactful
          project together". They worked tirelessly to bring the <strong>Elhuda Dental Care</strong> project into the world.
          <br /><br />
          A new dream was born, which quickly grew into a modern dental care network dedicated to helping patients keep
          their teeth strong, healthy, and shiny. We are a passionate team of doctors, specialists, nurses, and coordinators
          who toil every day to ensure your comfort. We are accessible and close to you, delivering safe and painless dental
          procedures with big offers.
          <br /><br />
          All materials, clinical instruments, and sterilisation procedures adhere strictly to international medical quality
          standards. You can place your trust blindly in Elhuda Care, knowing every single detail of your oral hygiene and
          aesthetic smile is handled by seasoned experts.
        </h3>

        <div className="slogan">
          Keep your teeth healthy <br />
          Keep smiling!
        </div>

        <div className="about-cta-row">
          <Link to="/appointment" className="about-cta-btn">
            <i className="fa-solid fa-calendar-check"></i> Book An Appointment
          </Link>
          <Link to="/contact" className="about-cta-btn" style={{ backgroundColor: '#1a202c' }}>
            <i className="fa-solid fa-phone"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
