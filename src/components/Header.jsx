import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiSearch, FiX, FiMenu } from 'react-icons/fi';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="partner-logos">
          <span className="partner-logo">Microsoft</span>
          <span className="partner-logo">mobifone</span>
          <span className="partner-logo">mobiEdu</span>
        </div>
      </div>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">TELMI</Link>
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div 
            className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>BERANDA</Link>
            </li>
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setActiveDropdown('produk')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="#produk" onClick={(e) => { e.preventDefault(); toggleDropdown('produk') }}>
                PRODUK KAMI <FiChevronDown className="dropdown-arrow" />
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'produk' ? 'active' : ''}`}>
                <li><a href="#paket-data">Paket Data</a></li>
                <li><a href="#paket-unlimited">Paket Unlimited</a></li>
                <li><a href="#paket-premium">Paket Premium</a></li>
                <li><a href="#paket-khusus">Paket Khusus</a></li>
              </ul>
            </li>
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setActiveDropdown('layanan')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="#layanan" onClick={(e) => { e.preventDefault(); toggleDropdown('layanan') }}>
                LAYANAN KAMI <FiChevronDown className="dropdown-arrow" />
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'layanan' ? 'active' : ''}`}>
                <li><a href="#internet">Internet</a></li>
                <li><a href="#sms">SMS</a></li>
                <li><a href="#telepon">Telepon</a></li>
                <li><a href="#roaming">Roaming</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#tentang" onClick={() => setIsMenuOpen(false)}>TENTANG KAMI</a>
            </li>
            <li className="nav-item">
              <a href="#kontak" onClick={() => setIsMenuOpen(false)}>KONTAK</a>
            </li>
            <li className="nav-item search-bar">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Cari..." />
            </li>
            <li className="nav-item cms-link">
              <Link to="/cms" onClick={() => setIsMenuOpen(false)} className="cms-button">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;





