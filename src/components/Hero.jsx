import React from 'react'
import '../styles/Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>Internet Tercepat di Indonesia</span>
            </div>
            <h1 className="hero-title">
              INTERNET CEPAT, PAKET HEMAT, LAYANAN TERPERCAYA
            </h1>
            <p className="hero-subtitle">
              Dapatkan paket data, SMS, dan telepon terbaik dengan harga terjangkau. Nikmati internet unlimited, kuota besar, dan layanan berkualitas tinggi.
            </p>
            <p className="hero-description">
              Sistem rekomendasi cerdas membantu Anda menemukan paket yang paling sesuai dengan kebutuhan penggunaan harian Anda.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50JT+</div>
                <div className="stat-label">Pelanggan Aktif</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime Jaringan</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Layanan Support</div>
              </div>
            </div>
            <div className="hero-buttons">
              <button className="btn-primary-hero">
                <span>Lihat Paket</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary-hero">
                <span>Cek Rekomendasi Saya</span>
                <span className="btn-icon">🤖</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-visual">
              <div className="floating-icon icon-4g">4G LTE</div>
              <div className="floating-icon icon-sms">SMS</div>
              <div className="floating-icon icon-phone">📞</div>
              <div className="floating-icon icon-w">📱</div>
              <div className="hero-person">
                <div className="person-placeholder">
                  <span>👩‍💼</span>
                </div>
              </div>
              <div className="network-indicator">
                <div className="signal-bars">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
                <span className="network-text">Jaringan Kuat</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-tagline">
          <p>Jutaan pelanggan sudah mempercayai TELMI untuk kebutuhan komunikasi mereka.</p>
        </div>
      </div>
    </section>
  )
}

export default Hero







