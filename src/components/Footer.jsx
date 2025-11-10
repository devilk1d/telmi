import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiChevronUp, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import '../styles/Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col footer-about">
          <h3 className="footer-logo">TELMI</h3>
          <p className="footer-tagline">
            Menghubungkan kebutuhan, bukan sekadar jaringan.
          </p>
          <div className="social-icons">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
            <a href="#"><FiLinkedin /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Jelajahi</h4>
          <ul className="footer-links">
            <li><a href="#">Beranda</a></li>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Karir</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Layanan</h4>
          <ul className="footer-links">
            <li><a href="#">Paket Data</a></li>
            <li><a href="#">Internet Rumah</a></li>
            <li><a href="#">Telepon & SMS</a></li>
            <li><a href="#">Roaming Internasional</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Hubungi Kami</h4>
          <ul className="footer-contact">
            <li><FiPhone /> <span>0889-4456-2334</span></li>
            <li><FiMail /> <span>telmibgt@gmail.com</span></li>
            <li><FiMapPin /> <span>Depok, Indonesia</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TELMI. Semua hak dilindungi.</p>
        <button className="back-to-top" onClick={scrollToTop}>
          <FiChevronUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;








