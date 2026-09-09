import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/home.css';

export default function Home() {
  const scrollToAdv = (e) => {
    e.preventDefault();
    const element = document.getElementById('adv');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-home">
      {/* Hero Header */}
      <section className="header" id="home">
        <div className="information">
          <div className="tooth">
            <p>
              <span className="spn1">Elhuda Care</span>
              <br />
              <span className="spn2">dental clinic services</span>
            </p>
          </div>

          <div className="middle">
            <ul>
              <li>
                <div className="icon">
                  <i className="fa-solid fa-clock fa-2x"></i>
                </div>
                <div className="text">
                  <p id="p1">Monday - Friday</p>
                  <p id="p2">8:00am - 8:00pm</p>
                </div>
              </li>
              <li>
                <div className="icon">
                  <i className="fa-solid fa-phone fa-2x"></i>
                </div>
                <div className="text">
                  <p id="p1">Call us</p>
                  <p id="p2">8:00am - 8:00pm</p>
                </div>
              </li>
              <li>
                <div className="icon">
                  <i className="fa-solid fa-location-dot fa-2x"></i>
                </div>
                <div className="text">
                  <p id="p1">Location</p>
                  <p id="p2">Banha</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="but">
            <Link to="/appointment" id="bt" title="Book an appointment">
              Make appointment <i className="fa-solid fa-calendar-days"></i>
            </Link>
          </div>
        </div>

        <div className="main">
          <div className="abs">
            <div className="s0">
              <span id="s1">E</span>
              <span id="s2">L</span>
              <span id="s3">H</span>
              <span id="s4">U</span>
              <span id="s5">D</span>
              <span id="s6">A</span>
              <span id="s7">C</span>
              <span id="s8">A</span>
              <span id="s9">R</span>
              <span id="s10">E</span>
            </div>
            <p>
              A class of medical instruction in which patients are examined and discussed.
              Dentists services that you can trust. Where you can check on your teeth.
              A group meeting devoted to the analysis and solution of concrete problems or to the acquiring of
              specific skills or knowledge.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <Link className="app" to="/contact" title="Contact Us">
                Contact us <i className="fa-solid fa-phone-flip"></i>
              </Link>
              <Link to="/about" className="course" title="Read About Us">
                About us <i className="fa-solid fa-users"></i>
              </Link>
            </div>
          </div>

          <a href="#adv" onClick={scrollToAdv} className="angels" aria-label="Scroll to advantages">
            <i className="fa-solid fa-angles-down fa-2x"></i>
          </a>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="adventages" id="adv">
        <h1>Why you choose us?</h1>
        <div className="contanier1">
          <div className="adventages1">
            <span>
              <i id="i1" className="fa-solid fa-desktop fa-3x"></i>
            </span>
            <h2>Easy Booking</h2>
            <p>You can book in our clinic very easily anywhere and at any time.</p>
          </div>
          <div className="adventages2">
            <span>
              <i id="i2" className="fa-solid fa-user-doctor fa-3x"></i>
            </span>
            <h2>Team Dentist</h2>
            <p>We have exceptional dentists providing top-notch professional care.</p>
          </div>
          <div className="adventages3">
            <span>
              <i id="i3" className="fa-sharp fa-solid fa-gem fa-3x"></i>
            </span>
            <h2>Experience</h2>
            <p>Our doctors and nurses possess decades of combined clinical experience.</p>
          </div>
        </div>

        <div className="contanier2">
          <div className="adventages4">
            <span>
              <i id="i4" className="fa-solid fa-jet-fighter-up fa-3x"></i>
            </span>
            <h2>Good Techniques</h2>
            <p>We implement the latest technological breakthroughs in modern dentistry.</p>
          </div>
          <div className="adventages5">
            <span>
              <i id="i5" className="fa-solid fa-hand-holding-dollar fa-3x"></i>
            </span>
            <h2>Best Price</h2>
            <p>We provide competitive, transparent pricing accessible to everyone.</p>
          </div>
          <div className="adventages6">
            <span>
              <i id="i6" className="fa-solid fa-user-nurse fa-3x"></i>
            </span>
            <h2>Team Nurses</h2>
            <p>Our caring and attentive nursing staff ensure you are always comfortable.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="wrd">
          <h3>About Us</h3>
          <p>
            We built <span>Elhuda Care</span> to help you keep your teeth clean and protect you from dental pain.
            The Clinic was established to be one of the most prestigious medical care facilities in the district.
            A full-fledged facility offering Pediatrics, Obstetrics, Gynaecology, Ear, Nose, Throat, Orthopedics,
            Internal medicine, and comprehensive Dental Care. Our consultants were carefully selected to comprise
            only the best qualified clinicians with extensive international training and friendly communication skills.
          </p>
        </div>
        <div className="pic">
          <img src="/images/6-e1458649449365-1024x618.jpg" alt="Clinic Interior" />
        </div>
      </section>

      <div className="aus">
        <Link to="/about" id="us">
          About us
        </Link>
      </div>

      {/* Services Preview */}
      <section className="services">
        <h1>Our Core Services</h1>
        <div className="contanier3">
          <div id="serv1">
            <img src="/images/008-dentist.png" alt="Laser Teeth Whitening" />
            <h3>Laser Teeth Whitening</h3>
            <p>
              Laser whitening is an advanced power-whitening system. A gentle bleaching product is applied
              and activated with targeted laser light for immediate dazzling results in about an hour.
            </p>
          </div>
          <div id="serv2">
            <img src="/images/006-tooth-2.png" alt="Glass Ionomer" />
            <h3>Glass Ionomer</h3>
            <p>
              Glass Ionomer Cement (GIC) is a dental restorative material used as a safe, tooth-friendly
              filling and luting cement that bonds chemically to enamel and dentin.
            </p>
          </div>
        </div>
      </section>

      <div className="as">
        <Link to="/services" id="s">
          Explore All Services
        </Link>
      </div>

      {/* Customers Section */}
      <section className="customers">
        <div className="heading">
          <h4>Happy Customers</h4>
          <div className="flex2">
            <div className="card">
              <span>
                <i className="fa-solid fa-quote-left fa-2x"></i>
              </span>
              <p id="par">
                "I highly recommend dental work in Elhuda care. My teeth are whiter and I have a much prettier
                smile and of course now I can chew my food better."
              </p>
              <div className="bx">
                <img src="/images/nirakar-yakthumba.jpg" alt="Nirakar Yakthumba" />
                <div className="h">
                  <h5>Nirakar Yakthumba</h5>
                  <h2>MUSICIAN</h2>
                </div>
              </div>
            </div>

            <div className="card">
              <span>
                <i className="fa-solid fa-quote-left fa-2x"></i>
              </span>
              <p id="par">
                "I recommend this clinic to anyone looking for reliable dental care. The professionalism and
                competence of the entire staff is truly amazing."
              </p>
              <div className="bx">
                <img src="/images/srijana-josse.jpg" alt="Srijana Josse" />
                <div className="h">
                  <h5>Srijana Josse</h5>
                  <h2>MEDIA PERSONNEL</h2>
                </div>
              </div>
            </div>

            <div className="card">
              <span>
                <i className="fa-solid fa-quote-left fa-2x"></i>
              </span>
              <p id="par">
                "Advanced dental care is not an ordinary dental clinic. The doctors possess a level of caring,
                knowledge, kindness, and professionalism that is second to none."
              </p>
              <div className="bx">
                <img
                  src="/images/f312f4fd-ce68-44b0-e404-8bb7e0dc270d-f312f4fdce6844b0e4048bb7e0dc270drendition_0_kimnew.png"
                  alt="Kim Stephen"
                />
                <div className="h">
                  <h5>Kim Stephen</h5>
                  <h2>NURSE</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="circles">
            <div className="c1"></div>
            <div className="c2"></div>
            <div className="c3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
